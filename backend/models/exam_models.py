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

    # New fields
    price: int = 0
    is_paid: bool = False

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


class CheckoutRequest(BaseModel):
    exam_id: str
    title: str
    amount: float    