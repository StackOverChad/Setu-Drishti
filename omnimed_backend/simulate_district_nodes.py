import requests
import time
import random

API_URL = "http://localhost:8000/api/v1/sync"

VILLAGES = ["Block 7", "Village A", "Village B", "Sector 4", "Highland Ridge"]
SYMPTOMS = ["fever", "cough", "anemia", "chronic fatigue", "lesion", "rash"]
MEDICATIONS = ["Iron Supplement", "Paracetamol", "Amoxicillin", "Vitamin C"]

print("=========================================")
print("[START] OmniMed Edge Node Crisis Simulator")
print("=========================================")
print("Simulating 25 frontline health workers actively syncing data from the field...")

for i in range(25):
    # Create realistic anomalies - e.g. Block 7 has a fever+cough cluster
    is_anomaly = random.random() > 0.7
    
    loc = "Block 7" if is_anomaly else random.choice(VILLAGES)
    # Generate random tags
    if is_anomaly:
        tags = "fever, cough, heavy breathing"
    else:
        tags = ", ".join(random.sample(SYMPTOMS, random.randint(1, 3)))
        
    meds = ", ".join(random.sample(MEDICATIONS, random.randint(0, 2)))
    
    payload = {
        "patient_id": f"P-{random.randint(1000, 9999)}",
        "clinical_notes": f"Field scan completed. Patient in {loc}. Anomalies detected.",
        "location_block": loc,
        "diagnosis_tags": tags,
        "medication_used": meds,
        "vitals_drift_score": round(random.uniform(0.1, 0.9), 2)
    }

    try:
        r = requests.post(API_URL, json=payload)
        status = "[Sync OK]" if r.status_code == 200 else "[FAILED]"
        print(f"{status} Synced {payload['patient_id']} from {loc} | Tags: {tags}")
    except Exception as e:
        print(f"[ERROR] Connection error: Is FastAPI running? {e}")
        break

    # Wait 0.5s to realistically simulate sequential field uploads
    time.sleep(0.5)

print("\n[DONE] Simulation Complete. Check the mobile District Health Pulse! You should see new clusters forming instantly.")
