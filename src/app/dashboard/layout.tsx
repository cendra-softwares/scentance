import { redirect } from 'next/navigation';

import { getAuthenticatedUser } from '@/lib/auth';

/**
 * Server-side admin gate for every dashboard route.
 *
 * Middleware only verifies that a session cookie exists; this layout verifies
 * the session against the database and that `profiles.role === 'admin'`.
 */
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const auth = await getAuthenticatedUser();

  if (!auth) {
    redirect('/login?redirectedFrom=/dashboard');
  }

  if (auth.profile?.role !== 'admin') {
    redirect('/');
  }

  return <>{children}</>;
}
