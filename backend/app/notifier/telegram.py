import requests
from app.core.config import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


def send_alert(message: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": f"🚨 AEGISAI ALERT 🚨\n\n{message}"
    }
    try:
        requests.post(url, json=payload, timeout=10)
    except Exception as e:
        print("Telegram Error:", e)
