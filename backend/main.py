from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import stripe
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse

load_dotenv()

app = FastAPI()

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://qr-code-creator-clean.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.post("/create-checkout-session")
async def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": "Premium QR Code",
                        },
                        "unit_amount": 499,  # $4.99
                    },
                    "quantity": 1,
                },
            ],
            success_url="https://qr-app.netlify.app/success",
            cancel_url="https://qr-app.netlify.app/cancel",
        )
        return {"id": session.id}
    except Exception as e:
        print("Stripe error:", e)
        return {"error": str(e)}
