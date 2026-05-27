from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth_routes import router as auth_router
from routes.exam_routes import router as exam_router
from routes.adaptive_routes import router as adaptive_router
from routes.analytics_routes import router as analytics_router
from routes.cheating_routes import router as cheating_router
from routes.report_routes import router as report_router

app = FastAPI()

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

app.include_router(auth_router)

app.include_router(exam_router)

app.include_router(adaptive_router)

app.include_router(analytics_router)

app.include_router(cheating_router)

app.include_router(report_router)


@app.get("/")
def home():

    return {
        "message": "Exam Platform Backend Running"
    }