"use client";

import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@ludecker/ui";
import { createClient } from "@/lib/supabase/client";

const loginRouteApi = getRouteApi("/admin/login");

export function LoginForm() {
  const navigate = useNavigate();
  const { redirect } = loginRouteApi.useSearch();
  const redirectTo = redirect ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate({ to: redirectTo });
  }

  return (
    <form className="admin-form admin-login" onSubmit={handleSubmit}>
      <h1 className="admin-login__title">admin login</h1>
      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-field">
        <label htmlFor="email">email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="admin-field">
        <label htmlFor="password">password</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" variant="default" disabled={loading}>
        {loading ? "signing in…" : "sign in"}
      </Button>
    </form>
  );
}
