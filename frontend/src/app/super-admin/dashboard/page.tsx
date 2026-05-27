"use client";

import { useState } from "react";

import { supabase } from "@/lib/supabase";

export default function SuperAdminDashboard() {

  const [collegeName, setCollegeName] =
    useState("");

  const [collegeCode, setCollegeCode] =
    useState("");

  const [adminEmail, setAdminEmail] =
    useState("");

  const [adminPassword, setAdminPassword] =
    useState("");

  const createCollege =
    async () => {

      if (
        !collegeName ||
        !collegeCode ||
        !adminEmail ||
        !adminPassword
      ) {

        alert(
          "Fill all fields"
        );

        return;
      }

      // =========================
      // CREATE COLLEGE
      // =========================

      const {
        data: collegeData,
        error: collegeError
      } = await supabase
        .from("colleges")
        .insert([
          {
            college_name:
              collegeName,

            college_code:
              collegeCode,

            admin_email:
              adminEmail
          }
        ])
        .select()
        .single();

      if (collegeError) {

        console.error(
          collegeError
        );

        alert(
          "College creation failed"
        );

        return;
      }

      // =========================
      // CREATE ADMIN
      // =========================

      const {
        error: adminError
      } = await supabase
        .from("admins")
        .insert([
          {
            email:
              adminEmail,

            password:
              adminPassword,

            college_id:
              collegeData.id,

            role:
              "admin"
          }
        ]);

      if (adminError) {

        console.error(
          adminError
        );

        alert(
          "Admin creation failed"
        );

        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert(
  "College Created Successfully"
);

      setCollegeName("");
      setCollegeCode("");
      setAdminEmail("");
      setAdminPassword("");
    };

  return (

    <main className="min-h-screen bg-[#050816] p-8 text-white">

      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10">

        <h1 className="text-5xl font-black text-cyan-400">

          Super Admin Dashboard

        </h1>

        <p className="mt-6 text-xl text-gray-300">

          Create Colleges & Admin Accounts

        </p>

        <div className="mt-10 space-y-6">

          <input
            type="text"
            placeholder="College Name"
            value={collegeName}
            onChange={(e) =>
              setCollegeName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <input
            type="text"
            placeholder="College Code (example: au)"
            value={collegeCode}
            onChange={(e) =>
              setCollegeCode(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <input
            type="email"
            placeholder="Admin Email"
            value={adminEmail}
            onChange={(e) =>
              setAdminEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <input
            type="password"
            placeholder="Admin Password"
            value={adminPassword}
            onChange={(e) =>
              setAdminPassword(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-6 py-4 text-lg outline-none"
          />

          <button
            onClick={createCollege}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-4 text-xl font-bold"
          >

            Create College

          </button>

        </div>

      </div>

    </main>
  );
}