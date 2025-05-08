from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import stripe
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://freeqrcodecreator.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stripe secret key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

@app.get("/")
def root():
    return {"message": "API is running"}

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
                        "product_data": {"name": "Premium QR Code"},
                        "unit_amount": 499,  # $4.99
                    },
                    "quantity": 1,
                },
            ],
            success_url=os.getenv("STRIPE_SUCCESS_URL", "https://freeqrcodecreator.netlify.app/success"),
            cancel_url=os.getenv("STRIPE_CANCEL_URL", "https://freeqrcodecreator.netlify.app/cancel"),
        )
        return {"id": session.id}
    except Exception as e:
        print("Stripe error:", str(e))
        return JSONResponse(status_code=500, content={"error": str(e)})
