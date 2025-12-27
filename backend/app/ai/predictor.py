def predict_future_risk(threat_count):
    if threat_count > 5:
        return "CRITICAL – High probability of ransomware or lateral movement"
    elif threat_count > 2:
        return "ELEVATED – Possible reconnaissance detected"
    else:
        return "LOW – Normal behavior"
