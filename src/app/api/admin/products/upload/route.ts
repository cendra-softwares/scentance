import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

import { requireAdmin } from '@/lib/auth';
import { readEnv } from '@/lib/env';

export const dynamic = 'force-dynamic';

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const GITHUB_API = 'https://api.github.com';

type ContentsResponse = {
  commit?: { sha?: string };
  content?: { path?: string };
};

/**
 * Store product images in the public repository.
 *
 * R2 is not enabled on this account, so uploads commit the file to
 * `public/product-images/products/` through the GitHub Contents API. The
 * returned URL is pinned to the commit SHA on jsDelivr, so it is immutable and
 * cacheable; the file is also bundled into the next Worker deploy, which is why
 * the path lives under `public/`.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = readEnv('GITHUB_TOKEN');
  const repo = readEnv('GITHUB_REPO') ?? 'cendra-softwares/scentance';

  if (!token) {
    return NextResponse.json(
      { error: 'Image storage is not configured (GITHUB_TOKEN missing)' },
      { status: 503 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = ALLOWED_TYPES[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: image/jpeg, image/png, image/webp, image/avif` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB` },
        { status: 400 }
      );
    }

    const key = `products/${randomBytes(8).toString('hex')}_${Date.now()}.${ext}`;
    const path = `public/product-images/${key}`;
    const content = Buffer.from(await file.arrayBuffer()).toString('base64');

    const response = await fetch(`${GITHUB_API}/repos/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'scentance-worker',
      },
      body: JSON.stringify({
        message: `chore(images): add ${key}`,
        content,
        branch: 'main',
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('GitHub upload failed:', response.status, detail);
      return NextResponse.json(
        { error: `Image upload failed (${response.status})` },
        { status: 502 }
      );
    }

    const json = (await response.json()) as ContentsResponse;
    const sha = json.commit?.sha;

    const url = sha
      ? `https://cdn.jsdelivr.net/gh/${repo}@${sha}/${path}`
      : `https://raw.githubusercontent.com/${repo}/main/${path}`;

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error uploading product image:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
