import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "student" | "cafeteria";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  recovery_key: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ) => Promise<{ error: Error | null; recoveryKey?: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  recoverAccount: (
    email: string,
    recoveryKey: string,
    newPassword: string
  ) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Generate a random recovery key
const generateRecoveryKey = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "";
  for (let i = 0; i < 16; i++) {
    if (i > 0 && i % 4 === 0) key += "-";
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as Profile | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Defer profile fetch to avoid deadlock
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id).then(setProfile);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole
  ): Promise<{ error: Error | null; recoveryKey?: string }> => {
    const recoveryKey = generateRecoveryKey();
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
          recovery_key: recoveryKey,
        },
      },
    });

    if (error) {
      return { error };
    }

    if (data.user) {
      return { error: null, recoveryKey };
    }

    return { error: new Error("An unknown error occurred") };
  };

  const signIn = async (
    email: string,
    password: string
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error };
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const recoverAccount = async (
    email: string,
    recoveryKey: string,
    newPassword: string
  ): Promise<{ error: Error | null }> => {
    // First verify the recovery key matches
    const { data: profiles, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .eq("recovery_key", recoveryKey);

    if (fetchError || !profiles || profiles.length === 0) {
      return {
        error: new Error("Invalid email or recovery key"),
      };
    }

    // For now, we'll need admin intervention for password reset
    // This is a simplified version - in production you'd use a proper password reset flow
    toast({
      title: "Recovery Initiated",
      description:
        "Please contact support with your recovery key for password reset.",
    });

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        recoverAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
