from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import JSONResponse

from core.database import supabase

from core.security import verify_admin

from models.student_models import (
    CheatingLog
)

router = APIRouter()


# ----------------------------
# LOG CHEATING
# ----------------------------

@router.post("/log-cheating")
def log_cheating(
    log: CheatingLog
):

    supabase.table(
        "cheating_logs"
    ).insert({

        "participant_name":
            log.participant_name,

        "exam_code":
            log.exam_code,

        "warning_type":
            log.warning_type

    }).execute()

    return {
        "message":
            "Cheating log stored"
    }


# ----------------------------
# GET LOGS
# ----------------------------

@router.get("/cheating-logs")
def get_logs(
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

    response = supabase.table(
        "cheating_logs"
    ).select("*").execute()

    return {
        "logs":
            response.data
    }