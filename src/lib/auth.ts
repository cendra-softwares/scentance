import { createClient } from '@/lib/supabase/server';

export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

/**
 * Get the current authenticated user and their profile.
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<{
  user: { id: string; email?: string };
  profile: UserProfile | null;
} | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile: profile as UserProfile | null };
}

/**
 * Check if the current user is an admin.
 * Returns the user if admin, null otherwise.
 */
export async function requireAdmin(): Promise<{
  user: { id: string; email?: string };
  profile: UserProfile;
} | null> {
  const result = await getAuthenticatedUser();

  if (!result || !result.user) return null;
  if (result.profile?.role !== 'admin') return null;

  return {
    user: result.user,
    profile: result.profile as UserProfile,
  };
}

/**
 * Check if the current user is authenticated (any role).
 * Returns the user if authenticated, null otherwise.
 */
export async function requireAuth(): Promise<{
  user: { id: string; email?: string };
  profile: UserProfile | null;
} | null> {
  const result = await getAuthenticatedUser();
  if (!result || !result.user) return null;
  return result;
}
