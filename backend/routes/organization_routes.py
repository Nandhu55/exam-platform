from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from core.database import supabase

router = APIRouter(prefix="/organizations", tags=["Organizations"])


class OrganizationCreate(BaseModel):
    name: str
    slug: str
    email: str
    phone: str | None = None
    website: str | None = None
class OrganizationSetup(BaseModel):
    organization_name: str
    slug: str
    admin_name: str
    admin_email: str
    admin_password: str

@router.get("/")
def get_organizations():
    response = (
        supabase
        .table("organizations")
        .select("*")
        .execute()
    )

    return {
        "organizations": response.data
    }


@router.post("/")
def create_organization(data: OrganizationCreate):

    existing = (
        supabase
        .table("organizations")
        .select("id")
        .eq("slug", data.slug)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="Slug already exists"
        )

    response = (
        supabase
        .table("organizations")
        .insert({
            "name": data.name,
            "slug": data.slug,
            "email": data.email,
            "phone": data.phone,
            "website": data.website
        })
        .execute()
    )

    return {
        "message": "Organization created successfully",
        "organization": response.data
    }

@router.post("/setup")
def setup_organization(data: OrganizationSetup):

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

    # Create Organization
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

    # Create Organization Settings
    supabase.table("organization_settings").insert({
        "organization_id": organization_id,
        "support_email": data.admin_email
    }).execute()

    return {
        "message": "Organization setup completed",
        "organization": organization
    }