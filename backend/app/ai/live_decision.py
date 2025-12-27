def decide_action(event):
    if event["severity"] == "CRITICAL":
        return "AUTO-BLOCK EXECUTED"
    elif event["severity"] == "HIGH":
        return "MONITOR & ALERT"
    else:
        return "LOG ONLY"
