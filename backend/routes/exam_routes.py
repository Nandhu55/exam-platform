from fastapi import (
    APIRouter,
    Request
)

from fastapi.responses import JSONResponse

from core.database import supabase

from core.security import verify_admin

from models.exam_models import (
    Exam,
    Submission,
    Candidate
)

from utils.helpers import (
    generate_exam_code
)

router = APIRouter()


# ----------------------------
# CREATE EXAM
# ----------------------------

@router.post("/create-exam")
def create_exam(
    exam: Exam,
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
            }
        )

    exam_code = generate_exam_code()


    supabase.table("exams").insert({

    "exam_code": exam_code,

    "title": exam.title,

    "description": exam.description,

    "duration": exam.duration,

    "price": exam.price,

    "is_paid": exam.is_paid

    }).execute()

    for question in exam.questions:

        supabase.table("questions").insert({

            "exam_code": exam_code,

            "question": question.question,

            "option_a": question.optionA,

            "option_b": question.optionB,

            "option_c": question.optionC,

            "option_d": question.optionD,

            "correct_answer":
                question.correctAnswer

        }).execute()

    return {

        "message":
            "Exam created successfully",

        "exam_code":
            exam_code,

        "exam_link":
            f"https://exam-platform-max.vercel.app/exam/{exam_code}"
    }


# ----------------------------
# GET EXAM
# ----------------------------

@router.get("/exam/{exam_code}")
def get_exam(exam_code: str):

    exam_response = supabase.table(
        "exams"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    if not exam_response.data:

        return {
            "error":
                "Exam not found"
        }

    questions_response = supabase.table(
        "questions"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    exam = exam_response.data[0]

    return {

        "title":
            exam["title"],

        "description":
            exam["description"],

        "duration":
            exam["duration"],

        "questions": [

            {
                "question":
                    q["question"],

                "optionA":
                    q["option_a"],

                "optionB":
                    q["option_b"],

                "optionC":
                    q["option_c"],

                "optionD":
                    q["option_d"],

                "correctAnswer":
                    q["correct_answer"]
            }

            for q in questions_response.data
        ]
    }


# ----------------------------
# SUBMIT EXAM
# ----------------------------

@router.post("/submit-exam")
def submit_exam(
    submission: Submission
):

    questions_response = supabase.table(
        "questions"
    ).select("*").eq(
        "exam_code",
        submission.exam_code
    ).execute()

    questions = questions_response.data

    if not questions:

        return {
            "error":
                "Exam not found"
        }

    score = 0

    for index, question in enumerate(questions):

        correct = question["correct_answer"]

        selected = submission.answers.get(
            str(index)
        )

        if selected == correct:

            score += 1

    total = len(questions)

    percentage = (
        (score / total) * 100
    ) if total > 0 else 0

    result_data = {

        "exam_code":
            submission.exam_code,

        "participant_name":
            submission.participant_name,

        "roll_number":
            submission.roll_number,

        "section":
            submission.section,

        "college":
            submission.college,

        "score":
            score,

        "total":
            total,

        "percentage":
            percentage,

        "answers":
            submission.answers
    }

    supabase.table("results").insert(
        result_data
    ).execute()

    return {

        "message":
            "Exam submitted successfully",

        "result": {

            "score":
                score,

            "total":
                total,

            "percentage":
                percentage
        }
    }


# ----------------------------
# RESULTS
# ----------------------------

@router.get("/results")
def get_results(
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
        "results"
    ).select("*").execute()

    return {
        "results":
            response.data
    }


# ----------------------------
# CREATE ATTEMPT
# ----------------------------

@router.post("/create-attempt")
def create_attempt(
    data: Candidate
):

    response = supabase.table(
        "exam_attempts"
    ).insert({

        "exam_code":
            data.exam_code,

        "participant_name":
            data.participant_name,

        "roll_number":
            data.roll_number,

        "section":
            data.section,

        "college":
            data.college

    }).execute()

    return {
        "attempt":
            response.data[0]
    }


# ----------------------------
# GET ATTEMPT
# ----------------------------

@router.get("/attempt/{attempt_id}")
def get_attempt(
    attempt_id: int
):

    response = supabase.table(
        "exam_attempts"
    ).select("*").eq(
        "id",
        attempt_id
    ).execute()

    return response.data[0]

# ----------------------------
# GET ALL EXAMS
# ----------------------------

@router.get("/all-exams")
def get_all_exams():

    response = (
        supabase
        .table("exams")
        .select("*")
        .execute()
    )

    return {
        "exams": response.data
    }