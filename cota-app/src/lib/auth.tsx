import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppState, Platform } from 'react-native';
import type { Session, User } from '@supabase/supabase-js';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { supabase } from './supabase';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  /** True only right after a fresh signup (OTP verified). Reset once consumed. */
  justSignedUp: boolean;
  /** Optional action queued for HomeScreen to pick up after welcome dismisses. */
  pendingAction: 'create' | 'join' | null;
  consumeJustSignedUp: (action?: 'create' | 'join' | null) => void;
  consumePendingAction: () => 'create' | 'join' | null;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithPhone: (phone: string) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<void>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  updateProfile: (input: { firstName: string; lastName: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [pendingAction, setPendingAction] = useState<'create' | 'join' | null>(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    const appStateSub = AppState.addEventListener('change', state => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    supabase.auth.startAutoRefresh();

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
      appStateSub.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  // After OAuth, auto-fill profiles table from provider metadata (name, photo)
  const syncOAuthProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const meta = user.user_metadata ?? {};

    // Google sends: given_name, family_name, full_name, picture / avatar_url
    // Facebook sends: full_name / name, picture / avatar_url
    const firstName =
      meta.given_name ||
      (meta.full_name ?? meta.name ?? '').split(' ')[0] ||
      '';
    const lastName =
      meta.family_name ||
      (meta.full_name ?? meta.name ?? '').split(' ').slice(1).join(' ') ||
      '';
    const avatarUrl = meta.avatar_url || meta.picture || null;

    // Only upsert if we actually have something useful
    if (!firstName && !avatarUrl) return;

    await supabase
      .from('profiles')
      .upsert(
        { id: user.id, first_name: firstName, last_name: lastName, avatar_url: avatarUrl },
        { onConflict: 'id', ignoreDuplicates: false },
      );
  };

  // Handles both PKCE (code in query params) and implicit (tokens in fragment)
  const oauthSignIn = async (provider: 'google' | 'facebook') => {
    const redirectTo = 'cota://auth/callback';
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error) throw error;
    if (!data.url) throw new Error(`Impossible d'obtenir l'URL ${provider}`);

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type === 'cancel' || result.type === 'dismiss') return;
    if (result.type !== 'success') return;

    const parsed = new URL(result.url);

    // PKCE flow: code in query string → exchange for session
    const code = parsed.searchParams.get('code');
    if (code) {
      const { error: err } = await supabase.auth.exchangeCodeForSession(code);
      if (err) throw err;
      await syncOAuthProfile();
      return;
    }

    // Implicit flow: tokens in URL fragment (#access_token=...&refresh_token=...)
    const fragment = new URLSearchParams(parsed.hash.replace(/^#/, ''));
    const accessToken = fragment.get('access_token');
    const refreshToken = fragment.get('refresh_token');
    if (accessToken && refreshToken) {
      const { error: err } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (err) throw err;
      await syncOAuthProfile();
      return;
    }

    throw new Error('Connexion échouée — réessayez');
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      justSignedUp,
      pendingAction,
      consumeJustSignedUp: (action: 'create' | 'join' | null = null) => {
        if (action) setPendingAction(action);
        setJustSignedUp(false);
      },
      consumePendingAction: () => {
        const a = pendingAction;
        setPendingAction(null);
        return a;
      },

      signUp: async (email, password, firstName, lastName) => {
        // Store names as user_metadata — they survive the email-confirm step
        // and get synced into `profiles` once the session is created post-OTP.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName?.trim() ?? null,
              last_name: lastName?.trim() ?? null,
            },
          },
        });
        if (error) throw error;

        // Supabase anti-enumeration: when the email already exists, signUp
        // returns 200 with an empty identities array and sends NO email.
        // Surface this clearly instead of letting the user wait for a code
        // that will never arrive.
        if (data.user && (data.user.identities?.length ?? 0) === 0) {
          throw new Error('Cet email est déjà utilisé. Connectez-vous ou réinitialisez votre mot de passe.');
        }
      },

      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },

      signInWithApple: async () => {
        if (Platform.OS !== 'ios') throw new Error('Apple Sign-In est disponible uniquement sur iOS');
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });
        if (!credential.identityToken) throw new Error('Apple n\'a pas retourné de token');
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (error) throw error;
      },

      signInWithGoogle: async () => {
        await oauthSignIn('google');
      },

      signInWithFacebook: async () => {
        await oauthSignIn('facebook');
      },

      signInWithPhone: async (phone: string) => {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
      },

      verifyOtp: async (email, token) => {
        const { data, error } = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        });
        if (error) throw error;
        // Session is now active — flush user_metadata names into `profiles`.
        const user = data.user;
        if (user) {
          const meta = (user.user_metadata ?? {}) as { first_name?: string | null; last_name?: string | null };
          if (meta.first_name || meta.last_name) {
            await supabase.from('profiles').upsert(
              {
                id: user.id,
                ...(meta.first_name ? { first_name: meta.first_name } : {}),
                ...(meta.last_name ? { last_name: meta.last_name } : {}),
              },
              { onConflict: 'id' },
            );
          }
        }
        // Flag a fresh signup so the Main stack can show the welcome screen
        // before the home tabs.
        setJustSignedUp(true);
      },

      verifyPhoneOtp: async (phone, token) => {
        const { error } = await supabase.auth.verifyOtp({
          phone,
          token,
          type: 'sms',
        });
        if (error) throw error;
      },

      resendOtp: async email => {
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        if (error) throw error;
      },

      updateProfile: async ({ firstName, lastName }) => {
        const userId = session?.user.id;
        if (!userId) throw new Error('Not signed in');
        const { error } = await supabase
          .from('profiles')
          .update({ first_name: firstName, last_name: lastName })
          .eq('id', userId);
        if (error) throw error;
      },

      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      },
    }),
    [session, loading, justSignedUp, pendingAction],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
};
