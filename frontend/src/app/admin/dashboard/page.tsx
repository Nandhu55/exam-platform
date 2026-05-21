"use client";
import Link from "next/link";
import Papa from "papaparse";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
 XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Result = {
  participant_name: string;
  exam_code: string;
  score: number;
  total: number;
};

type CheatingLog = {
  participant_name: string;
  exam_code: string;
  warning_type: string;
  created_at: string;
};

export default function DashboardPage() {

  const [results, setResults] = useState<Result[]>([]);

  const [logs, setLogs] = useState<CheatingLog[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        // RESULTS
        const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/results`,
  {
    credentials: "include",
  }
);

        const data = await response.json();

        setResults(data.results);

        // CHEATING LOGS
        const logsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/cheating-logs`
        );

        const logsData = await logsResponse.json();

        setLogs(logsData.logs);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    fetchDashboardData();

  }, []);

  // TOP SCORE
  const topScore =
    results.length > 0
      ? Math.max(...results.map((r) => r.score))
      : 0;

  // AVERAGE SCORE
  const averageScore =
    results.length > 0
      ? (
          results.reduce(
            (acc, curr) => acc + curr.score,
            0
          ) / results.length
        ).toFixed(1)
      : "0";

  // CHART DATA
  const chartData = results.map((result) => ({
    name: result.participant_name,
    score: result.score,
  }));

  // EXPORT CSV
  const exportCSV = () => {

    const csv = Papa.unparse(
      results.map((result) => ({
        Participant:
          result.participant_name,
        ExamCode:
          result.exam_code,
        Score:
          result.score,
        Total:
          result.total,
        Percentage:
          (
            (result.score /
              result.total) *
            100
          ).toFixed(0) + "%",
      }))
    );

    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      "exam-results.csv"
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-black p-4 text-white sm:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Monitor exam performance
          </p>

        </div>

        <button
          onClick={exportCSV}
          className="rounded-2xl bg-green-600 px-6 py-3 font-semibold hover:bg-green-500"
        >
          Download CSV
        </button>

      </div>

      {/* Stats */}
      <section className="mt-10 grid gap-6 md:grid-cols-3">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <h2 className="text-3xl font-bold">
            {results.length}
          </h2>

          <p className="mt-2 text-gray-400">
            Total Participants
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <h2 className="text-3xl font-bold">
            {topScore}
          </h2>

          <p className="mt-2 text-gray-400">
            Highest Score
          </p>

        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

          <h2 className="text-3xl font-bold">
            {averageScore}
          </h2>

          <p className="mt-2 text-gray-400">
            Average Score
          </p>

        </div>

      </section>

      {/* Analytics */}
      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8">

        <h2 className="text-2xl font-semibold">
          Performance Analytics
        </h2>

        <div className="mt-10 h-[400px] w-full">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={chartData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="score"
                radius={[10, 10, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </section>

      {/* Suspicious Activity */}
      <section className="mt-12 rounded-3xl border border-red-500/20 bg-red-500/5 p-4 sm:p-8">

        <h2 className="text-2xl font-semibold text-red-400">
          Suspicious Activity
        </h2>

        {logs.length === 0 ? (

          <p className="mt-6 text-gray-400">
            No suspicious activity detected
          </p>

        ) : (

          <div className="mt-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-white/10 text-gray-400">

                <tr>

                  <th className="pb-4">
                    Participant
                  </th>

                  <th className="pb-4">
                    Exam Code
                  </th>

                  <th className="pb-4">
                    Warning
                  </th>

                  <th className="pb-4">
                    Time
                  </th>

                </tr>

              </thead>

              <tbody>

                {logs.map((log, index) => (

                  <tr
                    key={index}
                    className="border-b border-white/5"
                  >

                    <td className="py-4">
                      {log.participant_name ||
                        "Unknown"}
                    </td>

                    <td>
                      {log.exam_code}
                    </td>

                    <td className="text-red-400">
                      {log.warning_type}
                    </td>

                    <td>
                      {new Date(
                        log.created_at
                      ).toLocaleString()}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* Leaderboard */}
      <section className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8">

        <h2 className="text-2xl font-semibold">
          Leaderboard
        </h2>

        {loading ? (

          <p className="mt-6 text-gray-400">
            Loading...
          </p>

        ) : results.length === 0 ? (

          <p className="mt-6 text-gray-400">
            No submissions yet
          </p>

        ) : (

          <div className="mt-6 overflow-x-auto">

            <table className="w-full text-left">

              <thead className="border-b border-white/10 text-gray-400">

                <tr>

                  <th className="pb-4">
                    Participant
                  </th>

                  <th className="pb-4">
                    Exam Code
                  </th>

                  <th className="pb-4">
                    Score
                  </th>

                  <th className="pb-4">
                    Percentage
                  </th>

                </tr>

              </thead>

              <tbody>

                {[...results]
                  .sort(
                    (a, b) =>
                      b.score - a.score
                  )
                  .map(
                    (
                      result,
                      index
                    ) => (

                      <tr
                        key={index}
                        className="border-b border-white/5"
                      >

                        <td className="py-4">
                          {
                            result.participant_name
                          }
                        </td>

                        <td>

  <Link
    href={`/admin/analytics/${result.exam_code}`}
    className="text-purple-400 hover:underline"
  >
    {result.exam_code}
  </Link>

</td>

                        <td>
                          {result.score}/
                          {result.total}
                        </td>

                        <td className="text-green-400">

                          {(
                            (result.score /
                              result.total) *
                            100
                          ).toFixed(0)}
                          %

                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </main>
  );
}