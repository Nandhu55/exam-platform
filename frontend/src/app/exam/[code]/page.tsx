"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useParams } from "next/navigation";

export default function ExamRegistrationPage() {

  const router = useRouter();

  const params = useParams();

  const code = params.code;

  const [name, setName] =
    useState("");

  const [rollNumber, setRollNumber] =
    useState("");

  const [section, setSection] =
    useState("");

  const [college, setCollege] =
    useState("");

  const handleStartExam = async () => {

    if (
      !name ||
      !rollNumber ||
      !section ||
      !college
    ) {

      alert(
        "Please fill all details"
      );

      return;
    }

    const response = await fetch(

  `${process.env.NEXT_PUBLIC_API_URL}/create-attempt`,

  {
    method: "POST",

    headers: {
      "Content-Type":
        "application/json",
    },

    body: JSON.stringify({

      exam_code: code,

      participant_name: name,

      roll_number: rollNumber,

      section,

      college,

    }),
  }
);

const data =
  await response.json();

console.log(data);

if (!data.attempt) {

  alert(
    "Attempt creation failed"
  );

  return;
}

router.push(

`/exam/${code}/start?attempt=${data.attempt.id}`

);
  };
  return (

    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed22,transparent_40%)]" />

      {/* Header */}
      <section className="relative z-10 flex flex-col items-center pt-16 text-center">

        <div className="rounded-3xl border border-purple-500/20 bg-white/5 px-8 py-6 shadow-2xl backdrop-blur-xl">

          <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-6xl font-extrabold text-transparent">

            TekWorks

          </h1>

          <p className="mt-4 text-sm uppercase tracking-[0.4em] text-purple-400">

            Examination Portal

          </p>

          <h2 className="mt-6 text-4xl font-bold">

            Full Stack Development Test

          </h2>

        </div>

      </section>

      {/* Instructions */}
      <section className="relative z-10 mx-auto mt-14 max-w-6xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">

        <h3 className="text-2xl font-bold text-purple-400">

          Instructions

        </h3>

        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            Do not switch tabs during examination.

          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            Exam will auto-submit after maximum warnings.

          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            Ensure stable internet connection.

          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">

            Once submitted, answers cannot be changed.

          </div>

        </div>

      </section>

      {/* Candidate Form */}
      <section className="relative z-10 mx-auto mt-14 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl backdrop-blur-xl">

        <h2 className="text-3xl font-bold text-center">

          Candidate Registration

        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              Full Name

            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              placeholder="Enter your name"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none transition focus:border-purple-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              Roll Number

            </label>

            <input
              type="text"
              value={rollNumber}
              onChange={(e) =>
                setRollNumber(
                  e.target.value
                )
              }
              placeholder="Enter roll number"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none transition focus:border-purple-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              Section

            </label>

            <input
              type="text"
              value={section}
              onChange={(e) =>
                setSection(
                  e.target.value
                )
              }
              placeholder="Enter section"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none transition focus:border-purple-500"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm text-gray-400">

              College Name

            </label>

            <input
              type="text"
              value={college}
              onChange={(e) =>
                setCollege(
                  e.target.value
                )
              }
              placeholder="Enter college name"
              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none transition focus:border-purple-500"
            />

          </div>

        </div>

        {/* Start Button */}
        <div className="mt-12 flex justify-center">

          <button
            onClick={handleStartExam}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-12 py-5 text-lg font-bold shadow-2xl transition hover:scale-105"
          >

            Start Examination

          </button>

        </div>

      </section>

    </main>

  );
}