import { betterAuth, type Auth, type BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { relations } from 'drizzle-orm';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';

import * as schema from '@/db/schema';
import { getBaseUrl, getBindings, readEnv } from '@/lib/env';

/**
 * Better Auth queries the user together with its accounts during sign-in
 * (`findUserByEmail(..., { includeAccounts: true })`), which the Drizzle
 * adapter resolves through `db.query.user.findFirst({ with: { accounts } })`.
 * Drizzle only exposes those relational queries when relations are declared,
 * so they are declared here instead of in the shared `src/db/schema.ts`.
 */
const authRelations = {
  userRelations: relations(schema.user, ({ many }) => ({
    accounts: many(schema.account),
    sessions: many(schema.session),
  })),
  accountRelations: relations(schema.account, ({ one }) => ({
    user: one(schema.user, {
      fields: [schema.account.userId],
      references: [schema.user.id],
    }),
  })),
  sessionRelations: relations(schema.session, ({ one }) => ({
    user: one(schema.user, {
      fields: [schema.session.userId],
      references: [schema.user.id],
    }),
  })),
};

const authSchema = { ...schema, ...authRelations };

export type AuthDatabase = DrizzleD1Database<typeof authSchema>;
export type { Auth };

/**
 * Build a Better Auth instance bound to the D1 database of the current request.
 *
 * Bindings only exist inside the Workers runtime, so this must never run at
 * module scope: every entry point calls `getAuth()` lazily (see
 * `src/app/api/auth/[...all]/route.ts` and `src/lib/auth.ts`).
 */
function createAuth(db: AuthDatabase): Auth {
  const baseURL = readEnv('BETTER_AUTH_URL') ?? getBaseUrl();

  const options: BetterAuthOptions = {
    database: drizzleAdapter(db, {
      provider: 'sqlite',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    secret: readEnv('BETTER_AUTH_SECRET'),
    baseURL,
    trustedOrigins: [baseURL, 'http://localhost:3000'],
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: 8,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30,
      updateAge: 60 * 60 * 24,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (createdUser) => {
            // Keep the application-level profile in sync with Better Auth users.
            await db
              .insert(schema.profiles)
              .values({
                id: createdUser.id,
                email: createdUser.email,
                role: 'customer',
                isGuest: false,
              })
              .onConflictDoNothing();
          },
        },
      },
    },
    plugins: [nextCookies()],
  };

  return betterAuth(options);
}

// Better Auth instances are expensive to build; one per D1 binding (i.e. per
// isolate) is enough. The WeakMap also lets the binding be collected normally.
const authCache = new WeakMap<object, Auth>();

/** Lazily resolve the Better Auth instance for the current request. */
export function getAuth(): Auth {
  const { DB } = getBindings();

  if (!DB) {
    throw new Error(
      'D1 binding "DB" is unavailable. Better Auth can only run inside the Workers runtime.'
    );
  }

  const cached = authCache.get(DB);
  if (cached) return cached;

  const auth = createAuth(drizzle(DB, { schema: authSchema }));
  authCache.set(DB, auth);
  return auth;
}
