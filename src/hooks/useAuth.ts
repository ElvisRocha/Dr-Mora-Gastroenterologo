import { useEffect, useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type Rol = "admin" | "doctor" | "secretaria";

type AuthUser = {
  id: string;
  email: string;
  nombre: string;
  roles: Rol[];
};

type AuthState = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
};

const MOCK_KEY = "gastrokids:mockauth";

const MOCK_USERS: Record<string, AuthUser & { password: string }> = {
  "admin@gastrokids.cr": {
    id: "u-admin",
    email: "admin@gastrokids.cr",
    nombre: "Admin Gastro Kids",
    roles: ["admin", "doctor", "secretaria"],
    password: "admin123",
  },
  "dr.mora@gastrokids.cr": {
    id: "u-doctor",
    email: "dr.mora@gastrokids.cr",
    nombre: "Dr. Alfredo Mora",
    roles: ["doctor"],
    password: "doctor123",
  },
  "secretaria@gastrokids.cr": {
    id: "u-sec",
    email: "secretaria@gastrokids.cr",
    nombre: "Recepción Gastro Kids",
    roles: ["secretaria"],
    password: "sec123",
  },
};

function readMockUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(MOCK_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured()) {
      const cached = readMockUser();
      if (mounted) {
        setState({ user: cached, session: null, loading: false });
      }
      return () => {
        mounted = false;
      };
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const session = data.session;
      setState({
        user: session ? mapSessionUser(session) : null,
        session,
        loading: false,
      });
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setState({
        user: session ? mapSessionUser(session) : null,
        session,
        loading: false,
      });
    });

    return () => {
      mounted = false;
      sub?.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      const candidate = MOCK_USERS[email.toLowerCase().trim()];
      if (!candidate || candidate.password !== password) {
        throw new Error("Credenciales inválidas");
      }
      const { password: _pw, ...user } = candidate;
      window.localStorage.setItem(MOCK_KEY, JSON.stringify(user));
      setState({ user, session: null, loading: false });
      return user;
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return mapSessionUser(data.session!);
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      window.localStorage.removeItem(MOCK_KEY);
      setState({ user: null, session: null, loading: false });
      return;
    }
    await supabase.auth.signOut();
  }, []);

  const hasRole = useCallback(
    (rol: Rol | Rol[]) => {
      if (!state.user) return false;
      const wanted = Array.isArray(rol) ? rol : [rol];
      return wanted.some((r) => state.user!.roles.includes(r));
    },
    [state.user],
  );

  return {
    ...state,
    signIn,
    signOut,
    hasRole,
    isMock: !isSupabaseConfigured(),
  };
}

function mapSessionUser(session: Session): AuthUser {
  const meta = (session.user.user_metadata ?? {}) as {
    nombre?: string;
    roles?: Rol[];
  };
  return {
    id: session.user.id,
    email: session.user.email ?? "",
    nombre: meta.nombre ?? session.user.email ?? "Usuario",
    roles: meta.roles ?? ["doctor"],
  };
}
