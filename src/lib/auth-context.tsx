"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import { type SupabaseClient } from "@supabase/supabase-js";
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
  session_token: string;
  email: string | null;
  created_at: string;
}

interface AuthContextType {
  supabase: SupabaseClient;
  user: { id: string; email?: string } | null;
  profile: UserProfile | null;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  continueAsGuest: (email?: string) => Promise<void>;
  convertGuestToUser: (email: string, password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_TOKEN_KEY = "scentance_guest_token";

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const { clearCart } = useCart();
  
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      // Check for authenticated user first
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser({ id: authUser.id, email: authUser.email });
        
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();
        
        if (profileError) {
          console.warn("Auth check: Profile not found or restricted. Using auth user only.", profileError);
        }

        if (profileData) {
          setProfile(profileData as UserProfile);
        }
        setIsLoading(false);
        return;
      }

      // Check for guest session
      const guestToken = localStorage.getItem(GUEST_TOKEN_KEY);
      if (guestToken) {
        const { data: guestSession } = await supabase
          .from("guest_sessions")
          .select("*")
          .eq("session_token", guestToken)
          .gt("expires_at", new Date().toISOString())
          .single();

        if (guestSession) {
          setUser({ id: guestSession.id, email: guestSession.email || undefined });
          setProfile({
            id: guestSession.id,
            email: guestSession.email,
            role: "customer",
            is_guest: true,
            created_at: guestSession.created_at,
          });
          setIsGuest(true);
          setIsLoading(false);
          return;
        } else {
          // Expired guest session, clean up
          localStorage.removeItem(GUEST_TOKEN_KEY);
        }
      }

      setIsLoading(false);
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData as UserProfile);
        }
        
        // Clear guest on sign in
        localStorage.removeItem(GUEST_TOKEN_KEY);
        setIsGuest(false);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setProfile(null);
        setIsGuest(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { error: error.message };
    }
    
    // Clear guest session on successful login
    localStorage.removeItem(GUEST_TOKEN_KEY);
    setIsGuest(false);
    
    return { error: null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    clearCart();
  };

  const continueAsGuest = async (email?: string) => {
    // Create guest session in database
    const { data, error } = await supabase
      .from("guest_sessions")
      .insert([{ email }])
      .select()
      .single();

    if (error) {
      console.error("Failed to create guest session:", error);
      return;
    }

    const guestSession = data as GuestSession;
    
    // Store token locally
    localStorage.setItem(GUEST_TOKEN_KEY, guestSession.session_token);
    
    // Update state
    setUser({ id: guestSession.id, email: guestSession.email || undefined });
    setProfile({
      id: guestSession.id,
      email: guestSession.email,
      role: "customer",
      is_guest: true,
      created_at: guestSession.created_at,
    });
    setIsGuest(true);
  };

  const convertGuestToUser = async (email: string, password: string) => {
    if (!user || !isGuest) {
      return { error: "No guest session to convert" };
    }

    try {
      // Sign up the user (this creates auth.users entry)
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      
      if (signUpError) {
        return { error: signUpError.message };
      }

      // Get the new user
      const { data: { user: newUser } } = await supabase.auth.getUser();
      
      if (!newUser) {
        return { error: "Failed to create user" };
      }

      // Transfer guest data to new user (orders, etc.)
      // This would need to be done via database function
      
      // Update profile to mark as not guest
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ 
          email, 
          is_guest: false 
        })
        .eq("id", newUser.id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }

      // Clear guest session
      await supabase
        .from("guest_sessions")
        .delete()
        .eq("id", user.id);

      localStorage.removeItem(GUEST_TOKEN_KEY);
      setIsGuest(false);
      
      // Re-fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", newUser.id)
        .single();

      if (profileData) {
        setProfile(profileData as UserProfile);
      }

      return { error: null };
    } catch (err) {
      return { error: err instanceof Error ? err.message : "Conversion failed" };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        supabase,
        user,
        profile,
        isGuest,
        isLoading,
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
