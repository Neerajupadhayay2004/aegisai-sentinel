def analyze_threats(threats):
    analysis = []

    for t in threats:
        analysis.append({
            "threat": t,
            "mitre_tactic": "Initial Access",
            "mitre_technique": "T1071 - Application Layer Protocol",
            "business_impact": "Possible data exfiltration",
            "risk": "HIGH"
        })

    return analysis
