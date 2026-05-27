"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

import { supabase } from "@/lib/supabase";

type CollegeType = {
  id: string;

  college_name: string;

  college_code: string;

  admin_email: string;
};

type StudentType = {
  id: string;

  name: string;

  roll_number: string;

  section: string;
};

export default function CollegeAdminDashboard() {

  const params = useParams();

  const collegeCode =
    params.collegeCode as string;

  const [college, setCollege] =
    useState<CollegeType | null>(null);

  const [students, setStudents] =
    useState<StudentType[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    if (collegeCode) {

      fetchCollegeData();
    }

  }, [collegeCode]);

  const fetchCollegeData =
    async () => {

      try {

        const { data: collegeData, error: collegeError } =
          await supabase
            .from("colleges")
            .select("*")
            .eq(
              "college_code",
              collegeCode
            )
            .single();

        if (collegeError) {

          console.error(collegeError);

          return;
        }

        setCollege(
          collegeData as CollegeType
        );

        const {
          data: studentData,
          error: studentError
        } =
          await supabase
            .from("profiles")
            .select("*")
            .eq(
              "college_code",
              collegeCode
            );

        if (studentError) {

          console.error(studentError);

          return;
        }

        setStudents(
          (studentData ||
            []) as StudentType[]
        );

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  if (loading) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-white">

        Loading Admin Dashboard...

      </main>
    );
  }

  if (!college) {

    return (

      <main className="flex min-h-screen items-center justify-center bg-[#050816] text-2xl text-red-400">

        College Not Found

      </main>
    );
  }

  const signupLink =

    `${window.location.origin}/student-signup/${college.college_code}`;

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <div className="rounded-3xl border border-cyan-500/20 bg-white/5 p-10">

          <h1 className="text-5xl font-black text-cyan-400">

            {college.college_name}

          </h1>

          <p className="mt-4 text-xl text-gray-300">

            College Code:
            {" "}
            {college.college_code}

          </p>

          <p className="mt-2 text-gray-300">

            Admin:
            {" "}
            {college.admin_email}

          </p>

        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-3">

          <div className="rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-8">

            <h2 className="text-2xl font-bold">

              Total Students

            </h2>

            <p className="mt-6 text-5xl font-black text-cyan-400">

              {students.length}

            </p>

          </div>

          <div className="rounded-3xl border border-purple-500/20 bg-purple-500/10 p-8">

            <h2 className="text-2xl font-bold">

              Create Exams

            </h2>

            <button
              onClick={() =>
                window.location.href =
                  "/create-adaptive-exam"
              }
              className="mt-8 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-8 py-4 font-bold"
            >

              Create Exam

            </button>

          </div>

          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-8">

            <h2 className="text-2xl font-bold">

              Student Signup Link

            </h2>

            <input
              value={signupLink}
              readOnly
              className="mt-6 w-full rounded-xl border border-white/10 bg-black/40 p-4 text-sm"
            />

            <button
              onClick={() => {

                navigator.clipboard.writeText(
                  signupLink
                );

                alert(
                  "Signup Link Copied"
                );
              }}
              className="mt-6 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-4 font-bold"
            >

              Copy Link

            </button>

          </div>

        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10">

          <h2 className="text-4xl font-black">

            Registered Students

          </h2>

          <div className="mt-10 overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-white/10 text-left">

                  <th className="p-4">

                    Name

                  </th>

                  <th className="p-4">

                    Roll Number

                  </th>

                  <th className="p-4">

                    Section

                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map((student) => (

                  <tr
                    key={student.id}
                    className="border-b border-white/5"
                  >

                    <td className="p-4">

                      {student.name}

                    </td>

                    <td className="p-4">

                      {student.roll_number}

                    </td>

                    <td className="p-4">

                      {student.section}

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </main>
  );
}