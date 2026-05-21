import { Button } from "@/components/ui/button";
import { ShieldCheck, BarChart3, Clock3 } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/30 blur-3xl rounded-full" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          ExamSecure
        </h1>

        <Button className="rounded-full px-6">
          Admin Login
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24">

        <div className="mb-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
          Secure Online Examination Platform
        </div>

        <h1 className="max-w-5xl text-5xl md:text-7xl font-bold leading-tight">
          Conduct Exams <br />
          With Modern Security
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Create exams, share links instantly, monitor suspicious activity,
          and analyze performance with powerful dashboards.
        </p>

        <div className="mt-10 flex gap-4">
          <Button size="lg" className="rounded-full px-8">
            Create Exam
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full px-8 text-black"
          >
            Learn More
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mt-32 grid gap-8 px-8 pb-24 md:grid-cols-3">

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <ShieldCheck className="mb-4 h-12 w-12 text-green-400" />

          <h2 className="text-2xl font-semibold">
            Anti Cheating
          </h2>

          <p className="mt-4 text-gray-300">
            Detect tab switching, fullscreen exit, copy attempts,
            and suspicious activity during exams.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <BarChart3 className="mb-4 h-12 w-12 text-blue-400" />

          <h2 className="text-2xl font-semibold">
            Powerful Analytics
          </h2>

          <p className="mt-4 text-gray-300">
            View top performers, answer statistics,
            score distribution, and detailed reports.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <Clock3 className="mb-4 h-12 w-12 text-purple-400" />

          <h2 className="text-2xl font-semibold">
            Real-Time Exam Flow
          </h2>

          <p className="mt-4 text-gray-300">
            Auto-save answers, enforce timers,
            and ensure smooth exam experience.
          </p>
        </div>
      </section>
    </main>
  );
}