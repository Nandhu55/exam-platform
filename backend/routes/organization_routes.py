from fastapi import APIRouter
from core.database import supabase

router = APIRouter(prefix="/organizations", tags=["Organizations"])


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