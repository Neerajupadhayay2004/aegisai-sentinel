import psutil
import time
import subprocess

SUSPICIOUS_PORTS = [4444, 1337, 6666]
CPU_THRESHOLD = 90

def block_ip(ip):
    print(f"[MOCK BLOCK] IP would be blocked: {ip}")


def realtime_scan():
    events = []

    # CPU abuse detection
    cpu = psutil.cpu_percent(interval=1)
    if cpu > CPU_THRESHOLD:
        events.append({
            "type": "CPU Abuse",
            "detail": f"High CPU usage detected: {cpu}%",
            "severity": "HIGH"
        })

    # Network connection monitoring
    for conn in psutil.net_connections(kind="inet"):
        if conn.raddr:
            if conn.raddr.port in SUSPICIOUS_PORTS:
                block_ip(conn.raddr.ip)
                events.append({
                    "type": "Malicious Network Connection",
                    "detail": f"Blocked IP {conn.raddr.ip} on port {conn.raddr.port}",
                    "severity": "CRITICAL"
                })

    return events
