from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import JSONResponse

from core.database import supabase

from core.security import verify_admin

from services.analytics_service import (
    calculate_exam_analytics
)

router = APIRouter()


@router.get("/exam-analytics/{exam_code}")
def exam_analytics(
    exam_code: str,
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message":
                    "Unauthorized"
            }
        )

    questions_response = supabase.table(
        "questions"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    questions = questions_response.data

    results_response = supabase.table(
        "results"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    results = results_response.data

    analytics = calculate_exam_analytics(
        questions,
        results
    )

    return {

        "exam_code":
            exam_code,

        "analytics":
            analytics
    }