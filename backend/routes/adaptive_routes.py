from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import JSONResponse

from core.database import supabase

from core.security import verify_admin

from models.adaptive_models import (
    AdaptiveExam,
    AdaptiveQuestionRequest
)

from services.ai_service import (
    generate_adaptive_ai_question
)

import uuid


router = APIRouter()
# ----------------------------
# GET ADAPTIVE EXAM
# ----------------------------

@router.get("/adaptive-exam/{adaptive_exam_id}")
def get_adaptive_exam(
    adaptive_exam_id: str
):

    response = supabase.table(
        "adaptive_exams"
    ).select("*").eq(
        "adaptive_exam_id",
        adaptive_exam_id
    ).execute()

    if not response.data:

        return {
            "error":
                "Adaptive exam not found"
        }

    return response.data[0]


# ----------------------------
# GET ALL ADAPTIVE EXAMS
# ----------------------------

@router.get("/adaptive-exams")
async def get_all_adaptive_exams():

    response = (
        supabase
        .table("adaptive_exams")
        .select("*")
        .execute()
    )

    return response.data