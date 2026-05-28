"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

export default function AdaptiveExamPage() {

  const params = useParams();

  const adaptiveExamId =
    params.adaptiveExamId as string;

  const [loading, setLoading] =
    useState(true);

  const [exam, setExam] =
    useState<any>(null);

  const [question, setQuestion] =
    useState<any>(null);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [difficulty, setDifficulty] =
    useState(1);

  const [questionNumber, setQuestionNumber] =
    useState(1);

  const [score, setScore] =
    useState(0);

  const [examFinished, setExamFinished] =
    useState(false);

  const [previousQuestions, setPreviousQuestions] =
    useState<string[]>([]);

  const [student, setStudent] =
    useState<any>(null);

  // ============================================
  // FETCH EXAM
  // ============================================

  useEffect(() => {

    if (adaptiveExamId) {

      fetchAdaptiveExam();
    }

  }, [adaptiveExamId]);

  const fetchAdaptiveExam =
    async () => {

      try {

        const response =
          await fetch(
            `${API_URL}/adaptive-exam/${adaptiveExamId}`
          );

        const data =
          await response.json();

        console.log(data);

        setExam(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  // ============================================
  // FETCH STUDENT
  // ============================================

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
    };

  // ============================================
  // GENERATE QUESTION
  // ============================================

  const generateQuestion =
    async (
      topic: string,
      currentDifficulty: number,
      previous: string[] = []
    ) => {

      try {

        setQuestion(null);

        const response =
          await fetch(
            `${API_URL}/generate-adaptive-question`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({

                topic,

                difficulty:
                  currentDifficulty,

                previous_questions:
                  previous,
              }),
            }
          );

        const data =
          await response.json();

        console.log(data);

        setQuestion(data);

        if (
          data.question &&
          !previous.includes(
            data.question
          )
        ) {

          setPreviousQuestions(
            (prev) => [
              ...prev,
              data.question
            ]
          );
        }

      } catch (error) {

        console.error(error);
      }
    };

  // ============================================
  // START FIRST QUESTION
  // ============================================

  useEffect(() => {

    if (
      exam &&
      student &&
      !question
    ) {

      generateQuestion(
        exam.topic,
        difficulty,
        []
      );
    }

  }, [exam, student]);

  // ============================================
  // SUBMIT ANSWER
  // ============================================

  const submitAnswer =
    async () => {

      if (!selectedAnswer) {

        alert(
          "Please select an answer"
        );

        return;
      }

      const isCorrect =
        selectedAnswer ===
        question.correctAnswer;

      try {

        await fetch(
          `${API_URL}/save-adaptive-attempt`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              adaptive_exam_id:
                exam.adaptive_exam_id,

              participant_name:
                student.name,

              roll_number:
                student.roll_number,

              college:
                student.college,

              section:
                student.section,

              question_number:
                questionNumber,

              question:
                question.question,

              selected_answer:
                selectedAnswer,

              correct_answer:
                question.correctAnswer,

              is_correct:
                isCorrect,

              difficulty:
                difficulty
            }),
          }
        );

      } catch (error) {

        console.error(error);
      }

      let newDifficulty =
        difficulty;

      if (isCorrect) {

        newDifficulty += 1;

        setScore(
          (prev) => prev + 1
        );

      } else {

        newDifficulty -= 1;
      }

      if (newDifficulty < 1) {

        newDifficulty = 1;
      }

      if (newDifficulty > 5) {

        newDifficulty = 5;
      }

      setDifficulty(
        newDifficulty
      );

      const nextQuestionNumber =
        questionNumber + 1;

      if (
        nextQuestionNumber >
        exam.total_questions
      ) {

        setExamFinished(true);

        setQuestion(null);

        return;
      }

      setQuestionNumber(
        nextQuestionNumber
      );

      setSelectedAnswer("");

      generateQuestion(
        exam.topic,
        newDifficulty,
        previousQuestions
      );
    };

  // ============================================
  // LOADING
  // ============================================

  if (
    loading ||
    !student
  ) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-white">

        Loading Adaptive Exam...

      </main>
    );
  }

  // ============================================
  // EXAM FINISHED
  // ============================================

  if (examFinished) {

    const percentage =
      (
        (score /
          exam.total_questions) *
        100
      ).toFixed(0);

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">

        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">

          <h1 className="text-5xl font-black text-cyan-400">

            Adaptive Exam Completed

          </h1>

          <p className="mt-8 text-3xl font-bold">

            Score:
            {" "}
            {score}
            {" / "}
            {exam.total_questions}

          </p>

          <p className="mt-4 text-2xl text-green-400">

            {percentage}%

          </p>

        </div>

      </main>
    );
  }

  // ============================================
  // EXAM NOT FOUND
  // ============================================

  if (!exam || exam.error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-red-400">

        Adaptive Exam Not Found

      </main>
    );
  }

  // ============================================
  // MAIN UI
  // ============================================

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-4xl font-black">

          Adaptive AI Examination

        </h1>

        <p className="mt-6 text-xl text-cyan-400">

          Welcome,
          {" "}
          {student.name}

        </p>

        <p className="mt-2 text-gray-300">

          Topic:
          {" "}
          {exam.topic}

        </p>

        <p className="mt-2 text-gray-300">

          Total Questions:
          {" "}
          {exam.total_questions}

        </p>

        <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8">

          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold text-cyan-400">

              Question
              {" "}
              {questionNumber}

            </h2>

            <p className="text-sm text-gray-400">

              Difficulty:
              {" "}
              {difficulty}

            </p>

          </div>

          {question ? (

            <div className="mt-8">

              <h3 className="text-2xl font-semibold leading-10">

                {question.question}

              </h3>

              <div className="mt-8 space-y-4">

                {["A", "B", "C", "D"].map((option) => (

                  <button
                    key={option}

                    onClick={() =>
                      setSelectedAnswer(option)
                    }

                    className={`w-full rounded-2xl border px-6 py-5 text-left transition-all

                    ${
                      selectedAnswer === option
                        ? "border-cyan-400 bg-cyan-500/20"
                        : "border-white/10 bg-black/30"
                    }`}
                  >

                    <span className="font-bold">

                      {option}.

                    </span>

                    {" "}

                    {
                      question[
                        `option${option}`
                      ]
                    }

                  </button>

                ))}

              </div>

              <button
                onClick={submitAnswer}
                className="mt-8 w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
              >

                Submit Answer

              </button>

            </div>

          ) : (

            <p className="mt-8 text-gray-400">

              Generating AI Question...

            </p>

          )}

        </div>

      </div>

    </main>
  );
}