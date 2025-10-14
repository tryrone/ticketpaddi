"use client";

import { useState, useEffect } from "react";
import { User as FirebaseUser } from "firebase/auth";
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  resetPassword,
  onAuthStateChange,
  getUserProfile,
} from "@/lib/auth";

interface AuthState {
  user: FirebaseUser | null;
  userProfile: AnyType | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setAuthState({
          user,
          userProfile: profile,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signUpWithEmail(email, password, displayName);
      // The auth state change listener will update the state
    } catch (error: AnyType) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithEmail(email, password);
      // The auth state change listener will update the state
    } catch (error: AnyType) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signInWithGoogleProvider = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signInWithGoogle();
      // The auth state change listener will update the state
    } catch (error: AnyType) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const signOut = async () => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await authSignOut();
      // The auth state change listener will update the state
    } catch (error: AnyType) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await resetPassword(email);
      setAuthState((prev) => ({ ...prev, loading: false }));
    } catch (error: AnyType) {
      setAuthState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      throw error;
    }
  };

  const clearError = () => {
    setAuthState((prev) => ({ ...prev, error: null }));
  };

  return {
    user: authState.user,
    userProfile: authState.userProfile,
    loading: authState.loading,
    error: authState.error,
    signUp,
    signIn,
    signInWithGoogle: signInWithGoogleProvider,
    signOut,
    sendPasswordReset,
    clearError,
    isAuthenticated: !!authState.user,
  };
};
