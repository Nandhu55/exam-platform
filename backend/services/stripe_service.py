import os
import stripe
from dotenv import load_dotenv

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


def create_checkout_session(exam_id: str, title: str, amount: float):
    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        mode="payment",
        line_items=[
            {
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": title,
                    },
                    "unit_amount": int(amount * 100),
                },
                "quantity": 1,
            }
        ],
        success_url="https://exam-platform-max.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="https://exam-platform-max.vercel.app/payment-cancel",
        metadata={
            "exam_id": exam_id,
        },
    )

    return session