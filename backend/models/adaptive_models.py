from pydantic import BaseModel


class AdaptiveExam(BaseModel):

    topic: str

    total_questions: int

    min_difficulty: int

    max_difficulty: int

    college_code: str


class AdaptiveQuestionRequest(BaseModel):

    topic: str

    difficulty: int

    previous_questions: list[str] = []


class AdaptiveAnswer(BaseModel):

    session_id: str

    question: str

    selected_answer: str

    correct_answer: str

    is_correct: bool

    difficulty: int


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


class AIQuestionRequest(BaseModel):

    topic: str

    difficulty: str

    question_count: int

    marks: int