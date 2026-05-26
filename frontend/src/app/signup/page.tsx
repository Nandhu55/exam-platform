"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function SignupPage() {

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rollNumber, setRollNumber] =
    useState("");

  const [college, setCollege] =
    useState("");

  const [section, setSection] =
    useState("");

  const signup = async () => {

    try {

      const {
        data,
        error
      } = await supabase.auth.signUp({

        email,
        password,
      });

      if (error) {

        alert(error.message);

        return;
      }

      const user =
        data.user;

      if (!user) {

        alert("Signup failed");

        return;
      }

      // SAVE PROFILE

      const { error: profileError } =
        await supabase
          .from("profiles")
          .insert({

            id: user.id,

            name,

            roll_number:
              rollNumber,

            college,

            section,

            role: "student"
          });

      if (profileError) {

        alert(
          profileError.message
        );

        return;
      }

      alert(
        "Signup successful"
      );

      window.location.href =
        "/login";

    } catch (error) {

      console.error(error);

      alert(
        "Something went wrong"
      );
    }
  };

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">

      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-5xl font-black">

          Student Signup

        </h1>

        <div className="mt-10 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
          />

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

          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            onChange={(e) =>
              setRollNumber(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="College"
            value={college}
            onChange={(e) =>
              setCollege(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
          />

          <input
            type="text"
            placeholder="Section"
            value={section}
            onChange={(e) =>
              setSection(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
          />

          <button
            onClick={signup}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
          >

            Create Account

          </button>

        </div>

      </div>

    </main>
  );
}