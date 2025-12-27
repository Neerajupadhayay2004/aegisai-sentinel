from fastapi import APIRouter
from pydantic import BaseModel
from app.notifier.telegram import send_alert

router = APIRouter()

class AlertPayload(BaseModel):
    title: str
    severity: str
    description: str
    source: str
    asset: str

@router.post("/alert")
def send_alert_to_telegram(payload: AlertPayload):
    message = f"""
🚨 *AEGISAI SENTINEL ALERT*

Title: {payload.title}
Severity: {payload.severity}
Source: {payload.source}
Asset: {payload.asset}

Details:
{payload.description}
"""

    send_alert(message)
    return {"status": "sent"}
