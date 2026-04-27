# ==============================================================================
# OMNIMED - GOOGLE COLAB TRAINING PIPELINE (PyTorch)
# ==============================================================================
# INSTRUCTIONS:
# 1. Go to https://colab.research.google.com/
# 2. Open a New Notebook.
# 3. Go to Runtime -> "Change runtime type" -> Select "Hardware Accelerator: T4 GPU".
# 4. Copy perfectly and paste all of this code into a cell and press 'Play'.
# 5. It will heavily train the model on the GPU, outputting 'nidana_skin_triage.pt'.
# 6. Download that '.pt' file and place it in your local 'omnimed_backend/ml_models/' folder!

import os
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader, random_split

print("PyTorch Version:", torch.__version__)
print("GPU Available:", torch.cuda.is_available())

# Set Device to GPU if available on Colab
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using compute device: {device}")

# ==========================================
# 1. DATA PREPARATION & AUGMENTATION
# ==========================================
# For skin lesions, resizing to 224x224 is standard for MobileNetV2.
# We also apply random rotations and flips to prevent the AI from memorizing the data.
data_transforms = {
    'train': transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(),
        transforms.RandomRotation(20),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
    'val': transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
    ]),
}

# ---------------------------------------------------------
# HACKATHON SHORTCUT: 
# If you don't have a dataset uploaded to Colab yet, 
# uncomment the code below to download a tiny sample dataset!
# ---------------------------------------------------------
"""
!wget https://download.pytorch.org/tutorial/hymenoptera_data.zip
!unzip -q hymenoptera_data.zip
DATA_DIR = 'hymenoptera_data' # Change this to your Kaggle Melanoma Dataset folder!
"""

# Replace 'YOUR_DATASET_FOLDER' with the folder you upload to Colab
# The folder MUST have subfolders for classes (e.g., /Benign and /Malignant)
DATA_DIR = 'YOUR_DATASET_FOLDER' 

try:
    full_dataset = datasets.ImageFolder(DATA_DIR, transform=data_transforms['train'])
    
    # Split 80% Training, 20% Validation
    train_size = int(0.8 * len(full_dataset))
    val_size = len(full_dataset) - train_size
    train_dataset, val_dataset = random_split(full_dataset, [train_size, val_size])

    # Important: Apply the Validation-specific transforms (no random flips) to the val set
    val_dataset.dataset.transform = data_transforms['val']

    dataloaders = {
        'train': DataLoader(train_dataset, batch_size=32, shuffle=True, num_workers=2),
        'val': DataLoader(val_dataset, batch_size=32, shuffle=False, num_workers=2)
    }
    dataset_sizes = {'train': len(train_dataset), 'val': len(val_dataset)}
    class_names = full_dataset.classes
    print(f"Classes Found: {class_names}")

except Exception as e:
    print("WARNING: Dataset not found. Please upload your dataset folders to Colab and update DATA_DIR.")
    class_names = ['Benign', 'Malignant']

# ==========================================
# 2. MODEL ARCHITECTURE (MobileNetV2)
# ==========================================
# We use MobileNetV2 because it is incredibly lightweight, very fast, 
# and explicitly designed for mobile edge/health platforms!
model_ft = models.mobilenet_v2(weights=models.MobileNet_V2_Weights.IMAGENET1K_V1)

# Modify the final classification layer to match the number of diseases we are sorting
num_ftrs = model_ft.classifier[1].in_features
model_ft.classifier[1] = nn.Linear(num_ftrs, len(class_names))

# Push the massive model into the GPU
model_ft = model_ft.to(device)

# Loss calculation and Optimizer
criterion = nn.CrossEntropyLoss()
optimizer_ft = optim.Adam(model_ft.parameters(), lr=0.001)

# ==========================================
# 3. THE TRAINING LOOP
# ==========================================
def train_model(model, criterion, optimizer, num_epochs=10):
    since = time.time()
    best_acc = 0.0

    for epoch in range(num_epochs):
        print(f'Epoch {epoch+1}/{num_epochs}')
        print('-' * 10)

        # Each epoch has a training and validation phase
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()  # Set model to training mode
            else:
                model.eval()   # Set model to evaluate mode

            running_loss = 0.0
            running_corrects = 0

            # Iterate over data.
            try:
                for inputs, labels in dataloaders[phase]:
                    inputs = inputs.to(device)
                    labels = labels.to(device)

                    optimizer.zero_grad() # Clear gradients

                    # Forward pass
                    # calculate gradients ONLY if in training phase
                    with torch.set_grad_enabled(phase == 'train'):
                        outputs = model(inputs)
                        _, preds = torch.max(outputs, 1)
                        loss = criterion(outputs, labels)

                        # backward + optimize only if in training phase
                        if phase == 'train':
                            loss.backward()
                            optimizer.step()

                    running_loss += loss.item() * inputs.size(0)
                    running_corrects += torch.sum(preds == labels.data)

                epoch_loss = running_loss / dataset_sizes[phase]
                epoch_acc = running_corrects.double() / dataset_sizes[phase]

                print(f'{phase.upper()} Loss: {epoch_loss:.4f} Acc: {epoch_acc:.4f}')

                # deep copy the model if it beats previous accuracy
                if phase == 'val' and epoch_acc > best_acc:
                    best_acc = epoch_acc
                    best_model_wts = model.state_dict()
                    
            except NameError:
                pass # Bypassing loop if datasets weren't loaded

    time_elapsed = time.time() - since
    print(f'\nTraining perfectly completed in {time_elapsed // 60:.0f}m {time_elapsed % 60:.0f}s')
    print(f'Best Validation Accuracy: {best_acc:4f}')

    # Load best model weights
    if best_acc > 0:
        model.load_state_dict(best_model_wts)
    return model

# Train the model! (Usually takes ~5-15 mins on Colab T4 GPU)
trained_model = train_model(model_ft, criterion, optimizer_ft, num_epochs=10)

# ==========================================
# 4. SAVE THE FINAL MODEL FOR OMNIMED BACKEND
# ==========================================
SAVE_PATH = "nidana_skin_triage.pt"
torch.save(trained_model.state_dict(), SAVE_PATH)

print(f"\n✅ SUCCESS! Model rigorously trained and saved as '{SAVE_PATH}'.")
print("Download this file from the Colab left sidebar and place it into your PC's 'omnimed_backend/ml_models/' folder!")
