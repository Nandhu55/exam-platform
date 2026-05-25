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

  const [score, setScore] =
    useState(0);

  const [examFinished, setExamFinished] =
    useState(false);

  const [previousQuestions, setPreviousQuestions] =
    useState<string[]>([]);

  const [studentName, setStudentName] =
    useState("");

  const [rollNumber, setRollNumber] =
    useState("");

  const [college, setCollege] =
    useState("");

  const [section, setSection] =
    useState("");

  const [examStarted, setExamStarted] =
    useState(false);

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
      currentDifficulty: number,
      previous: string[] = []
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

                previous_questions:
                  previous,
              }),
            }
          );

        const data =
          await response.json();

        setQuestion(data);

        // STORE PREVIOUS QUESTIONS

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

  // =========================
  // START EXAM
  // =========================

  const startExam = () => {

    if (
      !studentName ||
      !rollNumber ||
      !college ||
      !section
    ) {

      alert(
        "Please fill all details"
      );

      return;
    }

    setExamStarted(true);

    generateQuestion(
      exam.topic,
      1,
      []
    );
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
                studentName,

              roll_number:
                rollNumber,

              college:
                college,

              section:
                section,

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

        setScore(
          (prev) => prev + 1
        );

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

      // =========================
      // EXAM FINISHED
      // =========================

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

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-white">

        Loading Adaptive Exam...

      </main>
    );
  }

  // =========================
  // EXAM FINISHED
  // =========================

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

          <div className="mt-10 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8">

            <h2 className="text-2xl font-bold">

              AI Performance Analysis

            </h2>

            <p className="mt-6 text-lg leading-9 text-gray-300">

              {Number(percentage) >= 80

                ? "Excellent performance. Strong conceptual understanding and adaptive learning capability detected."

                : Number(percentage) >= 50

                ? "Good performance. Some medium and advanced concepts require improvement."

                : "Performance needs improvement. Focus on fundamentals and practice adaptive difficulty questions regularly."}

            </p>

          </div>

          <button
            onClick={() =>
              window.location.href = "/"
            }
            className="mt-10 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-4 text-xl font-bold"
          >

            Go To Home

          </button>

        </div>

      </main>
    );
  }

  // =========================
  // STUDENT DETAILS
  // =========================

  if (!examStarted) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] p-8 text-white">

        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10">

          <h1 className="text-4xl font-black">

            Student Verification

          </h1>

          <p className="mt-4 text-gray-400">

            Enter your details to start
            the adaptive AI examination.

          </p>

          <div className="mt-10 space-y-5">

            <input
              type="text"
              placeholder="Student Name"

              value={studentName}

              onChange={(e) =>
                setStudentName(
                  e.target.value
                )
              }

              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="Roll Number"

              value={rollNumber}

              onChange={(e) =>
                setRollNumber(
                  e.target.value
                )
              }

              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="College"

              value={college}

              onChange={(e) =>
                setCollege(
                  e.target.value
                )
              }

              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="Section"

              value={section}

              onChange={(e) =>
                setSection(
                  e.target.value
                )
              }

              className="w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 outline-none"
            />

            <button

              onClick={startExam}

              className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-lg font-bold"
            >

              Start Adaptive Exam

            </button>

          </div>

        </div>

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
  // MAIN UI
  // =========================

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