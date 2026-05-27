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

# ----------------------------
# CREATE ADAPTIVE EXAM
# ----------------------------

@router.post("/create-adaptive-exam")
async def create_adaptive_exam(
    data: AdaptiveExam,
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

    try:

        adaptive_exam_id = str(
            uuid.uuid4()
        )

        college_code = request.cookies.get(
            "college-code"
        )

        adaptive_exam_data = {

            "adaptive_exam_id":
                adaptive_exam_id,

            "topic":
                data.topic,

            "total_questions":
                data.total_questions,

            "min_difficulty":
                data.min_difficulty,

            "max_difficulty":
                data.max_difficulty,

            "college_code":
                college_code
        }

        supabase.table(
            "adaptive_exams"
        ).insert(
            adaptive_exam_data
        ).execute()

        generated_questions = []

        for difficulty in range(
            data.min_difficulty,
            data.max_difficulty + 1
        ):

            question = (
                await generate_adaptive_ai_question(
                    topic=data.topic,
                    difficulty=difficulty
                )
            )

            question_data = {

                "adaptive_exam_id":
                    adaptive_exam_id,

                "question":
                    question["question"],

                "options":
                    question["options"],

                "correct_answer":
                    question["correct_answer"],

                "difficulty":
                    difficulty,

                "college_code":
                    college_code
            }

            supabase.table(
                "adaptive_questions"
            ).insert(
                question_data
            ).execute()

            generated_questions.append(
                question_data
            )

        return {

            "message":
                "Adaptive exam created successfully",

            "adaptive_exam_id":
                adaptive_exam_id,

            "questions":
                generated_questions
        }

    except Exception as e:

        print(e)

        return JSONResponse(
            status_code=500,
            content={
                "message":
                    "Failed to create adaptive exam"
            }
        )