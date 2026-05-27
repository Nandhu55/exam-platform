from pydantic import BaseModel


class CheatingLog(BaseModel):

    participant_name: str

    exam_code: str

    warning_type: str