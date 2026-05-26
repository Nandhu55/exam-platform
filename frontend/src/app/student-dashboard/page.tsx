"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudentDashboard() {

  const [student, setStudent] =
    useState<any>(null);

  const [exams, setExams] =
    useState<any[]>([]);

  useEffect(() => {

    fetchStudent();
    fetchExams();

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
    };

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
      }
    };

  if (!student) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">

        Loading Dashboard...

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="mb-10 rounded-3xl border border-white/10 bg-white/5 p-8">

          <h1 className="text-5xl font-black text-cyan-400">

            Student Dashboard

          </h1>

          <p className="mt-6 text-2xl font-bold">

            {student.name}

          </p>

          <p className="mt-2 text-gray-400">

            Roll Number:
            {" "}
            {student.roll_number}

          </p>

          <p className="mt-2 text-gray-400">

            College:
            {" "}
            {student.college}

          </p>

          <p className="mt-2 text-gray-400">

            Section:
            {" "}
            {student.section}

          </p>

        </div>

        <h2 className="mb-8 text-4xl font-black">

          Available Adaptive Exams

        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {exams.map((exam) => (

            <div
              key={exam.adaptive_exam_id}
              className="rounded-3xl border border-white/10 bg-white/5 p-8"
            >

              <h3 className="text-3xl font-black text-cyan-400">

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

                Start Exam

              </button>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}