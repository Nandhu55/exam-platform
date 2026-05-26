"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function StudentDashboard() {

  const [student, setStudent] =
    useState<any>(null);

  const [exams, setExams] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH STUDENT
  // =========================

  useEffect(() => {

    fetchStudent();

  }, []);

  const fetchStudent =
    async () => {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (!user) {

        window.location.href =
          "/login";

        return;
      }

      const { data } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

      setStudent(data);

      fetchExams();
    };

  // =========================
  // FETCH EXAMS
  // =========================

  const fetchExams =
    async () => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/adaptive-exams`
          );

        const data =
          await response.json();

        setExams(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-white">

        Loading Dashboard...

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-5xl font-black text-cyan-400">

            Student Dashboard

          </h1>

          <p className="mt-6 text-2xl font-bold">

            Welcome,
            {" "}
            {student?.name}

          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-4">

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-6">

              <p className="text-gray-400">

                Roll Number

              </p>

              <h2 className="mt-2 text-2xl font-bold">

                {student?.roll_number}

              </h2>

            </div>

            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

              <p className="text-gray-400">

                College

              </p>

              <h2 className="mt-2 text-2xl font-bold">

                {student?.college}

              </h2>

            </div>

            <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-6">

              <p className="text-gray-400">

                Section

              </p>

              <h2 className="mt-2 text-2xl font-bold">

                {student?.section}

              </h2>

            </div>

            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">

              <p className="text-gray-400">

                Role

              </p>

              <h2 className="mt-2 text-2xl font-bold capitalize">

                {student?.role}

              </h2>

            </div>

          </div>

        </div>

        {/* AVAILABLE EXAMS */}

        <div className="mt-10">

          <h2 className="text-4xl font-black text-cyan-400">

            Available Adaptive Exams

          </h2>

          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {exams.map((exam) => (

              <div
                key={exam.adaptive_exam_id}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >

                <h3 className="text-3xl font-black">

                  {exam.topic}

                </h3>

                <p className="mt-6 text-gray-300">

                  Questions:
                  {" "}
                  {exam.total_questions}

                </p>

                <p className="mt-2 text-gray-300">

                  Difficulty:
                  {" "}
                  {exam.min_difficulty}
                  {" "}
                  →
                  {" "}
                  {exam.max_difficulty}

                </p>

                <button

                  onClick={() =>
                    window.location.href =
                      `/adaptive-exam/${exam.adaptive_exam_id}`
                  }

                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
                >

                  Start Adaptive Exam

                </button>

              </div>

            ))}

          </div>

        </div>

      </div>

    </main>
  );
}