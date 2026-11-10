"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Button, TextField } from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (res?.error) return setError(res.error);

    const session = await getSession();
    router.push(
      session?.user.role === "admin" ? "/admin/facilities" : "/facilities"
    );
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow p-8 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">Login</h1>
      <TextField name="email" label="Email" type="email" required />
      <TextField name="password" label="Password" type="password" required />
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" variant="contained" size="large">
        Login
      </Button>
      <Link href="/register" className="text-center text-sm text-teal-700">
        No account yet? Register
      </Link>
    </form>
  );
}
