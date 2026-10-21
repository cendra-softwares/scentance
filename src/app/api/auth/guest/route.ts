import { and, eq, gt } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

import { getDb } from '@/db';
import { guestSessions } from '@/db/schema';

const GUEST_COOKIE = 'scentance_guest_token';
const GUEST_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

interface GuestSessionPayload {
  id: string;
  email: string | null;
  created_at: string;
}

function guestCookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: GUEST_SESSION_MAX_AGE,
  };
}

function toPayload(row: {
  id: string;
  email: string | null;
  createdAt: Date | null;
}): GuestSessionPayload {
  return {
    id: row.id,
    email: row.email,
    created_at: (row.createdAt ?? new Date()).toISOString(),
  };
}

/** Return the guest session referenced by the httpOnly cookie, if still valid. */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(GUEST_COOKIE)?.value;
  if (!token) return NextResponse.json({ session: null });

  const db = await getDb();
  const row = await db
    .select()
    .from(guestSessions)
    .where(
      and(
        eq(guestSessions.sessionToken, token),
        gt(guestSessions.expiresAt, new Date())
      )
    )
    .get();

  if (!row) {
    const response = NextResponse.json({ session: null });
    response.cookies.delete(GUEST_COOKIE);
    return response;
  }

  return NextResponse.json({ session: toPayload(row) });
}

/** Create a guest session and store its token in an httpOnly cookie. */
export async function POST(request: NextRequest) {
  let email: string | null = null;

  try {
    const body = (await request.json()) as { email?: unknown } | null;
    if (typeof body?.email === 'string' && body.email.trim().length > 0) {
      email = body.email.trim();
    }
  } catch {
    // Empty or non-JSON bodies are valid; the guest email is optional.
  }

  const db = await getDb();
  const token = crypto.randomUUID();

  const [row] = await db
    .insert(guestSessions)
    .values({
      sessionToken: token,
      email,
      expiresAt: new Date(Date.now() + GUEST_SESSION_MAX_AGE * 1000),
      lastActivity: new Date(),
    })
    .returning();

  const response = NextResponse.json({ session: toPayload(row) });
  response.cookies.set(GUEST_COOKIE, token, guestCookieOptions());
  return response;
}

/** Drop the guest session (used when converting to a real account or leaving). */
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(GUEST_COOKIE)?.value;

  if (token) {
    const db = await getDb();
    await db.delete(guestSessions).where(eq(guestSessions.sessionToken, token));
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(GUEST_COOKIE);
  return response;
}
