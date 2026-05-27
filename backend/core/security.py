from fastapi import Request


def verify_admin(
    request: Request
):

    token = request.cookies.get(
        "admin_token"
    )

    return token == "admin_logged_in"