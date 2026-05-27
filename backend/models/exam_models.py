from pydantic import BaseModel
from typing import List


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


class Candidate(BaseModel):

    exam_code: str

    participant_name: str

    roll_number: str

    section: str

    college: str