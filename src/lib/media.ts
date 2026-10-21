import { eq } from 'drizzle-orm';

import type { Database } from '@/db';
import { categories, productTemplates, products } from '@/db/schema';
import { readEnv } from '@/lib/env';

const CDN_PREFIX = 'https://cdn.jsdelivr.net/gh/';
const RAW_PREFIX = 'https://raw.githubusercontent.com/';

/**
 * Map a stored image URL back to its path inside the repository.
 *
 * Only files under `public/product-images/products/` are eligible: the original
 * catalog images live at `/product-images/...` and are bundled with the Worker,
 * so they must never be deleted.
 */
export function repoPathFromImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const repo = readEnv('GITHUB_REPO') ?? 'cendra-softwares/scentance';
  let path: string | null = null;

  if (url.startsWith(CDN_PREFIX)) {
    const rest = url.slice(CDN_PREFIX.length);
    const at = rest.indexOf('@');
    if (at > 0 && rest.slice(0, at) === repo) {
      // rest is "<repo>@<ref>/<path>" — drop the ref segment too.
      const afterRef = rest.slice(at + 1).split('?')[0];
      path = afterRef.slice(afterRef.indexOf('/') + 1);
    }
  } else if (url.startsWith(RAW_PREFIX)) {
    const [owner, name, , ...rest] = url.slice(RAW_PREFIX.length).split('/');
    if (`${owner}/${name}` === repo) {
      path = rest.join('/').split('?')[0];
    }
  }

  return path && path.startsWith('public/product-images/products/') ? path : null;
}

async function githubHeaders(): Promise<Record<string, string> | null> {
  const token = readEnv('GITHUB_TOKEN');
  if (!token) return null;
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'scentance-worker',
  };
}

/** Delete a single file from the repository. Returns false when it cannot. */
export async function deleteImageFromRepo(path: string): Promise<boolean> {
  const headers = await githubHeaders();
  if (!headers) return false;

  const repo = readEnv('GITHUB_REPO') ?? 'cendra-softwares/scentance';
  const base = `https://api.github.com/repos/${repo}/contents/${path}`;

  const meta = await fetch(`${base}?ref=main`, { headers });
  if (!meta.ok) return false;

  const { sha } = (await meta.json()) as { sha?: string };
  if (!sha) return false;

  const response = await fetch(base, {
    method: 'DELETE',
    headers,
    body: JSON.stringify({
      message: `chore(images): remove ${path.replace('public/product-images/', '')}`,
      sha,
      branch: 'main',
    }),
  });

  if (!response.ok) {
    console.error('GitHub delete failed:', response.status, await response.text());
  }

  return response.ok;
}

/**
 * Delete an uploaded image once nothing references it anymore.
 *
 * Original catalog assets are shared between products, templates and
 * categories, so the reference check runs across all three tables.
 */
export async function deleteImageIfUnused(db: Database, url: string | null | undefined): Promise<boolean> {
  const path = repoPathFromImageUrl(url);
  if (!url || !path) return false;

  const [product] = await db.select({ id: products.id }).from(products).where(eq(products.image, url)).limit(1);
  if (product) return false;

  const [template] = await db
    .select({ id: productTemplates.id })
    .from(productTemplates)
    .where(eq(productTemplates.featuredImage, url))
    .limit(1);
  if (template) return false;

  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.imageUrl, url))
    .limit(1);
  if (category) return false;

  return deleteImageFromRepo(path);
}
