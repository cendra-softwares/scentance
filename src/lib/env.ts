import { getCloudflareContext } from '@opennextjs/cloudflare';

export type CloudflareBindings = {
  DB: D1Database;
  RESEND_API_KEY?: string;
  PHONEPE_CLIENT_ID?: string;
  PHONEPE_CLIENT_SECRET?: string;
  PHONEPE_CLIENT_VERSION?: string;
  PHONEPE_ENV?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  ADMIN_EMAIL?: string;
  NEXT_PUBLIC_BASE_URL?: string;
  GITHUB_TOKEN?: string;
  GITHUB_REPO?: string;
};

/**
 * Cloudflare bindings for the current request.
 *
 * On Workers (and `next dev` with `initOpenNextCloudflareForDev()`) this returns
 * the real bindings. During `next build` there is no Cloudflare context, so it
 * returns an empty object and callers must fall back to `process.env` for plain
 * configuration values.
 */
export function getBindings(): CloudflareBindings {
  try {
    return getCloudflareContext().env as unknown as CloudflareBindings;
  } catch {
    return {} as CloudflareBindings;
  }
}

/** Read a config value from Cloudflare bindings first, then process.env. */
export function readEnv<K extends keyof CloudflareBindings>(key: K): string | undefined {
  const value = getBindings()[key];
  if (typeof value === 'string' && value.length > 0) return value;
  return process.env[key];
}

/** Base URL used for redirects and email links. */
export function getBaseUrl(): string {
  return readEnv('NEXT_PUBLIC_BASE_URL')?.replace(/\/$/, '') ?? 'https://scentenceparfum.in';
}
