"use client";

import { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function StudentSignupPage() {

  const params = useParams();

  const router = useRouter();

  const collegeCode =
    params.collegeCode as string;

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [rollNumber, setRollNumber] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [section, setSection] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSignup =
    async () => {

      if (
        !name ||
        !email ||
        !password ||
        !rollNumber ||
        !department ||
        !section
      ) {

        alert("Fill all fields");

        return;
      }

      try {

        setLoading(true);

        const {
          data,
          error
        } = await supabase.auth.signUp({

          email,
          password
        });

        if (error) {

          alert(error.message);

          return;
        }

        const userId =
          data.user?.id;

        if (!userId) {

          alert("User creation failed");

          return;
        }

        const {
          error: profileError
        } = await supabase
          .from("profiles")
          .insert([

            {

              id: userId,

              name,

              email,

              roll_number:
                rollNumber,

              department,

              section,

              college_code:
                collegeCode,

              role: "student"
            }
          ]);

        if (profileError) {

          alert(
            profileError.message
          );

          return;
        }

        alert(
          "Student Account Created Successfully"
        );

        router.push("/login");

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

    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">

      <div className="w-full max-w-xl rounded-3xl border border-cyan-500/20 bg-white/5 p-10">

        <h1 className="text-center text-5xl font-black text-cyan-400">

          Student Signup

        </h1>

        <p className="mt-4 text-center text-lg text-gray-300">

          College Code:
          {" "}
          {collegeCode}

        </p>

        <div className="mt-10 space-y-5">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
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
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
          />

          <input
            type="text"
            placeholder="Department"
            value={department}
            onChange={(e) =>
              setDepartment(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
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
            className="w-full rounded-2xl border border-white/10 bg-black/30 p-4 outline-none"
          />

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 py-4 text-lg font-bold"
          >

            {loading
              ? "Creating..."
              : "Create Account"}

          </button>

        </div>

      </div>

    </main>
  );
}