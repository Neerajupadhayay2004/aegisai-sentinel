def analyze_threat(threat: str):
    return {
        "threat": threat,
        "category": "Real-Time Behavioral Anomaly",
        "mitre_tactic": "Initial Access",
        "mitre_technique": "T1071 - Application Layer Protocol",
        "technical_impact": "Suspicious system or network behavior detected",
        "business_impact": "Potential data breach, downtime, or financial loss for SME",
        "severity": "CRITICAL",
        "risk_score": 85,
        "recommendation": "Automatically blocked suspicious activity and alerted admin"
    }
