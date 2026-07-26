"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function SuperAdminPage() {
  const [organizations, setOrganizations] = useState([]);

  const [form, setForm] = useState({
    organization_name: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
  });

  async function loadOrganizations() {
    const res = await fetch(`${API}/organizations`);
    const data = await res.json();
    setOrganizations(data.organizations || []);
  }

  useEffect(() => {
    loadOrganizations();
  }, []);

  async function createOrganization(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`${API}/organizations/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("Failed to create organization");
      return;
    }

    alert("Organization Created");

    setForm({
      organization_name: "",
      admin_name: "",
      admin_email: "",
      admin_password: "",
    });

    loadOrganizations();
  }

  return (
    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-4xl font-bold mb-8">
        Super Admin Dashboard
      </h1>

      <form
        onSubmit={createOrganization}
        className="bg-white rounded-xl shadow p-6 space-y-4 mb-10"
      >

        <input
          className="border p-3 rounded w-full"
          placeholder="Organization Name"
          value={form.organization_name}
          onChange={(e) =>
            setForm({
              ...form,
              organization_name: e.target.value,
            })
          }
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Admin Name"
          value={form.admin_name}
          onChange={(e) =>
            setForm({
              ...form,
              admin_name: e.target.value,
            })
          }
        />

        <input
          className="border p-3 rounded w-full"
          placeholder="Admin Email"
          value={form.admin_email}
          onChange={(e) =>
            setForm({
              ...form,
              admin_email: e.target.value,
            })
          }
        />

        <input
          type="password"
          className="border p-3 rounded w-full"
          placeholder="Password"
          value={form.admin_password}
          onChange={(e) =>
            setForm({
              ...form,
              admin_password: e.target.value,
            })
          }
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Create Organization
        </button>

      </form>

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Slug</th>

            </tr>

          </thead>

          <tbody>

            {organizations.map((org: any) => (

              <tr key={org.id} className="border-b">

                <td className="p-4">{org.name}</td>

                <td className="p-4">{org.slug}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}