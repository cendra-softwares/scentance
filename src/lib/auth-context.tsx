"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authClient } from "@/lib/auth-client";
import { useCart } from "@/lib/store/useCart";

export type UserRole = "admin" | "customer";

export interface UserProfile {
  id: string;
  email: string | null;
  role: UserRole;
  is_guest: boolean;
  created_at: string;
}

export interface GuestSession {
  id: string;
  email: string | null;
  created_at: string;
}

interface AuthContextType {
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null; profile: UserProfile | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: (email?: string) => Promise<void>;
  convertGuestToUser: (email: string, password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchProfile(): Promise<UserProfile | null> {
  const response = await fetch("/api/auth/profile", { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as { profile: UserProfile | null };
  return data.profile;
}

async function fetchGuestSession(): Promise<GuestSession | null> {
  const response = await fetch("/api/auth/guest", { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as { session: GuestSession | null };
  return data.session;
}

function guestProfile(guest: GuestSession): UserProfile {
  return {
    id: guest.id,
    email: guest.email,
    role: "customer",
    is_guest: true,
    created_at: guest.created_at,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { clearCart } = useCart();

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        const { data } = await authClient.getSession();

        if (data?.user) {
          const userProfile = await fetchProfile();
          if (cancelled) return;

          setUser({ id: data.user.id, email: data.user.email });
          setProfile(userProfile);
          setIsGuest(false);
          return;
        }

        const guest = await fetchGuestSession();
        if (cancelled || !guest) return;

        setUser({ id: guest.id, email: guest.email ?? undefined });
        setProfile(guestProfile(guest));
        setIsGuest(true);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load session");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);

    const { data, error: signInError } = await authClient.signIn.email({
      email,
      password,
    });

    if (signInError || !data?.user) {
      const message = signInError?.message ?? "Invalid email or password";
      setError(message);
      return { error: message, profile: null };
    }

    const userProfile = await fetchProfile();
    await fetch("/api/auth/guest", { method: "DELETE" }).catch(() => undefined);

    setUser({ id: data.user.id, email: data.user.email });
    setProfile(userProfile);
    setIsGuest(false);

    return { error: null, profile: userProfile };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null);

    const { data, error: signUpError } = await authClient.signUp.email({
      email,
      password,
      name: email.split("@")[0] || email,
    });

    if (signUpError || !data?.user) {
      const message = signUpError?.message ?? "Unable to create account";
      setError(message);
      return { error: message };
    }

    await fetch("/api/auth/guest", { method: "DELETE" }).catch(() => undefined);

    setUser({ id: data.user.id, email: data.user.email });
    setProfile(await fetchProfile());
    setIsGuest(false);

    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await authClient.signOut();
    await fetch("/api/auth/guest", { method: "DELETE" }).catch(() => undefined);

    setUser(null);
    setProfile(null);
    setIsGuest(false);
    setError(null);
    clearCart();
  }, [clearCart]);

  const continueAsGuest = useCallback(async (email?: string) => {
    setError(null);

    const response = await fetch("/api/auth/guest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      setError("Failed to start a guest session");
      return;
    }

    const { session } = (await response.json()) as { session: GuestSession };

    setUser({ id: session.id, email: session.email ?? undefined });
    setProfile(guestProfile(session));
    setIsGuest(true);
  }, []);

  const convertGuestToUser = useCallback(
    async (email: string, password: string) => {
      if (!user || !isGuest) {
        return { error: "No guest session to convert" };
      }

      const { data, error: signUpError } = await authClient.signUp.email({
        email,
        password,
        name: email.split("@")[0] || email,
      });

      if (signUpError || !data?.user) {
        return { error: signUpError?.message ?? "Conversion failed" };
      }

      // The guest row has no user-owned data to merge; drop it once the real
      // account (and its auto-signed-in session) exists.
      await fetch("/api/auth/guest", { method: "DELETE" }).catch(() => undefined);

      const userProfile = await fetchProfile();
      setUser({ id: data.user.id, email: data.user.email });
      setProfile(userProfile);
      setIsGuest(false);

      return { error: null };
    },
    [isGuest, user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isGuest,
        isLoading,
        loading: isLoading,
        error,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        convertGuestToUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
