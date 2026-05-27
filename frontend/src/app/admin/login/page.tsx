"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {

  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin =
    async () => {

      try {

        setLoading(true);

        if (
          !email ||
          !password
        ) {

          alert(
            "Fill all fields"
          );

          return;
        }

        const {
          data,
          error
        } = await supabase
          .from("admins")
          .select(`
            *,
            colleges (
              college_code
            )
          `)
          .eq("email", email)
          .eq("password", password)
          .single();

        if (
          error ||
          !data
        ) {

          alert(
            "Invalid Credentials"
          );

          return;
        }

        document.cookie =
          "admin-session=true; path=/";

        const collegeCode =
          data.colleges.college_code;

        alert(
          "Login successful"
        );

        router.push(
          `/${collegeCode}-admin/dashboard`
        );

      } catch (error) {

        console.error(error);

        alert(
          "Something went wrong"
        );

      } finally {

        setLoading(false);
      }
    };

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] p-6 text-white">

      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="mb-3 text-4xl font-black">

          Admin Login

        </h1>

        <p className="mb-8 text-gray-400">

          Secure access to exam dashboard

        </p>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold disabled:opacity-50"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </div>

      </div>

    </main>
  );
}