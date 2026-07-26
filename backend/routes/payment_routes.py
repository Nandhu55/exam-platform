from fastapi import APIRouter
from models.exam_models import CheckoutRequest
from stripe_service import create_checkout_session

router = APIRouter()


@router.post("/create-checkout-session")
async def create_checkout(data: CheckoutRequest):
    session = create_checkout_session(
        exam_id=data.exam_id,
        title=data.title,
        amount=data.amount,
    )

    return {
        "checkout_url": session.url,
        "session_id": session.id,
    }