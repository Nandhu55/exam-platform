import uuid


def generate_exam_code():

    return str(uuid.uuid4())[:8]