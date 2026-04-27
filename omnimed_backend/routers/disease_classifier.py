from fastapi import APIRouter, File, UploadFile, HTTPException
from pydantic import BaseModel
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import io
import base64

router = APIRouter()

# ---------------------------------------------------------
# 1. LOAD THE PYTORCH CNN MODEL ARCHITECTURE
# ---------------------------------------------------------
try:
    # Initialize the exact same MobileNetV2 architecture used in Colab
    model = models.mobilenet_v2(weights=None)
    num_ftrs = model.classifier[1].in_features
    # We trained on 2 classes so we set the final layer to 2 output nodes!
    model.classifier[1] = nn.Linear(num_ftrs, 2)
    
    # Load the highly-trained weights your GPU just calculated!
    model.load_state_dict(torch.load("ml_models/nidana_skin_triage.pt", map_location=torch.device('cpu')))
    model.eval() # Set model to evaluation mode (no gradient calculation)
    print("✅ PyTorch MobileNetV2 successfully injected into FastAPI Engine!")
except Exception as e:
    print(f"⚠️ Warning: Could not load the PT model. Did you place it in ml_models/? Error: {e}")
    model = None

# Mathematical image pre-processing to lock it into what the CNN natively expects
transform_pipeline = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

# Define the expected JSON payload from the phone
class ImagePayload(BaseModel):
    image_base64: str

# ---------------------------------------------------------
# 2. CREATE THE API ENDPOINT FOR THE MOBILE APP
# ---------------------------------------------------------
@router.post("/api/v1/analyze_image")
async def analyze_skin_lesion(payload: ImagePayload):
    if model is None:
        raise HTTPException(status_code=500, detail="Neural Network model not currently loaded on server!")
    
    try:
        # Decode the raw base64 picture heavily compressed by the phone
        image_data = base64.b64decode(payload.image_base64)
        image = Image.open(io.BytesIO(image_data)).convert('RGB')
        
        # Apply strict tensor mathematics
        tensor = transform_pipeline(image).unsqueeze(0) # Add batch dimension [1, 3, 224, 224]
        
        # ACTUALLY RUN LIVE PREDICTION!
        with torch.no_grad():
            outputs = model(tensor)
            probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
            
            # Extract the raw confidence score for Class 1 (representing disease risk)
            score = probabilities[1].item() 
            
        # Format the beautiful JSON payload to send back to the mobile screen!
        return {
            "diagnosis": "Suspicious Lesion Detected" if score > 0.5 else "Benign Indicator",
            "confidence_score": round(score, 4),
            "urgency_level": "HIGH" if score > 0.8 else "MEDIUM" if score > 0.5 else "LOW"
        }
        
    except Exception as e:
        print(f"Vision Processing Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process tensor calculations.")
