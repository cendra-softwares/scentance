import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { getDb } from '@/db';
import { profiles } from '@/db/schema';
import { getAuth } from '@/lib/auth-server';

export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
}

export interface AuthResult {
  user: AuthenticatedUser;
  profile: UserProfile | null;
}

export interface AdminAuthResult {
  user: AuthenticatedUser;
  profile: UserProfile & { role: 'admin' };
}

async function getProfile(userId: string): Promise<UserProfile | null> {
  const db = await getDb();
  const row = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .get();

  if (!row) return null;

  return {
    id: row.id,
    email: row.email ?? '',
    role: row.role,
    created_at: (row.createdAt ?? new Date(0)).toISOString(),
  };
}

/**
 * Get the current authenticated user and their profile.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<AuthResult | null> {
  const session = await getAuth().api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return null;

  return {
    user: { id: session.user.id, email: session.user.email },
    profile: await getProfile(session.user.id),
  };
}

/**
 * Check if the current user is an admin.
 * Returns the user if admin, null otherwise.
 */
export async function requireAdmin(): Promise<AdminAuthResult | null> {
  const result = await getAuthenticatedUser();

  if (!result) return null;
  if (result.profile?.role !== 'admin') return null;

  return {
    user: result.user,
    profile: { ...result.profile, role: 'admin' },
  };
}

/**
 * Check if the current user is authenticated (any role).
 * Returns the user if authenticated, null otherwise.
 */
export async function requireAuth(): Promise<AuthResult | null> {
  return getAuthenticatedUser();
}
