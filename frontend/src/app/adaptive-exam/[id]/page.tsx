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

  const [question, setQuestion] =
    useState<any>(null);

  const [selectedAnswer, setSelectedAnswer] =
    useState("");

  const [difficulty, setDifficulty] =
    useState(1);

  const [questionNumber, setQuestionNumber] =
    useState(1);

  // =========================
  // FETCH EXAM
  // =========================

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

        // FIRST QUESTION
        generateQuestion(
          data.topic,
          1
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  // =========================
  // GENERATE QUESTION
  // =========================

  const generateQuestion =
    async (
      topic: string,
      currentDifficulty: number
    ) => {

      try {

        setQuestion(null);

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/generate-adaptive-question`,
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
              }),
            }
          );

        const data =
          await response.json();

        setQuestion(data);

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // SUBMIT ANSWER
  // =========================

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

      // SAVE ATTEMPT

      try {

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/save-adaptive-attempt`,
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
                "Student",

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

      // =========================
      // DIFFICULTY ENGINE
      // =========================

      let newDifficulty =
        difficulty;

      if (isCorrect) {

        newDifficulty += 1;

      } else {

        newDifficulty -= 1;
      }

      // LIMITS

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

      // EXAM FINISHED

      if (
        nextQuestionNumber >
        exam.total_questions
      ) {

        alert(
          "Adaptive Exam Completed"
        );

        return;
      }

      setQuestionNumber(
        nextQuestionNumber
      );

      setSelectedAnswer("");

      generateQuestion(
        exam.topic,
        newDifficulty
      );
    };

  // =========================
  // LOADING STATE
  // =========================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-white">

        Loading Adaptive Exam...

      </main>
    );
  }

  // =========================
  // NOT FOUND
  // =========================

  if (!exam || exam.error) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-red-400">

        Adaptive Exam Not Found

      </main>
    );
  }

  // =========================
  // UI
  // =========================

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10">

        {/* HEADER */}

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

        {/* QUESTION CARD */}

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

              {/* QUESTION */}

              <h3 className="text-2xl font-semibold leading-10">

                {question.question}

              </h3>

              {/* OPTIONS */}

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

              {/* SUBMIT */}

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