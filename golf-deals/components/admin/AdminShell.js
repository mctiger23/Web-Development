"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import DemoBanner from "@/components/DemoBanner";
import { IS_DEMO } from "@/lib/config";
import { getSession, isAdmin, onAuthChange, signIn, signOut } from "@/lib/dealsApi";

// Wraps every admin page: shows the login form until an admin is signed in.
export default function AdminShell({ children }) {
  const [state, setState] = useState({ loading: true, session: null, admin: false });

  useEffect(() => {
    let alive = true;
    async function load(session) {
      const admin = await isAdmin(session);
      if (alive) setState({ loading: false, session, admin });
    }
    getSession().then(load);
    const unsubscribe = onAuthChange((session) => load(session));
    return () => {
      alive = false;
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <header className="sticky top-0 z-30">
        <DemoBanner />
        <div className="bg-stone-900">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <Logo href="/admin/" compact />
              <span className="rounded-md bg-white/15 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
                Admin
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/" className="whitespace-nowrap rounded-lg px-3 py-2 text-stone-300 hover:bg-white/10 hover:text-white">
                View site
              </Link>
              {state.session && (
                <button
                  onClick={() => signOut()}
                  className="whitespace-nowrap rounded-lg px-3 py-2 text-stone-300 hover:bg-white/10 hover:text-white"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {state.loading ? (
          <div className="flex justify-center py-24">
            <span className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-turf-700" />
          </div>
        ) : !state.session ? (
          <LoginForm />
        ) : !state.admin ? (
          <div className="mx-auto max-w-md px-4 py-20 text-center">
            <h1 className="text-xl font-bold">No admin access</h1>
            <p className="mt-2 text-stone-600">
              You&apos;re signed in as {state.session.user?.email}, but this account isn&apos;t an admin. Ask the site owner
              to add you to the <code>admins</code> table.
            </p>
            <button className="btn btn-ghost mt-6" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err.message === "Invalid login credentials" ? "Wrong email or password." : err.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm px-4 py-16">
      <form onSubmit={submit} className="card space-y-4 p-6">
        <div>
          <h1 className="text-xl font-bold">Admin sign in</h1>
          <p className="text-sm text-stone-500">Manage deals from any device.</p>
        </div>
        {IS_DEMO && (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">Demo mode: any email and password will work.</p>
        )}
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required={!IS_DEMO}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required={!IS_DEMO}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
          />
        </div>
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        <button type="submit" disabled={busy} className="btn btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
