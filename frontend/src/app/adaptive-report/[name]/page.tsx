"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import jsPDF from "jspdf";

export default function AdaptiveReportPage() {

  const params = useParams();

  const studentName = params.name;

  const [loading, setLoading] =
    useState(true);

  const [report, setReport] =
    useState<any>(null);

  useEffect(() => {

    if (studentName) {

      fetchReport();
    }

  }, [studentName]);

  const fetchReport =
    async () => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/adaptive-report/${studentName}`
          );

        const data =
          await response.json();

        setReport(data);

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

        Loading AI Report...

      </main>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (!report || report.error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-red-400">

        Report Not Found

      </main>
    );
  }

  // =========================
  // ACCURACY
  // =========================

  const accuracy =
    (
      (
        report.correct_answers /
        report.total_questions
      ) * 100
    ).toFixed(0);

const downloadPDF = () => {

  const pdf = new jsPDF();

  pdf.setFontSize(24);

  pdf.text(
    "AI Performance Report",
    20,
    20
  );

  pdf.setFontSize(16);

  pdf.text(
    `Student: ${report.student_name}`,
    20,
    40
  );

  pdf.text(
    `Total Questions: ${report.total_questions}`,
    20,
    55
  );

  pdf.text(
    `Correct Answers: ${report.correct_answers}`,
    20,
    70
  );

  pdf.text(
    `Wrong Answers: ${report.wrong_answers}`,
    20,
    85
  );

  pdf.text(
    `Average Difficulty: ${report.average_difficulty}`,
    20,
    100
  );

  pdf.setFontSize(18);

  pdf.text(
    "AI Analysis",
    20,
    125
  );

  pdf.setFontSize(12);

  const splitText =
    pdf.splitTextToSize(
      report.ai_report,
      170
    );

  pdf.text(
    splitText,
    20,
    140
  );

  pdf.save(
    `${report.student_name}-AI-Report.pdf`
  );
};

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-10">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-5xl font-black text-cyan-400">

              AI Performance Report

            </h1>

            <p className="mt-4 text-2xl font-semibold">

              {report.student_name}

            </p>

          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 px-8 py-6 text-center">

            <p className="text-lg text-gray-300">

              Accuracy

            </p>

            <h2 className="mt-2 text-5xl font-black text-green-400">

              {accuracy}%

            </h2>

          </div>

        </div>

        {/* STATS */}

        <div className="mt-12 grid gap-6 md:grid-cols-4">

          <div className="rounded-3xl border border-white/10 bg-black/30 p-8">

            <p className="text-gray-400">

              Total Questions

            </p>

            <h2 className="mt-4 text-4xl font-black">

              {report.total_questions}

            </h2>

          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8">

            <p className="text-gray-300">

              Correct Answers

            </p>

            <h2 className="mt-4 text-4xl font-black text-green-400">

              {report.correct_answers}

            </h2>

          </div>

          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-8">

            <p className="text-gray-300">

              Wrong Answers

            </p>

            <h2 className="mt-4 text-4xl font-black text-red-400">

              {report.wrong_answers}

            </h2>

          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">

            <p className="text-gray-300">

              Avg Difficulty

            </p>

            <h2 className="mt-4 text-4xl font-black text-purple-400">

              {report.average_difficulty}

            </h2>

          </div>

        </div>

        {/* AI REPORT */}

        <div className="mt-12 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-10">

          <h2 className="text-4xl font-black text-cyan-400">

            AI Analysis

          </h2>

          <div className="mt-8 whitespace-pre-wrap text-lg leading-10 text-gray-300">

            {report.ai_report}

          </div>

        </div>
        <div className="mt-12 flex justify-center">

  <button
    onClick={downloadPDF}
    className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-4 text-xl font-bold"
  >

    Download PDF Report

  </button>

</div>

        {/* PERFORMANCE LEVEL */}

        <div className="mt-12 rounded-3xl border border-white/10 bg-black/30 p-10 text-center">

          <h2 className="text-4xl font-black">

            Performance Level

          </h2>

          <p className="mt-6 text-3xl font-bold">

            {
              Number(accuracy) >= 80

              ? "Excellent"

              : Number(accuracy) >= 60

              ? "Good"

              : Number(accuracy) >= 40

              ? "Average"

              : "Needs Improvement"
            }

          </p>

        </div>

      </div>

    </main>
  );
}