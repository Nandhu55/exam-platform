"use client";

import { useState } from "react";

export default function CreateAdaptiveExamPage() {

  const [topic, setTopic] =
    useState("");

  const [questions, setQuestions] =
    useState(10);

  const [minDifficulty, setMinDifficulty] =
    useState(1);

  const [maxDifficulty, setMaxDifficulty] =
    useState(5);

  const [generatedLink, setGeneratedLink] =
    useState("");

  return (

    <main className="min-h-screen bg-[#060816] p-8 text-white">

      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8">

        <h1 className="text-4xl font-black">

          Adaptive AI Exam

        </h1>

        <p className="mt-3 text-gray-400">

          Create dynamic AI-powered adaptive exams

        </p>

        <div className="mt-10 space-y-6">

          {/* TOPIC */}

          <div>

            <label className="mb-2 block text-lg font-semibold">

              Exam Topic

            </label>

            <input
              type="text"
              placeholder="Python, DBMS, Java..."
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            />

          </div>

          {/* QUESTIONS */}

          <div>

            <label className="mb-2 block text-lg font-semibold">

              Total Questions

            </label>

            <input
              type="number"
              value={questions}
              onChange={(e) =>
                setQuestions(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            />

          </div>

          {/* MIN DIFFICULTY */}

          <div>

            <label className="mb-2 block text-lg font-semibold">

              Minimum Difficulty

            </label>

            <select
              value={minDifficulty}
              onChange={(e) =>
                setMinDifficulty(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            >

              <option value={1}>
                Easy
              </option>

              <option value={2}>
                Medium
              </option>

              <option value={3}>
                Hard
              </option>

            </select>

          </div>

          {/* MAX DIFFICULTY */}

          <div>

            <label className="mb-2 block text-lg font-semibold">

              Maximum Difficulty

            </label>

            <select
              value={maxDifficulty}
              onChange={(e) =>
                setMaxDifficulty(
                  Number(e.target.value)
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            >

              <option value={3}>
                Hard
              </option>

              <option value={4}>
                Expert
              </option>

              <option value={5}>
                Master
              </option>

            </select>

          </div>

          {/* BUTTON */}

          <button

            onClick={async () => {

              try {

                const response = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/create-adaptive-exam`,
                  {

                    method: "POST",

                    credentials: "include",

                    headers: {
                      "Content-Type":
                        "application/json",
                    },

                    body: JSON.stringify({

                      topic,

                      total_questions:
                        questions,

                      min_difficulty:
                        minDifficulty,

                      max_difficulty:
                        maxDifficulty,

                      college_code:
                        collegeCode

                    }),
                  }
                );

                const data =
                  await response.json();

                if (!response.ok) {

                  alert(
                    data.message ||
                    "Failed to create adaptive exam"
                  );

                  return;
                }

                const link =
                  `https://exam-platform-max.vercel.app/adaptive-exam/${data.adaptive_exam_id}`;

                setGeneratedLink(link);

              } catch (error) {

                console.error(error);

                alert(
                  "Something went wrong"
                );
              }
            }}

            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
          >

            Create Adaptive Exam

          </button>

          {/* GENERATED LINK */}

          {
            generatedLink && (

              <div className="mt-8 rounded-3xl border border-green-500/20 bg-green-500/10 p-8">

                <h2 className="text-4xl font-black text-green-400">

                  Exam Link Generated

                </h2>

                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block break-all text-2xl font-bold text-cyan-400 underline"
                >
                  {generatedLink}
                </a>

              </div>
            )
          }

        </div>

      </div>

    </main>
  );
}