"use client";

import { useState } from "react";

export default function SuperAdminLogin() {

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login =
    async () => {

      if (
        email === "superadmin@examsecure.com" &&
        password === "super123"
      ) {
        
        document.cookie =
  "super-admin-session=true; path=/";
        window.location.href =
          "/super-admin/dashboard";

      } else {

        alert(
          "Invalid Super Admin Credentials"
        );
      }
    };

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">

      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-center text-5xl font-black text-cyan-400">

          Super Admin Login

        </h1>

        <div className="mt-10 space-y-6">

          <input
            type="email"
            placeholder="Super Admin Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <button
            onClick={login}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-xl font-bold"
          >

            Login

          </button>

        </div>

      </div>

    </main>
  );
}