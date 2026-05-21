"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";


type Question = {
  id?: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
};

export default function ExamPage() {

  const params = useParams();
  const searchParams =
  useSearchParams();

const attemptId =
  searchParams.get("attempt");
  const examCode = params.code;

  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState(true);

  const [participantName, setParticipantName] = useState("");

  const [rollNumber, setRollNumber] =
  useState("");

const [section, setSection] =
  useState("");

const [college, setCollege] =
  useState("");

  const [warnings, setWarnings] = useState(0);

  const [warningMessage, setWarningMessage] = useState("");

  const [result, setResult] = useState<{
    score: number;
    total: number;
    percentage: number;
  } | null>(null);

  const [alreadySubmitted, setAlreadySubmitted] =
    useState(false);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState<{
    [key: number]: string;
  }>({});

  const [timeLeft, setTimeLeft] = useState(60 * 30);

  // FETCH EXAM + TIMER + FULLSCREEN
  useEffect(() => {

    const fetchCandidate =
  async () => {

    try {

      const response =
        await fetch(

`${process.env.NEXT_PUBLIC_API_URL}/attempt/${attemptId}`

        );

      const data =
        await response.json();

      setParticipantName(
        data.participant_name || ""
      );

      setRollNumber(
        data.roll_number || ""
      );

      setSection(
        data.section || ""
      );

      setCollege(
        data.college || ""
      );

    } catch (error) {

      console.error(error);

    }
};
    const fetchExam = async () => {

      try {

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/exam/${examCode}`
        );

        const data = await response.json();

        if (data.questions) {
          setQuestions(data.questions);
        }

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }
    };

    const submitted = localStorage.getItem(
      `submitted-${examCode}`
    );

    if (submitted === "true") {
      setAlreadySubmitted(true);
    }


    fetchCandidate();
    fetchExam();

    // Fullscreen
    document.documentElement
      .requestFullscreen()
      .catch(() => {
        console.log(
          "Fullscreen permission denied"
        );
      });

    // Timer
    const timer = setInterval(() => {

      setTimeLeft((prev) => {

        if (prev <= 1) {

          clearInterval(timer);

          alert("Time Over");

          return 0;
        }

        return prev - 1;
      });

    }, 1000);

    return () => clearInterval(timer);

  }, [examCode]);

  // ANTI CHEATING
  useEffect(() => {

    const handleVisibilityChange = () => {

      if (document.hidden) {

        setWarnings((prev) => {

          const updated = prev + 1;

          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/log-cheating`,
            {
              method: "POST",
              credentials: "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                participant_name:
                  participantName,
                exam_code: examCode,
                warning_type:
                  "Tab Switch",
              }),
            }
          );

          setWarningMessage(
            `Warning ${updated}/3 : Tab Switching Detected`
          );

          setTimeout(() => {
            setWarningMessage("");
          }, 3000);

          if (updated >= 3) {

            alert(
              "Exam Auto Submitted Due To Cheating"
            );

          }

          return updated;
        });
      }
    };

    const disableCopy = (
      e: ClipboardEvent
    ) => {
      e.preventDefault();
    };

    const disableRightClick = (
      e: MouseEvent
    ) => {
      e.preventDefault();
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    document.addEventListener(
      "copy",
      disableCopy
    );

    document.addEventListener(
      "contextmenu",
      disableRightClick
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      document.removeEventListener(
        "copy",
        disableCopy
      );

      document.removeEventListener(
        "contextmenu",
        disableRightClick
      );
    };

  }, [participantName, examCode]);

  const formatTime = (seconds: number) => {

    const mins = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswer = (option: string) => {

    setAnswers({
      ...answers,
      [currentQuestion]: option,
    });
  };

  const handleSubmit = async () => {

  try {

    const response =
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/submit-exam`,
        {
          method: "POST",
          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            exam_code: examCode,
            participant_name:
              participantName,
            roll_number:
              rollNumber,
            section,
            college,
            answers,
          }),
        }
      );

    const data =
      await response.json();

    localStorage.setItem(
      `submitted-${examCode}`,
      "true"
    );

    const percentage =
      (
        data.result.score /
        data.result.total
      ) * 100;

    setResult({
      score:
        data.result.score,
      total:
        data.result.total,
      percentage,
    });

  } catch (error) {

    console.error(error);

    alert(
      "Submission Failed"
    );
  }
};

  // ALREADY SUBMITTED
  if (alreadySubmitted) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

        <div className="max-w-xl rounded-3xl border border-red-500/20 bg-red-500/10 p-10 text-center">

          <h1 className="text-4xl font-bold text-red-400">
            Exam Already Submitted
          </h1>

          <p className="mt-4 text-gray-300">
            You cannot attempt this exam again.
          </p>

        </div>

      </main>

    );
  }

  // LOADING
  if (loading) {

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          Loading Exam...
        </h1>

      </main>
    );
  }

  // NOT FOUND
  if (questions.length === 0) {

    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">

        <h1 className="text-3xl font-bold text-red-400">
          Exam Not Found
        </h1>

      </main>
    );
  }

  // RESULT SCREEN
  if (result) {

    return (

      <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

        <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center sm:p-10">

          <h1 className="text-3xl font-bold text-green-400 sm:text-5xl">
            Exam Completed
          </h1>

          <p className="mt-4 text-gray-400">
            Your performance summary
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">

            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

              <h2 className="text-4xl font-bold">
                {result.score}
              </h2>

              <p className="mt-2 text-gray-400">
                Correct
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

              <h2 className="text-4xl font-bold">
                {result.total}
              </h2>

              <p className="mt-2 text-gray-400">
                Total Questions
              </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-6">

              <h2 className="text-4xl font-bold text-purple-400">
                {result.percentage.toFixed(0)}%
              </h2>

              <p className="mt-2 text-gray-400">
                Percentage
              </p>

            </div>

          </div>

          <div className="mt-10">

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="rounded-2xl bg-purple-600 px-8 py-4 font-semibold hover:bg-purple-500"
            >
              Close
            </button>

          </div>

        </div>

      </main>

    );
  }

  return (

  <main className="min-h-screen bg-[#060816] text-white overflow-hidden">

    {/* Background Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#7c3aed33,transparent_30%)]" />

    {/* Header */}
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

        {/* Left */}
        <div className="flex items-center gap-4">

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3">

            <p className="text-xs text-gray-400">
              Warnings
            </p>

            <h2 className="text-2xl font-bold text-red-400">

              {warnings}/3

            </h2>

          </div>

        </div>

        {/* Center */}
        <div className="text-center">

          <h1 className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-4xl font-extrabold text-transparent">

            TekWorks

          </h1>

          <p className="mt-1 text-sm uppercase tracking-[0.4em] text-gray-400">

            Full Stack Assessment

          </p>

        </div>

        {/* Right */}
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-right">

          <p className="text-xs text-gray-400">
            Candidate
          </p>

          <h2 className="text-lg font-bold text-cyan-400">

            {participantName || "Student"}

          </h2>

          <p className="mt-1 text-sm text-gray-400">

  {rollNumber}

</p>

        </div>

      </div>

    </header>

    {/* Layout */}
    <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">

      {/* LEFT SIDEBAR */}
      <aside className="space-y-6">

        {/* Candidate Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">

          <h2 className="text-xl font-bold text-purple-400">

            Candidate Details

          </h2>

          <div className="mt-6 space-y-5">

            <div>

              <p className="text-xs text-gray-400">
                Name
              </p>

              <h3 className="mt-1 text-lg font-semibold">

                {participantName}

              </h3>

            </div>

            <div>

              <p className="text-xs text-gray-400">
                Roll Number
              </p>

              <h3 className="mt-1 text-lg font-semibold">

                {rollNumber}

              </h3>

            </div>

            <div>

              <p className="text-xs text-gray-400">
                Section
              </p>

              <h3 className="mt-1 text-lg font-semibold">

                {section}

              </h3>

            </div>

            <div>

              <p className="text-xs text-gray-400">
                College
              </p>

              <h3 className="mt-1 text-lg font-semibold">

                {college}

              </h3>

            </div>

          </div>

        </div>

        {/* Question Navigator */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">

          <h2 className="text-xl font-bold text-purple-400">

            Questions

          </h2>

          <div className="mt-6 grid grid-cols-4 gap-3">

            {questions.map(
              (_, index) => (

                <button
                  key={index}
                  onClick={() =>
                    setCurrentQuestion(
                      index
                    )
                  }
                  className={`h-14 rounded-2xl font-bold transition-all ${
                    answers[index]
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black"
                      : currentQuestion === index
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "bg-black/40 hover:bg-white/10"
                  }`}
                >

                  {index + 1}

                </button>

              )
            )}

          </div>

        </div>

      </aside>

      {/* MAIN QUESTION AREA */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">

        {/* Question Header */}
        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm uppercase tracking-[0.3em] text-gray-400">

              Question {currentQuestion + 1}

            </p>

            <h1 className="mt-4 text-xl font-bold leading-relaxed">

              {
                questions[currentQuestion]
                  ?.question
              }

            </h1>

          </div>

        </div>

        {/* Options */}
        <div className="mt-12 space-y-4">

          {[
            {
              key: "A",
              value:
                questions[
                  currentQuestion
                ]?.optionA,
            },
            {
              key: "B",
              value:
                questions[
                  currentQuestion
                ]?.optionB,
            },
            {
              key: "C",
              value:
                questions[
                  currentQuestion
                ]?.optionC,
            },
            {
              key: "D",
              value:
                questions[
                  currentQuestion
                ]?.optionD,
            },
          ].map((option) => (

            <button
              key={option.key}
              onClick={() =>
                handleAnswer(
                  option.key
                )
              }
              className={`group relative w-full overflow-hidden rounded-3xl border p-4 text-left transition-all duration-300 ${
                answers[
                  currentQuestion
                ] === option.key
                  ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-cyan-500/20"
                  : "border-white/10 bg-black/30 hover:border-purple-500/50 hover:bg-white/10"
              }`}
            >

              <div className="flex items-center gap-5">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-bold ${
                    answers[
                      currentQuestion
                    ] === option.key
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500"
                      : "bg-white/10"
                  }`}
                >

                  {option.key}

                </div>

                <p className="text-lg font-medium">

                  {option.value}

                </p>

              </div>

            </button>

          ))}

        </div>

        {/* Navigation */}
        <div className="mt-14 flex items-center justify-between">

          <button
            disabled={
              currentQuestion === 0
            }
            onClick={() =>
              setCurrentQuestion(
                (prev) => prev - 1
              )
            }
            className="rounded-2xl border border-white/10 bg-black/30 px-8 py-4 font-semibold transition hover:bg-white/10 disabled:opacity-30"
          >

            Previous

          </button>

          {currentQuestion <
          questions.length - 1 ? (

            <button
              onClick={() =>
                setCurrentQuestion(
                  (prev) => prev + 1
                )
              }
              className="rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-10 py-4 text-lg font-bold shadow-2xl transition hover:scale-105"
            >

              Save & Next

            </button>

          ) : (

            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 px-10 py-4 text-lg font-bold text-black shadow-2xl transition hover:scale-105"
            >

              Submit Exam

            </button>

          )}

        </div>

      </section>

    </div>

    {/* Floating Timer */}
<div className="fixed bottom-4 right-4 z-50 rounded-2xl border border-purple-500/20 bg-black/50 px-5 py-3 shadow-xl backdrop-blur-xl">

  <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
    Time Remaining
  </p>

  <h2 className="mt-1 text-lg font-bold text-purple-400">
    {formatTime(timeLeft)}
  </h2>

</div>

  </main>

);

}