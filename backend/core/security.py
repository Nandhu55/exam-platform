from fastapi import Request


def verify_admin(
    request: Request
):

    return True