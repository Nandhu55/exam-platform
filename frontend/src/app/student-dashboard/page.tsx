"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type StudentType = {
  id: string;
  name: string;
  roll_number: string;
  college: string;
  section: string;
};

type ExamType = {
  adaptive_exam_id: string;
  topic: string;
  total_questions: number;
  min_difficulty: number;
  max_difficulty: number;
};

export default function StudentDashboard() {

  const [student, setStudent] =
    useState<StudentType | null>(null);

  const [exams, setExams] =
    useState<ExamType[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchData();

  }, []);

  const fetchData =
    async () => {

      try {

        // =========================
        // GET LOGGED USER
        // =========================

        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {

          window.location.href =
            "/login";

          return;
        }

        // =========================
        // GET PROFILE
        // =========================

        const {
          data: profileData,
          error: profileError
        } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {

          console.error(profileError);

          return;
        }

        setStudent(profileData);

        // =========================
        // GET EXAMS
        // =========================

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/adaptive-exams`
          );

        const examData =
          await response.json();

        setExams(examData);

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

  // =========================
  // MAIN UI
  // =========================

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-5xl font-black text-cyan-400">

            Student Dashboard

          </h1>

          <p className="mt-8 text-3xl font-bold">

            {student?.name}

          </p>

          <p className="mt-4 text-gray-300">

            Roll Number:
            {" "}
            {student?.roll_number}

          </p>

          <p className="mt-2 text-gray-300">

            College:
            {" "}
            {student?.college}

          </p>

          <p className="mt-2 text-gray-300">

            Section:
            {" "}
            {student?.section}

          </p>

        </div>

        {/* EXAMS */}

        <h2 className="mb-8 text-4xl font-black">

          Available Adaptive Exams

        </h2>

        {exams.length === 0 ? (

          <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

            <p className="text-xl text-gray-400">

              No adaptive exams available.

            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {exams.map((exam: ExamType) => (

              <div
                key={exam.adaptive_exam_id}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >

                <h3 className="text-3xl font-black text-cyan-400">

                  {exam.topic}

                </h3>

                <p className="mt-6 text-gray-300">

                  Total Questions:
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

                  Start Exam

                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}