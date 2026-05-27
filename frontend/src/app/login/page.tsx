"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    try {

      const {
        error
      } = await supabase.auth.signInWithPassword({

        email,
        password,
      });

      if (error) {

        alert(error.message);

        return;
      }

      alert(
        "Login successful"
      );
      document.cookie =
  "student-session=true; path=/";

      window.location.href =
  "/student-dashboard";

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );
    }
  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">

      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-5xl font-black">

          Student Login

        </h1>

        <div className="mt-10 space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
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
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
          />

          <button
            onClick={login}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
          >

            Login

          </button>

        </div>

      </div>

    </main>
  );
}