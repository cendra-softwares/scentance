import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from './schema';

export type Database = DrizzleD1Database<typeof schema>;

/**
 * Drizzle client bound to the D1 database for the current request.
 *
 * Every query must go through this helper: the binding only exists inside the
 * Workers runtime (`wrangler dev` / deployed Worker), never during a bare
 * `next build`.
 */
export async function getDb(): Promise<Database> {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export { schema };
