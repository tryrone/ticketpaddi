"use client";

import React, { useState, useEffect } from "react";
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconUser,
  IconTicket,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signUp, signIn, signInWithGoogle, error, isAuthenticated } =
    useAuth();
  const router = useRouter();

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);

    try {
      if (isSignup) {
        if (password.length < 6) {
          setLocalError("Password must be at least 6 characters long");
          setIsSubmitting(false);
          return;
        }
        await signUp(email, password, displayName || undefined);
      } else {
        await signIn(email, password);
      }
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (err: AnyType) {
      setLocalError(err.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLocalError(null);
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      // Redirect will happen via useEffect when isAuthenticated becomes true
    } catch (err: AnyType) {
      setLocalError(err.message || "An error occurred with Google sign-in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setLocalError(null);
    setDisplayName("");
  };

  const displayError = error || localError;

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Auth Form */}
      <div className="flex flex-1 flex-col justify-between bg-white px-8 py-12 lg:px-16">
        <div>
          {/* Logo */}
          <div
            className="mb-12 flex cursor-pointer"
            onClick={() => router.push("/")}
          >
            <IconTicket size={32} className="text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold tracking-tight">
              Ticket <span className="text-blue-600">Paddi</span>
            </h1>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-md">
            <h2 className="mb-2 text-4xl font-bold tracking-tight">
              Welcome to Ticket <span className="text-blue-600">Paddi</span>
            </h2>
            <p className="mb-8 text-sm text-gray-500">
              Discover and book amazing events powered by seamless ticketing
              experiences
            </p>

            {/* Error Message */}
            {displayError && (
              <div className="mb-4 rounded-full border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {displayError}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Display Name Field (only for signup) */}
              {isSignup && (
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <IconUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <IconMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <IconLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-12 text-sm outline-none transition-all focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  required
                  disabled={isSubmitting}
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <IconEyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <IconEye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-sm font-medium text-white shadow-lg shadow-cyan-500/30 transition-all hover:shadow-xl hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isSignup ? "Creating account..." : "Signing in..."}
                  </span>
                ) : (
                  <span>{isSignup ? "Sign up" : "Login"}</span>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">or</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-200 bg-white py-4 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isSignup ? "Signup with Google" : "Login with Google"}
              </button>

              {/* Toggle Login/Signup */}
              <p className="mt-6 text-center text-sm text-gray-600">
                {isSignup
                  ? "Already have an account? "
                  : "Don't have an account? "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="font-medium text-cyan-600 hover:text-cyan-700"
                  disabled={isSubmitting}
                >
                  {isSignup ? "Login" : "Sign up"}
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Social Proof */}
        {/* <div className="mt-12 flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-pink-400 to-pink-600"></div>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600"></div>
            <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-purple-600"></div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Join with 20k+ Users!
            </p>
            <p className="text-xs text-gray-500">
              Let&apos;s see our happy customer
            </p>
          </div>
          <button className="ml-auto flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 transition-all hover:bg-gray-50">
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div> */}
      </div>

      {/* Right Panel - Hero Section */}
      <div className="hidden flex-1 lg:flex">
        <div
          className="relative flex w-full flex-col justify-between overflow-hidden p-16 text-white"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560833179-1c5ec70c15bb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2669')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/70 via-blue-900/60 to-purple-900/70"></div>

          {/* Main Content */}
          <div className="relative z-10">
            <h2 className="mb-8 max-w-xl text-5xl font-bold leading-tight drop-shadow-lg">
              Discover Amazing Events and Experiences
            </h2>
            <p className="max-w-lg text-lg leading-relaxed text-white/95 drop-shadow-md">
              Join thousands of event-goers discovering and booking
              unforgettable experiences
            </p>
          </div>

          {/* Center Content - Optional decorative elements */}
          <div className="relative z-10 flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/20 px-8 py-4 backdrop-blur-md">
                <div className="flex -space-x-2">
                  <div className="h-10 w-10 rounded-full border-2 border-white/50 bg-gradient-to-br from-pink-400 to-pink-600"></div>
                  <div className="h-10 w-10 rounded-full border-2 border-white/50 bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="h-10 w-10 rounded-full border-2 border-white/50 bg-gradient-to-br from-purple-400 to-purple-600"></div>
                </div>
                <span className="ml-2 font-semibold text-lg">
                  20k+ Active Users
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="relative z-10">
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/40 bg-white/20 px-6 py-3 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-full border-2 border-white/60 bg-white/20"></div>
                <div className="h-8 w-8 -translate-x-4 rounded-full border-2 border-white/60 bg-white/20"></div>
              </div>
              <span className="ml-2 font-medium">Trending Now</span>
            </div> */}
            <p className="max-w-lg text-lg leading-relaxed text-white/95 drop-shadow-md">
              Book tickets to concerts, festivals, sports events, and more. Your
              next unforgettable experience is just a click away.
            </p>
          </div>

          {/* Subtle gradient overlay at edges */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
