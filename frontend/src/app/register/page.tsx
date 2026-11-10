"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { api } from "@/libs/api";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      await api("/auth/register", { method: "POST", body });
      await signIn("credentials", {
        email: body.email,
        password: body.password,
        redirect: false,
      });
      router.push("/facilities");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white rounded-xl shadow p-8 flex flex-col gap-4"
    >
      <h1 className="text-2xl font-bold">Register</h1>
      <TextField name="name" label="Name" required />
      <TextField name="email" label="Email" type="email" required />
      <TextField name="tel" label="Tel" required />
      <TextField
        name="password"
        label="Password"
        type="password"
        helperText="Use at least 6 characters"
        required
        slotProps={{ htmlInput: { minLength: 6 } }}
      />
      <div>
        <FormLabel>Role</FormLabel>
        <RadioGroup row name="role" defaultValue="member">
          <FormControlLabel value="member" control={<Radio />} label="Member" />
          <FormControlLabel value="admin" control={<Radio />} label="Admin" />
        </RadioGroup>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <Button type="submit" variant="contained" size="large">
        Create account
      </Button>
      <Link href="/login" className="text-center text-sm text-teal-700">
        Already have an account? Login
      </Link>
    </form>
  );
}
