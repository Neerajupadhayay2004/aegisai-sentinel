import psutil
import time

def scan_system():
    threats = []

    cpu = psutil.cpu_percent(interval=1)
    mem = psutil.virtual_memory().percent

    if cpu > 85:
        threats.append(f"High CPU usage detected: {cpu}%")

    if mem > 90:
        threats.append(f"High memory usage detected: {mem}%")

    for conn in psutil.net_connections(kind='inet'):
        if conn.status == "ESTABLISHED" and conn.raddr:
            threats.append(f"Active outbound connection to {conn.raddr.ip}")

    return threats
