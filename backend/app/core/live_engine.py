import time
from app.scanner.realtime_monitor import realtime_scan
from app.ai.live_decision import decide_action
from app.notifier.telegram import send_alert

def start_live_engine():
    send_alert("🟢 LIVE DEFENSE ENGINE STARTED")

    while True:
        events = realtime_scan()

        for e in events:
            action = decide_action(e)
            msg = f"""
🚨 LIVE ATTACK DETECTED

Type: {e['type']}
Severity: {e['severity']}
Details: {e['detail']}
Action: {action}
"""
            send_alert(msg)

        time.sleep(3)
