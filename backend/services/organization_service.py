from fastapi import HTTPException
from core.database import supabase


def setup_organization(data):

    # Check duplicate slug
    existing = (
        supabase.table("organizations")
        .select("id")
        .eq("slug", data.slug)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="Organization already exists"
        )

    # -------------------------
    # Create Organization
    # -------------------------
    org = (
        supabase.table("organizations")
        .insert({
            "name": data.organization_name,
            "slug": data.slug
        })
        .execute()
    )

    organization = org.data[0]
    organization_id = organization["id"]

    # -------------------------
    # Create Settings
    # -------------------------
    supabase.table("organization_settings").insert({
        "organization_id": organization_id,
        "support_email": data.admin_email
    }).execute()

    # -------------------------
    # Create Organization Admin
    # -------------------------
    admin = (
        supabase.table("admins")
        .insert({
            "email": data.admin_email,
            "password": data.admin_password,
            "organization_id": organization_id,
            "role": "ORG_ADMIN"
        })
        .execute()
    )

    # -------------------------
    # Default Departments
    # -------------------------
    departments = [
        "Computer Science",
        "Information Technology",
        "Mechanical",
        "Civil",
        "Electrical",
        "Electronics",
        "MBA"
    ]

    department_rows = []

    for dept in departments:
        department_rows.append({
            "organization_id": organization_id,
            "name": dept,
            "code": dept[:3].upper()
        })

    supabase.table("departments").insert(department_rows).execute()

    return {
        "message": "Organization setup completed",
        "organization": organization,
        "admin": admin.data
    }