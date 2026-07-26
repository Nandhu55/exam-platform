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