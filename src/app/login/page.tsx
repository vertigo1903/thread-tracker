"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [showSignup, setShowSignup] = useState(false);

  const [message, setMessage] = useState("");

  const signIn = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Enter your email and password.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    window.location.href = "/";
  };

  const signUp = async () => {
    setMessage("");

    if (!signupEmail || !signupPassword) {
      setMessage("Enter an email and password.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    setShowSignup(false);
    setMessage("Account created! You can now sign in.");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-red-500 bg-zinc-950 p-8 shadow-[0_0_60px_rgba(239,68,68,0.8)]">
        <h1 className="mb-2 text-4xl font-bold text-red-500">
          Thread Tracker
        </h1>

        <p className="mb-8 text-zinc-400">
          Sign in to manage your inventory.
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-black p-4 outline-none transition focus:border-red-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-zinc-700 bg-black p-4 outline-none transition focus:border-red-500"
        />

        {message && (
          <div className="mb-4 rounded-xl border border-zinc-700 bg-zinc-900 p-3 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={signIn}
          className="mb-3 w-full rounded-xl bg-red-600 py-4 font-bold transition hover:bg-red-700"
        >
          Sign In
        </button>

        <button
          type="button"
          onClick={() => {
            setMessage("");
            setShowSignup(true);
          }}
          className="w-full rounded-xl border border-zinc-700 py-4 font-bold transition hover:border-red-500"
        >
          Create Account
        </button>
      </div>

      {showSignup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl border border-red-500 bg-zinc-950 p-8 shadow-[0_0_60px_rgba(239,68,68,0.8)]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-red-500">
                Create Account
              </h2>

              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="text-3xl text-zinc-400 transition hover:text-red-500"
              >
                ×
              </button>
            </div>

            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="mb-4 w-full rounded-xl border border-zinc-700 bg-black p-4 outline-none transition focus:border-red-500"
            />

            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="mb-6 w-full rounded-xl border border-zinc-700 bg-black p-4 outline-none transition focus:border-red-500"
            />

            <button
              type="button"
              onClick={signUp}
              className="mb-3 w-full rounded-xl bg-red-600 py-4 font-bold transition hover:bg-red-700"
            >
              Create Account
            </button>

            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="w-full rounded-xl border border-zinc-700 py-4 font-bold transition hover:border-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}