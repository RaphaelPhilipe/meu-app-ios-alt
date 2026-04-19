import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { environment } from '../config/environment';
import type { BootstrapPayload } from '../types/mobile';

type Theme = {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    surfaceMuted: string;
    text: string;
    textMuted: string;
    border: string;
    danger: string;
  };
};

type AuthContextValue = {
  booting: boolean;
  token: string | null;
  bootstrap: BootstrapPayload | null;
  theme: Theme;
  signIn: (login: string, senha: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshBootstrap: () => Promise<void>;
};

const fallbackTheme: Theme = {
  colors: {
    primary: environment.tenantFallback.primaryColor,
    secondary: environment.tenantFallback.secondaryColor,
    accent: environment.tenantFallback.accentColor,
    background: '#f4f7f1',
    surface: '#ffffff',
    surfaceMuted: '#eff6ec',
    text: '#0f172a',
    textMuted: '#64748b',
    border: '#d9e5d4',
    danger: '#c0392b',
  },
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [booting, setBooting] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);

  useEffect(() => {
    async function restore(): Promise<void> {
      try {
        const savedToken = await storage.getToken();
        const savedBootstrap = await storage.getBootstrap();

        if (savedBootstrap) {
          setBootstrap(JSON.parse(savedBootstrap) as BootstrapPayload);
        }

        if (!savedToken) {
          return;
        }

        const session = await api.session(savedToken);
        if (!session.ok) {
          throw new Error('Sessao expirada.');
        }

        setToken(savedToken);
        const freshBootstrap = await api.bootstrap(savedToken);
        setBootstrap(freshBootstrap);
        await storage.setBootstrap(JSON.stringify(freshBootstrap));
      } catch {
        await storage.setToken(null);
        await storage.setBootstrap(null);
        setToken(null);
        setBootstrap(null);
      } finally {
        setBooting(false);
      }
    }

    void restore();
  }, []);

  const theme = useMemo<Theme>(() => {
    if (!bootstrap?.branding) {
      return fallbackTheme;
    }

    return {
      colors: {
        ...fallbackTheme.colors,
        primary: bootstrap.branding.primary_color || fallbackTheme.colors.primary,
        secondary: bootstrap.branding.secondary_color || fallbackTheme.colors.secondary,
        accent: bootstrap.branding.accent_color || fallbackTheme.colors.accent,
      },
    };
  }, [bootstrap]);

  async function signIn(login: string, senha: string): Promise<void> {
    const payload = await api.login(login, senha);
    setToken(payload.auth.access_token);
    setBootstrap(payload.bootstrap);
    await storage.setToken(payload.auth.access_token);
    await storage.setBootstrap(JSON.stringify(payload.bootstrap));
  }

  async function signOut(): Promise<void> {
    await api.logout(token);
    await storage.setToken(null);
    await storage.setBootstrap(null);
    setToken(null);
    setBootstrap(null);
  }

  async function refreshBootstrap(): Promise<void> {
    if (!token) {
      return;
    }

    const freshBootstrap = await api.bootstrap(token);
    setBootstrap(freshBootstrap);
    await storage.setBootstrap(JSON.stringify(freshBootstrap));
  }

  return (
    <AuthContext.Provider value={{ booting, token, bootstrap, theme, signIn, signOut, refreshBootstrap }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
