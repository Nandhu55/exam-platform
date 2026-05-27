"use client";

import { useParams } from "next/navigation";

export default function StudentSignup() {

  const params = useParams();

  const collegeCode =
    params.collegeCode as string;

  return (

    <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">

      <div className="rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-4xl font-black text-cyan-400">

          Student Signup

        </h1>

        <p className="mt-6 text-xl">

          College Code:
          {" "}
          {collegeCode}

        </p>

      </div>

    </main>
  );
}