"use client";

import { createAuthClient } from 'better-auth/react';

/**
 * Browser-side Better Auth client.
 *
 * Requests go to `/api/auth/*` (Better Auth's default base path) on the same
 * origin, which is the catch-all route in `src/app/api/auth/[...all]/route.ts`.
 */
export const authClient = createAuthClient();
