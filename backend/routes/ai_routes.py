from fastapi import APIRouter
from pydantic import BaseModel

from services.ai_service import (
    generate_mcq_questions
)

router = APIRouter()


# ============================================
# REQUEST MODEL
# ============================================

class AIQuestionRequest(BaseModel):

    topic: str
    difficulty: str
    question_count: int
    marks: int


# ============================================
# GENERATE AI QUESTIONS
# ============================================

@router.post("/generate-ai-questions")
async def generate_ai_questions(
    data: AIQuestionRequest
):

    try:

        questions = await generate_mcq_questions(

            topic=data.topic,

            difficulty=data.difficulty,

            question_count=data.question_count,

            marks=data.marks
        )

        return questions

    except Exception as e:

        print(e)

        return {
            "error":
                "AI generation failed"
        }