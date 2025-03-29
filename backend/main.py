from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hotels_data import HOTELS
from utils import parse_criteria

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

@app.post("/api/chat")
def chat(message: Message):
    user_input = message.message
    criteria = parse_criteria(user_input)


    if criteria["max_price"] is None:
        return {"reply": "Quel est votre budget approximatif par nuit ?"}


    results = [
        h for h in HOTELS
        if criteria["location"].lower() in h["city"].lower()
        and h["price"] <= criteria["max_price"]
    ]


    if results:
        reply = "Voici quelques hôtels que je recommande :<br><br>"
        for hotel in results[:3]: 
            reply += f"🏨 <strong>{hotel['name']}</strong><br>"
            reply += f"📍 {hotel['city']} - {hotel['address']}<br>"
            reply += f"💰 {hotel['price']}€/nuit<br><br>"
    else:
        reply = "Désolé, je n’ai trouvé aucun hôtel correspondant à votre demande."

    return {"reply": reply}
