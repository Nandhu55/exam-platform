from groq import Groq

from core.config import GROQ_API_KEY

import json


client = Groq(
    api_key=GROQ_API_KEY
)


async def generate_mcq_questions(
    topic: str,
    difficulty: str,
    question_count: int,
    marks: int
):

    prompt = f"""
Generate {question_count} MCQ questions about {topic}.

Difficulty:
{difficulty}

Each question carries {marks} marks.

Return ONLY valid JSON.

FORMAT:

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

    return json.loads(
        cleaned_response
    )


async def generate_adaptive_ai_question(
    topic: str,
    difficulty: int,
    previous_questions: list[str]
):

    difficulty_map = {

        1: "Easy",
        2: "Medium",
        3: "Hard",
        4: "Expert",
        5: "Master"
    }

    difficulty_name = difficulty_map.get(
        difficulty,
        "Medium"
    )

    previous_questions_text = "\n".join(
        previous_questions
    )

    prompt = f"""
Generate ONE MCQ question.

Topic:
{topic}

Difficulty:
{difficulty_name}

Avoid repeating:
{previous_questions_text}

Return ONLY JSON.

FORMAT:

{{
  "question": "",
  "optionA": "",
  "optionB": "",
  "optionC": "",
  "optionD": "",
  "correctAnswer": ""
}}
"""

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

    return json.loads(
        cleaned_response
    )