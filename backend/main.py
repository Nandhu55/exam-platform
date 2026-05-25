from fastapi import (
    FastAPI,
    
)
from fastapi.responses import JSONResponse
from fastapi import Response
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client
from groq import Groq
from dotenv import load_dotenv
from collections import Counter
from datetime import datetime, timedelta
from typing import List
import uuid
import json
import os

# ----------------------------
# LOAD ENV
# ----------------------------

load_dotenv()

# ----------------------------
# API CLIENTS
# ----------------------------

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

# ----------------------------
# FASTAPI
# ----------------------------

app = FastAPI()

# ----------------------------
# CORS
# ----------------------------

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000",
        "https://exam-platform-max.vercel.app",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

# ----------------------------
# AUTH CONFIG
# ----------------------------


ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"

# ----------------------------
# JWT FUNCTIONS
# ----------------------------



def verify_admin(request: Request):

    token = request.cookies.get(
        "admin_token"
    )

    if token != "admin_logged_in":

        return False

    return True
# ----------------------------
# MODELS
# ----------------------------

class Question(BaseModel):
    question: str
    optionA: str
    optionB: str
    optionC: str
    optionD: str
    correctAnswer: str


class Exam(BaseModel):
    title: str
    description: str
    duration: int
    questions: List[Question]


class Submission(BaseModel):
    exam_code: str
    participant_name: str
    roll_number: str
    section: str
    college: str
    answers: dict


class AIQuestionRequest(BaseModel):
    topic: str
    difficulty: str
    question_count: int
    marks: int


class CheatingLog(BaseModel):
    participant_name: str
    exam_code: str
    warning_type: str


class Candidate(BaseModel):
    exam_code: str
    participant_name: str
    roll_number: str
    section: str
    college: str


class AdminLogin(BaseModel):
    email: str
    password: str

class AdaptiveExam(BaseModel):

    topic: str
    total_questions: int
    min_difficulty: int
    max_difficulty: int


class AdaptiveQuestionRequest(BaseModel):

    topic: str
    difficulty: int


class AdaptiveAnswer(BaseModel):

    session_id: str

    question: str

    selected_answer: str

    correct_answer: str

    is_correct: bool

    difficulty: int


# ----------------------------
# HOME
# ----------------------------

@app.get("/")
def home():

    return {
        "message": "Exam Platform Backend Running"
    }

# ----------------------------
# ADMIN LOGIN
# ----------------------------

from fastapi import Response

@app.post("/admin/login")
def admin_login(
    data: dict,
    response: Response
):

    email = data.get("email")
    password = data.get("password")

    ADMIN_EMAIL = "admin@gmail.com"
    ADMIN_PASSWORD = "admin123"

    # INVALID LOGIN
    if (
        email != ADMIN_EMAIL
        or password != ADMIN_PASSWORD
    ):

        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": "Invalid credentials"
            }
        )

    # VALID LOGIN
    token = "admin_logged_in"

    response.set_cookie(
        key="admin_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=60 * 60,
        path="/"
    )

    return {
        "success": True,
        "message": "Login successful"
    }

# ----------------------------
# ADMIN LOGOUT
# ----------------------------

@app.post("/admin/logout")
def admin_logout():

    response = JSONResponse({
        "message": "Logged out successfully"
    })

    response.delete_cookie(
        key="admin_token"
    )

    return response

# ----------------------------
# CREATE EXAM
# ----------------------------
@app.post("/create-exam")
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
    exam_code = str(uuid.uuid4())[:8]

    # SAVE EXAM
    supabase.table("exams").insert({
        "exam_code": exam_code,
        "title": exam.title,
        "description": exam.description,
        "duration": exam.duration
    }).execute()

    # SAVE QUESTIONS
    for question in exam.questions:

        supabase.table("questions").insert({

            "exam_code": exam_code,

            "question": question.question,

            "option_a": question.optionA,

            "option_b": question.optionB,

            "option_c": question.optionC,

            "option_d": question.optionD,

            "correct_answer": question.correctAnswer

        }).execute()

    return {

    "message": "Exam created successfully",

    "exam_code": exam_code,

    "exam_link": f"https://exam-platform-max.vercel.app/exam/{exam_code}"
}

# ----------------------------
# GET EXAM
# ----------------------------

@app.get("/exam/{exam_code}")
def get_exam(exam_code: str):

    exam_response = supabase.table(
        "exams"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    if not exam_response.data:

        return {
            "error": "Exam not found"
        }

    questions_response = supabase.table(
        "questions"
    ).select("*").eq(
        "exam_code",
        exam_code
    ).execute()

    exam = exam_response.data[0]

    return {

        "title": exam["title"],

        "description": exam["description"],

        "duration": exam["duration"],

        "questions": [

            {
                "question": q["question"],
                "optionA": q["option_a"],
                "optionB": q["option_b"],
                "optionC": q["option_c"],
                "optionD": q["option_d"],
                "correctAnswer": q["correct_answer"]
            }

            for q in questions_response.data
        ]
    }

# ----------------------------
# SUBMIT EXAM
# ----------------------------

@app.post("/submit-exam")
def submit_exam(submission: Submission):

    questions_response = supabase.table(
        "questions"
    ).select("*").eq(
        "exam_code",
        submission.exam_code
    ).execute()

    questions = questions_response.data

    if not questions:

        return {
            "error": "Exam not found"
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

        "exam_code": submission.exam_code,

        "participant_name": submission.participant_name,

        "roll_number": submission.roll_number,

        "section": submission.section,

        "college": submission.college,

        "score": score,

        "total": total,

        "percentage": percentage,

        "answers": submission.answers
    }

    supabase.table("results").insert(
        result_data
    ).execute()

    return {

        "message": "Exam submitted successfully",

        "result": {
            "score": score,
            "total": total,
            "percentage": percentage
        }
    }

# ----------------------------
# RESULTS
# ----------------------------

@app.get("/results")
def get_results(request: Request):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
            }
        )

    response = supabase.table(
        "results"
    ).select("*").execute()

    return {
        "results": response.data
    }

# ----------------------------
# CHEATING LOGS
# ----------------------------

@app.post("/log-cheating")
def log_cheating(log: CheatingLog):

    supabase.table("cheating_logs").insert({

        "participant_name": log.participant_name,

        "exam_code": log.exam_code,

        "warning_type": log.warning_type

    }).execute()

    return {
        "message": "Cheating log stored"
    }


@app.get("/cheating-logs")
def get_logs(request: Request):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
            }
        )

    response = supabase.table(
        "cheating_logs"
    ).select("*").execute()

    return {
        "logs": response.data
    }
# ----------------------------
# ANALYTICS
# ----------------------------

@app.get("/exam-analytics/{exam_code}")
def exam_analytics(
    exam_code: str,
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
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

    if not questions:

        return {
            "error": "Exam not found"
        }

    analytics = []

    for index, question in enumerate(questions):

        answer_counts = Counter()

        correct_count = 0

        total_attempts = 0

        for result in results:

            answers = result.get("answers", {})

            selected = answers.get(str(index))

            if selected:

                answer_counts[selected] += 1

                total_attempts += 1

                if selected == question["correct_answer"]:
                    correct_count += 1

        wrong_count = (
            total_attempts - correct_count
        )

        most_selected = None

        if answer_counts:
            most_selected = answer_counts.most_common(1)[0][0]

        analytics.append({

            "question": question["question"],

            "options": {
                "A": question["option_a"],
                "B": question["option_b"],
                "C": question["option_c"],
                "D": question["option_d"],
            },

            "correct_answer": question["correct_answer"],

            "option_distribution": {
                "A": answer_counts.get("A", 0),
                "B": answer_counts.get("B", 0),
                "C": answer_counts.get("C", 0),
                "D": answer_counts.get("D", 0),
            },

            "correct_count": correct_count,

            "wrong_count": wrong_count,

            "correct_percentage": (
                round(
                    (
                        correct_count /
                        total_attempts
                    ) * 100,
                    2
                )
                if total_attempts > 0
                else 0
            ),

            "most_selected": most_selected
        })

    return {
        "exam_code": exam_code,
        "analytics": analytics
    }

# ----------------------------
# CREATE ATTEMPT
# ----------------------------

@app.post("/create-attempt")
def create_attempt(data: Candidate):

    response = supabase.table(
        "exam_attempts"
    ).insert({

        "exam_code": data.exam_code,

        "participant_name": data.participant_name,

        "roll_number": data.roll_number,

        "section": data.section,

        "college": data.college

    }).execute()

    return {
        "attempt": response.data[0]
    }

# ----------------------------
# GET ATTEMPT
# ----------------------------

@app.get("/attempt/{attempt_id}")
def get_attempt(attempt_id: int):

    response = supabase.table(
        "exam_attempts"
    ).select("*").eq(
        "id",
        attempt_id
    ).execute()

    return response.data[0]

# ----------------------------
# GET ADAPTIVE EXAM
# ----------------------------

@app.get("/adaptive-exam/{adaptive_exam_id}")
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
            "error": "Adaptive exam not found"
        }

    return response.data[0]

# ----------------------------
# AI QUESTION GENERATION
# ----------------------------

@app.post("/generate-ai-questions")
async def generate_ai_questions(
    data: AIQuestionRequest,
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
            }
        )

    prompt = f"""
Generate {data.question_count} multiple choice questions about {data.topic}.

Difficulty level: {data.difficulty}

IMPORTANT RULES:
- correctAnswer MUST be ONLY:
  "A", "B", "C", or "D"
- DO NOT return full answer text
- Return ONLY valid JSON

Each question carries {data.marks} marks.

Return EXACTLY in this format:

{{
  "questions": [
    {{
      "question": "What is Python?",
      "optionA": "Snake",
      "optionB": "Programming Language",
      "optionC": "Game",
      "optionD": "Browser",
      "correctAnswer": "B",
      "marks": 1
    }}
  ]
}}
"""

    try:

        completion = client.chat.completions.create(

            model="meta-llama/llama-4-scout-17b-16e-instruct",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.7,
        )

        response_text = completion.choices[0].message.content

        cleaned_response = response_text.strip()

        if cleaned_response.startswith("```json"):

            cleaned_response = cleaned_response.replace(
                "```json",
                ""
            )

            cleaned_response = cleaned_response.replace(
                "```",
                ""
            )

        parsed_json = json.loads(
            cleaned_response
        )

        # SAFETY FIX
        for q in parsed_json["questions"]:

            if q["correctAnswer"] == q["optionA"]:
                q["correctAnswer"] = "A"

            elif q["correctAnswer"] == q["optionB"]:
                q["correctAnswer"] = "B"

            elif q["correctAnswer"] == q["optionC"]:
                q["correctAnswer"] = "C"

            elif q["correctAnswer"] == q["optionD"]:
                q["correctAnswer"] = "D"

        return parsed_json

    except Exception as e:

        return {
            "error": str(e)
        }
    

# ----------------------------
# CREATE ADAPTIVE EXAM
# ----------------------------

@app.post("/create-adaptive-exam")
def create_adaptive_exam(
    data: AdaptiveExam,
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "message": "Unauthorized"
            }
        )

    adaptive_exam_id = str(uuid.uuid4())[:8]

    supabase.table(
        "adaptive_exams"
    ).insert({

        "adaptive_exam_id":
            adaptive_exam_id,

        "topic":
            data.topic,

        "total_questions":
            data.total_questions,

        "min_difficulty":
            data.min_difficulty,

        "max_difficulty":
            data.max_difficulty

    }).execute()

    return {

        "message":
            "Adaptive exam created",

        "adaptive_exam_id":
            adaptive_exam_id
    }



  
@app.get("/admin/verify")
def verify_admin_route(request: Request):

    if not verify_admin(request):

        return JSONResponse(
            status_code=401,
            content={
                "authenticated": False
            }
        )

    return {
        "authenticated": True
    }

# ----------------------------
# GENERATE ADAPTIVE QUESTION
# ----------------------------

class AdaptiveQuestionRequest(BaseModel):

    topic: str

    difficulty: int

    previous_questions: list[str] = []


@app.post("/generate-adaptive-question")
async def generate_adaptive_question(
    data: AdaptiveQuestionRequest
):

    difficulty_map = {
        1: "Easy",
        2: "Medium",
        3: "Hard",
        4: "Expert",
        5: "Master"
    }

    difficulty_name = difficulty_map.get(
        data.difficulty,
        "Medium"
    )

    previous_questions_text = "\n".join(
        data.previous_questions
    )

    prompt = f"""
You are an AI exam generator.

Generate ONLY ONE unique MCQ question.

Topic:
{data.topic}

Difficulty:
{difficulty_name}

PREVIOUS QUESTIONS:
{previous_questions_text}

STRICT RULES:
1. Return ONLY raw JSON
2. No markdown
3. No explanation
4. No ```json
5. No extra text
6. Must contain ALL fields
7. Never repeat previous questions

JSON FORMAT:

{{
  "question": "What is Python?",
  "optionA": "Programming Language",
  "optionB": "Database",
  "optionC": "Browser",
  "optionD": "Operating System",
  "correctAnswer": "A"
}}
"""

    try:

        completion = client.chat.completions.create(

            model="meta-llama/llama-4-scout-17b-16e-instruct",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.4
        )

        response_text = (
            completion
            .choices[0]
            .message
            .content
        )

        cleaned_response = (
            response_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        # ----------------------------
        # SAFE JSON PARSING
        # ----------------------------

        try:

            parsed_json = json.loads(
                cleaned_response
            )

        except Exception:

            return {
                "question":
                    f"What is an important concept in {data.topic}?",

                "optionA":
                    "Option A",

                "optionB":
                    "Option B",

                "optionC":
                    "Option C",

                "optionD":
                    "Option D",

                "correctAnswer":
                    "A"
            }

        # ----------------------------
        # REQUIRED FIELDS
        # ----------------------------

        required_fields = [

            "question",

            "optionA",

            "optionB",

            "optionC",

            "optionD",

            "correctAnswer"
        ]

        # ----------------------------
        # VALIDATE RESPONSE
        # ----------------------------

        for field in required_fields:

            if (
                field not in parsed_json
                or not parsed_json[field]
            ):

                return {
                    "question":
                        f"What is an important concept in {data.topic}?",

                    "optionA":
                        "Option A",

                    "optionB":
                        "Option B",

                    "optionC":
                        "Option C",

                    "optionD":
                        "Option D",

                    "correctAnswer":
                        "A"
                }

        return parsed_json

    except Exception as e:

        return {
            "error": str(e)
        }
    
# ----------------------------
# SAVE ADAPTIVE ATTEMPT
# ----------------------------

class SaveAdaptiveAttempt(BaseModel):

    adaptive_exam_id: str

    participant_name: str

    roll_number: str

    college: str

    section: str

    question_number: int

    question: str

    selected_answer: str

    correct_answer: str

    is_correct: bool

    difficulty: int


@app.post("/save-adaptive-attempt")
def save_adaptive_attempt(
    data: SaveAdaptiveAttempt
):

    supabase.table(
        "adaptive_attempts"
    ).insert({

        "adaptive_exam_id":
            data.adaptive_exam_id,

        "participant_name":
            data.participant_name,

        "roll_number":
    data.roll_number,

"college":
    data.college,

"section":
    data.section,    

        "question_number":
            data.question_number,

        "question":
            data.question,

        "selected_answer":
            data.selected_answer,

        "correct_answer":
            data.correct_answer,

        "is_correct":
            data.is_correct,

        "difficulty":
            data.difficulty

    }).execute()

    return {
        "message":
            "Attempt saved"
    }       


# ----------------------------
# AI PERFORMANCE REPORT
# ----------------------------

@app.get("/adaptive-report/{student_name}")
async def adaptive_report(
    student_name: str
):

    response = supabase.table(
        "adaptive_attempts"
    ).select("*").eq(
        "participant_name",
        student_name
    ).execute()

    attempts = response.data

    if not attempts:

        return {
            "error": "No attempts found"
        }

    total_questions = len(attempts)

    correct_answers = len([
        a for a in attempts
        if a["is_correct"]
    ])

    wrong_answers = (
        total_questions -
        correct_answers
    )

    average_difficulty = round(

        sum(
            a["difficulty"]
            for a in attempts
        ) / total_questions,

        2
    )

    prompt = f"""
Analyze this student performance.

Student:
{student_name}

Total Questions:
{total_questions}

Correct Answers:
{correct_answers}

Wrong Answers:
{wrong_answers}

Average Difficulty:
{average_difficulty}

Generate:
1. Strengths
2. Weaknesses
3. Improvement Suggestions
4. Overall Performance Level

Keep response professional.
"""

    try:

        completion = client.chat.completions.create(

            model="meta-llama/llama-4-scout-17b-16e-instruct",

            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.7
        )

        ai_report = (
            completion
            .choices[0]
            .message
            .content
        )

        return {

            "student_name":
                student_name,

            "total_questions":
                total_questions,

            "correct_answers":
                correct_answers,

            "wrong_answers":
                wrong_answers,

            "average_difficulty":
                average_difficulty,

            "ai_report":
                ai_report
        }

    except Exception as e:

        return {
            "error": str(e)
        }