"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Analytics = {
  question: string;

  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };

  correct_answer: string;

  option_distribution: {
    A: number;
    B: number;
    C: number;
    D: number;
  };

  correct_count: number;

  wrong_count: number;

  correct_percentage: number;

  most_selected: string;
};

export default function AnalyticsPage() {

  const params = useParams();

  const examCode = params.code;

  const [analytics, setAnalytics] =
    useState<Analytics[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchAnalytics =
      async () => {

        try {

          const response =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/exam-analytics/${examCode}`
            
            );

            

          const data =
            await response.json();

          setAnalytics(
            data.analytics
          );

        } catch (error) {

          console.error(error);

        } finally {

          setLoading(false);

        }
      };

    fetchAnalytics();

  }, [examCode]);

  if (loading) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Loading Analytics...
        </h1>

      </main>

    );
  }

  return (

    <main className="min-h-screen bg-black p-4 text-white sm:p-8">

      {/* Header */}
      <div>

        <h1 className="text-3xl font-bold sm:text-5xl">
          Exam Analytics
        </h1>

        <p className="mt-3 text-gray-400">
          Exam Code: {examCode}
        </p>

      </div>

      {/* Questions */}
      <div className="mt-12 space-y-12">

        {analytics.map(
          (
            item,
            index
          ) => {

            const pieData = [
              {
                name: "Correct",
                value:
                  item.correct_count,
              },
              {
                name: "Wrong",
                value:
                  item.wrong_count,
              },
            ];

            const optionData = [
              {
                option: "A",
                count:
                  item.option_distribution
                    .A,
              },
              {
                option: "B",
                count:
                  item.option_distribution
                    .B,
              },
              {
                option: "C",
                count:
                  item.option_distribution
                    .C,
              },
              {
                option: "D",
                count:
                  item.option_distribution
                    .D,
              },
            ];

            return (

              <section
                key={index}
                className="rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-8"
              >

                {/* Question */}
                <div>

                  <h2 className="text-2xl font-bold text-purple-400">

                    Question {index + 1}

                  </h2>

                  <p className="mt-4 text-xl leading-relaxed">

                    {item.question}

                  </p>

                </div>

                {/* Options Review */}
                <div className="mt-8 space-y-4">

                  {Object.entries(
                    item.options
                  ).map(
                    (
                      [key, value]
                    ) => (

                      <div
                        key={key}
                        className={`rounded-2xl border p-5 ${
                          item.correct_answer === key
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/10 bg-black/30"
                        }`}
                      >

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="text-lg font-semibold">

                              {key}. {value}

                            </p>

                            {item.correct_answer ===
                              key && (

                              <p className="mt-2 text-sm text-green-400">

                                Correct Answer

                              </p>

                            )}

                          </div>

                          <div className="text-left sm:text-right">

                            <p className="text-3xl font-bold text-purple-400">

                              {
                                item.option_distribution[
                                  key as keyof typeof item.option_distribution
                                ]
                              }

                            </p>

                            <p className="text-sm text-gray-400">

                              students selected

                            </p>

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

                {/* Stats */}
                <div className="mt-10 grid gap-6 md:grid-cols-4">

                  <div className="rounded-2xl bg-black/30 p-5">

                    <p className="text-gray-400">
                      Correct Answer
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-green-400">

                      {
                        item.correct_answer
                      }

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-black/30 p-5">

                    <p className="text-gray-400">
                      Correct %
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-blue-400">

                      {
                        item.correct_percentage
                      }
                      %

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-black/30 p-5">

                    <p className="text-gray-400">
                      Most Selected
                    </p>

                    <h3 className="mt-2 text-3xl font-bold text-yellow-400">

                      {
                        item.most_selected
                      }

                    </h3>

                  </div>

                  <div className="rounded-2xl bg-black/30 p-5">

                    <p className="text-gray-400">
                      Difficulty
                    </p>

                    <h3 className="mt-2 text-2xl font-bold">

                      {item.correct_percentage <
                      40
                        ? "Hard"
                        : item.correct_percentage <
                          70
                        ? "Medium"
                        : "Easy"}

                    </h3>

                  </div>

                </div>

                {/* Charts */}
                <div className="mt-10 grid gap-10 lg:grid-cols-2">

                  {/* Pie Chart */}
                  <div className="rounded-3xl bg-black/30 p-6">

                    <h3 className="text-xl font-semibold">

                      Correct vs Wrong

                    </h3>

                    <div className="mt-6 h-[300px]">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <PieChart>

                          <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={100}
                            label
                          >

                            {pieData.map(
                              (
                                entry,
                                pieIndex
                              ) => (

                                <Cell
                                  key={
                                    pieIndex
                                  }
                                />

                              )
                            )}

                          </Pie>

                          <Tooltip />

                        </PieChart>

                      </ResponsiveContainer>

                    </div>

                  </div>

                  {/* Option Distribution */}
                  <div className="rounded-3xl bg-black/30 p-6">

                    <h3 className="text-xl font-semibold">

                      Option Distribution

                    </h3>

                    <div className="mt-6 h-[300px]">

                      <ResponsiveContainer
                        width="100%"
                        height="100%"
                      >

                        <BarChart
                          data={optionData}
                        >

                          <CartesianGrid strokeDasharray="3 3" />

                          <XAxis dataKey="option" />

                          <YAxis />

                          <Tooltip />

                          <Bar dataKey="count" />

                        </BarChart>

                      </ResponsiveContainer>

                    </div>

                  </div>

                </div>

              </section>

            );
          }
        )}

      </div>

    </main>

  );
}