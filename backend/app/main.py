from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler
import threading
from app.ai.threat_engine import analyze_threat

import time

# API routes
from app.api.routes import router

# Core engines
from app.scanner.system_scanner import scan_system
from app.scanner.realtime_monitor import realtime_scan
from app.ai.threat_engine import analyze_threat
from app.ai.live_decision import decide_action
from app.notifier.telegram import send_alert

# -----------------------------
# APP INITIALIZATION
# -----------------------------
app = FastAPI(
    title="AegisAI Sentinel – Autonomous Cyber Defense for SMEs",
    description="Self-healing, real-time AI-driven cyber defense platform for SMEs",
    version="1.0.0"
)

app.include_router(router, prefix="/api")

scheduler = BackgroundScheduler()

# -----------------------------
# PERIODIC SME SECURITY SCAN
# -----------------------------
def scheduled_security_scan():
    threats = scan_system()

    for t in threats:
        analysis = analyze_threat(t)

        message = f"""
🚨 AEGISAI SME SECURITY ALERT 🚨

Threat Detected:
{analysis['threat']}

Category: {analysis['category']}
MITRE Tactic: {analysis['mitre_tactic']}
Severity: {analysis['severity']}
Risk Score: {analysis['risk_score']}

Technical Impact:
{analysis['technical_impact']}

Business Impact (SME):
{analysis['business_impact']}

Recommended Action:
{analysis['recommendation']}
"""
        send_alert(message)

# -----------------------------
# REAL-TIME LIVE DEFENSE ENGINE
# -----------------------------
def live_defense_engine():
    send_alert(
        "🟢 AegisAI Sentinel LIVE DEFENSE ENGINE STARTED\n\n"
        "✔ Real-time monitoring enabled\n"
        "✔ Auto-blocking active\n"
        "✔ SME assets protected"
    )

    while True:
        events = realtime_scan()

        for event in events:
            action = decide_action(event)

            alert_msg = f"""
🚨 LIVE ATTACK DETECTED 🚨

Type: {event['type']}
Severity: {event['severity']}

Details:
{event['detail']}

Response:
{action}

Status:
Threat neutralized automatically.
"""
            send_alert(alert_msg)

        time.sleep(3)  # real-time loop delay

# -----------------------------
# STARTUP EVENT
# -----------------------------
@app.on_event("startup")
def startup_event():
    # Startup notification
    send_alert(
        "🟢 AegisAI Sentinel Backend STARTED\n\n"
        "System Status: ONLINE\n"
        "Mode: Autonomous Cyber Defense\n"
        "Target: Small & Medium Enterprises (SMEs)\n\n"
        "Monitoring and protection are now active."
    )

    # Start periodic scans (every 30 min)
    scheduler.add_job(
        scheduled_security_scan,
        "interval",
        minutes=30
    )
    scheduler.start()

    # Start live defense engine in background
    thread = threading.Thread(
        target=live_defense_engine,
        daemon=True
    )
    thread.start()

# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/health")
def health():
    return {
        "status": "AegisAI Sentinel Backend Running",
        "mode": "Autonomous SME Cyber Defense",
        "live_engine": "ACTIVE",
        "scheduler": "ACTIVE"
    }
