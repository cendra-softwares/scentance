import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { getDb } from '@/db';
import { profiles } from '@/db/schema';
import { getAuth } from '@/lib/auth-server';

/**
 * Profile lookup for the browser auth context.
 *
 * Better Auth's session endpoint only knows the auth user; the application
 * role lives in `profiles`, which client components cannot query directly.
 */
export async function GET(request: NextRequest) {
  const session = await getAuth().api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json({ user: null, profile: null }, { status: 401 });
  }

  const db = await getDb();
  const row = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .get();

  return NextResponse.json({
    user: { id: session.user.id, email: session.user.email },
    profile: row
      ? {
          id: row.id,
          email: row.email ?? session.user.email,
          role: row.role,
          is_guest: row.isGuest ?? false,
          created_at: (row.createdAt ?? new Date(0)).toISOString(),
        }
      : null,
  });
}
