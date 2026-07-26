import re
import bcrypt
from fastapi import HTTPException
from core.database import supabase


def generate_slug(name: str):
    slug = name.lower()
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = slug.strip("-")
    return slug


def generate_unique_slug(base_slug):
    slug = base_slug
    count = 1

    while True:
        existing = (
            supabase.table("organizations")
            .select("id")
            .eq("slug", slug)
            .execute()
        )

        if not existing.data:
            return slug

        slug = f"{base_slug}-{count}"
        count += 1


def hash_password(password: str):
    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()


def setup_organization(data):

    slug = generate_unique_slug(
        generate_slug(data.organization_name)
    )

    hashed_password = hash_password(data.admin_password)

    # Create Organization
    org = (
        supabase.table("organizations")
        .insert({
            "name": data.organization_name,
            "slug": slug
        })
        .execute()
    )

    organization = org.data[0]
    organization_id = organization["id"]

    # Create Settings
    supabase.table("organization_settings").insert({
        "organization_id": organization_id,
        "support_email": data.admin_email
    }).execute()

    # Create Admin
    admin = (
        supabase.table("admins")
        .insert({
            "email": data.admin_email,
            "password": hashed_password,
            "organization_id": organization_id,
            "role": "ORG_ADMIN"
        })
        .execute()
    )

    # Default Departments
    departments = [
        "Computer Science",
        "Information Technology",
        "Mechanical",
        "Civil",
        "Electrical",
        "Electronics",
        "MBA"
    ]

    rows = []

    for dept in departments:
        rows.append({
            "organization_id": organization_id,
            "name": dept,
            "code": dept[:3].upper()
        })

    supabase.table("departments").insert(rows).execute()

    return {
        "success": True,
        "organization": organization,
        "admin": {
            "email": data.admin_email,
            "role": "ORG_ADMIN"
        },
        "message": "Organization created successfully"
    }