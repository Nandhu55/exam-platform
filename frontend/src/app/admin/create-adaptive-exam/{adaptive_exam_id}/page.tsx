"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function AdaptiveExamPage() {

  const params = useParams();

  const examId = params.id;

  const [loading, setLoading] =
    useState(true);

  const [exam, setExam] =
    useState<any>(null);

  useEffect(() => {

    if (examId) {

      fetchAdaptiveExam();
    }

  }, [examId]);

  const fetchAdaptiveExam =
    async () => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/adaptive-exam/${examId}`
          );

        const data =
          await response.json();

        setExam(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white text-2xl">

        Loading Adaptive Exam...

      </main>
    );
  }

  if (!exam || exam.error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-red-400 text-2xl">

        Adaptive Exam Not Found

      </main>
    );
  }

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-4xl font-black">

          Adaptive AI Examination

        </h1>

        <p className="mt-6 text-xl text-cyan-400">

          Exam ID:
          {" "}
          {exam.adaptive_exam_id}

        </p>

        <p className="mt-4 text-gray-300">

          Topic:
          {" "}
          {exam.topic}

        </p>

        <p className="mt-2 text-gray-300">

          Total Questions:
          {" "}
          {exam.total_questions}

        </p>

        <p className="mt-2 text-gray-300">

          Difficulty Range:
          {" "}
          {exam.min_difficulty}
          {" "}
          →
          {" "}
          {exam.max_difficulty}

        </p>

        <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8">

          <h2 className="text-2xl font-bold text-cyan-400">

            Adaptive Engine Ready

          </h2>

          <p className="mt-4 text-gray-300 leading-8">

            The adaptive AI system is initialized.
            <br />
            Next step:
            generate the first dynamic question
            based on the selected topic and difficulty.

          </p>

        </div>

      </div>

    </main>
  );
}