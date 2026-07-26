"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Question = {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  marks?: number;
};

export default function CreateExamPage() {

  const router = useRouter();

  // =========================
  // AI STATES
  // =========================

  const [topic, setTopic] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [questionCount, setQuestionCount] =
    useState(10);

  const [marksPerQuestion, setMarksPerQuestion] =
    useState(1);

  // =========================
  // EXAM STATES
  // =========================

  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [duration, setDuration] =
    useState(30);
  const [price, setPrice] =
  useState(0);

  const [isPaid, setIsPaid] =
  useState(false);
  const [examLink, setExamLink] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [questions, setQuestions] =
    useState<Question[]>([
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        marks: 1,
      },
    ]);

  // =========================
  // VERIFY ADMIN
  // =========================

  useEffect(() => {

    const verifyAdmin =
      async () => {

        try {

          const response =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/admin/verify`,
              {
                credentials: "include",
              }
            );

          if (!response.ok) {

            router.push("/admin/login");
          }

        } catch (error) {

          console.error(error);

          router.push("/admin/login");
        }
      };

    verifyAdmin();

  }, [router]);

  // =========================
  // ADD QUESTION
  // =========================

  const addQuestion = () => {

    setQuestions([
      ...questions,
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        marks: marksPerQuestion,
      },
    ]);
  };

  // =========================
  // GENERATE AI QUESTIONS
  // =========================

  const generateWithAI =
    async () => {

      if (!topic.trim()) {

        alert("Enter topic");

        return;
      }

      try {

        setLoading(true);

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/generate-ai-questions`,
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                topic,
                difficulty,
                question_count:
                  questionCount,
                marks:
                  marksPerQuestion,
              }),
            }
          );

        if (!response.ok) {

          throw new Error(
            "AI generation failed"
          );
        }

        const data =
          await response.json();

        if (
          !data.questions ||
          !Array.isArray(
            data.questions
          )
        ) {

          alert(
            "Invalid AI response"
          );

          return;
        }

        const formattedQuestions =
          data.questions.map(
            (q: any) => ({
              question:
                q.question || "",

              optionA:
                q.optionA || "",

              optionB:
                q.optionB || "",

              optionC:
                q.optionC || "",

              optionD:
                q.optionD || "",

              correctAnswer:
                q.correctAnswer || "",

              marks:
                marksPerQuestion,
            })
          );

        setQuestions(
          formattedQuestions
        );

        alert(
          "AI Questions Generated"
        );

      } catch (error) {

        console.error(error);

        alert(
          "AI generation failed"
        );

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // CREATE EXAM
  // =========================

  const handleSubmit =
    async () => {

      if (!title.trim()) {

        alert(
          "Enter exam title"
        );

        return;
      }

      if (
        questions.length === 0
      ) {

        alert(
          "Add at least one question"
        );

        return;
      }

      const examData = {

  title,
  description,
  duration,

  price,
  is_paid: isPaid,

  questions,
};

      try {

        setLoading(true);

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/create-exam`,
            {
              method: "POST",

              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                examData
              ),
            }
          );

        if (!response.ok) {

          throw new Error(
            "Failed to create exam"
          );
        }

        const data =
          await response.json();

        if (!data.exam_link) {

          alert(
            "Exam link not received"
          );

          return;
        }

        setExamLink(
          data.exam_link
        );

        alert(
          "Exam Created Successfully"
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

  // =========================
  // UI
  // =========================

  return (

    <main className="min-h-screen bg-[#060816] p-8 text-white">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-black">

            AI Exam Generator

          </h1>

          <p className="mt-3 text-lg text-gray-400">

            Create exams manually or generate questions with AI

          </p>

        </div>

        {/* AI SECTION */}

        <section className="mb-10 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-cyan-900/10 p-8">

          <h2 className="mb-6 text-3xl font-bold text-purple-400">

            Generate Questions With AI

          </h2>

          <div className="grid gap-6 md:grid-cols-2">

            <input
              type="text"
              placeholder="Topic (Example: Python OOP)"
              value={topic}
              onChange={(e) =>
                setTopic(
                  e.target.value
                )
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            />

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(
                  e.target.value
                )
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            >

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>

            </select>

            <input
              type="number"
              placeholder="Question Count"
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  Number(
                    e.target.value
                  )
                )
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            />

            <input
              type="number"
              placeholder="Marks Per Question"
              value={marksPerQuestion}
              onChange={(e) =>
                setMarksPerQuestion(
                  Number(
                    e.target.value
                  )
                )
              }
              className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none"
            />

          </div>

          <button
            type="button"
            onClick={generateWithAI}
            disabled={loading}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-5 text-xl font-bold text-white shadow-2xl"
          >

            {loading
              ? "Generating..."
              : "Generate Questions With AI"}

          </button>

        </section>

        {/* EXAM DETAILS */}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <label className="mb-2 block text-sm text-gray-300">

                Exam Title

              </label>

              <input
                type="text"
                placeholder="Enter exam title"
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              />

            </div>

            <div>

              <label className="mb-2 block text-sm text-gray-300">

                Duration (minutes)

              </label>

              <input
                type="number"
                value={duration}
                onChange={(e) =>
                  setDuration(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
              />

            </div>

          
          <div>
  <label className="mb-2 block text-sm text-gray-300">
    Paid Exam
  </label>

  <select
    value={isPaid ? "paid" : "free"}
    onChange={(e) => {
  const paid = e.target.value === "paid";
  setIsPaid(paid);

  if (!paid) {
    setPrice(0);
  }
}}
    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
  >
    <option value="free">Free Exam</option>
    <option value="paid">Paid Exam</option>
  </select>
</div>

<div>
  <label className="mb-2 block text-sm text-gray-300">
    Price (₹)
  </label>

  <input
    type="number"
    min={0}
    value={price}
    disabled={!isPaid}
    onChange={(e) =>
      setPrice(Number(e.target.value))
    }
    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none disabled:opacity-50"
    placeholder="Enter price"
  />
</div>
</div>

          <div className="mt-6">

            <label className="mb-2 block text-sm text-gray-300">

              Description

            </label>

            <textarea
              placeholder="Exam instructions..."
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              rows={4}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
            />

          </div>

        </section>

        {/* QUESTIONS */}

        <section className="mt-10">

          <h2 className="text-3xl font-bold">

            Questions

          </h2>

          <div className="mt-6 space-y-8">

            {questions.map(
              (
                question,
                index
              ) => (

                <div
                  key={index}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8"
                >

                  <h3 className="mb-6 text-2xl font-bold text-purple-400">

                    Question {index + 1}

                  </h3>

                  <textarea
                    placeholder="Enter question"
                    value={
                      question.question
                    }
                    onChange={(e) => {

                      const updated =
                        [...questions];

                      updated[index].question =
                        e.target.value;

                      setQuestions(
                        updated
                      );
                    }}
                    rows={3}
                    className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                  />

                  <div className="mt-6 grid gap-4 md:grid-cols-2">

                    {[
                      "optionA",
                      "optionB",
                      "optionC",
                      "optionD",
                    ].map(
                      (
                        option,
                        i
                      ) => (

                        <input
                          key={option}
                          type="text"
                          placeholder={`Option ${String.fromCharCode(
                            65 + i
                          )}`}
                          value={
                            (question as any)[option]
                          }
                          onChange={(e) => {

                            const updated =
                              [...questions];

                            (updated[index] as any)[option] =
                              e.target.value;

                            setQuestions(
                              updated
                            );
                          }}
                          className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none"
                        />
                      )
                    )}

                  </div>

                  <div className="mt-6">

                    <label className="mb-2 block text-sm text-gray-300">

                      Correct Answer

                    </label>

                    <select
                      value={
                        question.correctAnswer
                      }
                      onChange={(e) => {

                        const updated =
                          [...questions];

                        updated[index].correctAnswer =
                          e.target.value;

                        setQuestions(
                          updated
                        );
                      }}
                      className="rounded-xl border border-white/10 bg-black px-4 py-3 outline-none"
                    >

                      <option value="">
                        Select
                      </option>

                      <option value="A">
                        A
                      </option>

                      <option value="B">
                        B
                      </option>

                      <option value="C">
                        C
                      </option>

                      <option value="D">
                        D
                      </option>

                    </select>

                  </div>

                </div>
              )
            )}

          </div>

          <button
            onClick={addQuestion}
            className="mt-8 rounded-2xl bg-white px-8 py-4 text-lg font-bold text-black"
          >

            Add Question

          </button>

        </section>

        {/* SUBMIT */}

        <section className="mt-12 flex justify-end">

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-5 text-xl font-bold text-white shadow-2xl"
          >

            Generate Exam Link

          </button>

        </section>

        {/* GENERATED LINK */}

        {examLink && (

          <div className="mt-10 rounded-3xl border border-green-500/20 bg-green-500/10 p-8">

            <h2 className="text-2xl font-bold text-green-400">

              Exam Link Generated

            </h2>

            <a
              href={examLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block text-lg text-cyan-400 underline"
            >

              {examLink}

            </a>

          </div>

        )}

      </div>

    </main>
  );
}