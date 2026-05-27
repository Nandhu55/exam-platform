from fastapi import (
    APIRouter,
    Response,
    Request
)

from fastapi.responses import JSONResponse

from core.security import verify_admin

router = APIRouter()


@router.post("/admin/login")
def admin_login(
    data: dict,
    response: Response
):

    email = data.get("email")

    password = data.get("password")

    if (
        email != "admin@gmail.com"
        or password != "admin123"
    ):

        return JSONResponse(

            status_code=401,

            content={
                "message":
                    "Invalid credentials"
            }
        )

    response.set_cookie(

        key="admin_token",

        value="admin_logged_in",

        httponly=True,

        secure=True,

        samesite="none",

        max_age=3600,

        path="/"
    )

    return {
        "message":
            "Login successful"
    }


@router.get("/admin/verify")
def verify_admin_route(
    request: Request
):

    if not verify_admin(request):

        return JSONResponse(

            status_code=401,

            content={
                "authenticated":
                    False
            }
        )

    return {
        "authenticated":
            True
    }