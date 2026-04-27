***

## Firestore Integration Plan

Here's what I found in your project — currently you're using **SQLite** (a local file `omnimedlocal.db`) via SQLAlchemy in your Python backend. Firestore will **replace this** so your data lives in the cloud and is accessible from any device.[^1]

Your project has **two backends** that both use SQLite:[^1]

1. `omnimedbackend/database.py`
2. `Setu-Drishti/setudrishtibackend/database.py`

We'll integrate Firestore into **both**, one at a time.

***

## Step 1 — Set Up Firebase Project (No Code Yet!)

Before touching any code, you need to create a Firebase project. This is purely clicking in a browser.

### Do this now:

1. Go to **[https://console.firebase.google.com](https://console.firebase.google.com)**
2. Click **"Add project"**
3. Name it something like `omnimed-setu` → click Continue
4. Disable Google Analytics (not needed) → click **"Create project"**
5. Once created, in the left sidebar click **"Firestore Database"**
6. Click **"Create database"**
7. Choose **"Start in test mode"** (we'll add security rules later)
8. Pick a region closest to you — choose `asia-south1` (Mumbai) since you're in Dehradun
9. Click **Done**

✅ Your Firestore database is now live.

***

### Then get your Service Account Key (for the Python backend):

1. In Firebase Console → click the ⚙️ **gear icon** → **Project Settings**
2. Go to the **"Service accounts"** tab
3. Click **"Generate new private key"** → **"Generate Key"**
4. A `.json` file will download — **keep this safe, do not share it publicly**
5. Rename this file to `firebase-credentials.json`
6. Place it inside **both** backend folders:
    - `omnimed_backend/firebase-credentials.json`
    - `setu_drishti_backend/firebase-credentials.json`

***

***

## Step 2 — Install Firebase SDK in Your Python Backends

You need to install the `firebase-admin` Python package in both your backend folders.

### Open your terminal and run these commands:

**First, for the OmniMed backend:**

```bash
cd omnimedbackend
pip install firebase-admin
```

**Then, for the Setu-Drishti backend:**

```bash
cd ../Setu-Drishti/setudrishtibackend
pip install firebase-admin
```

> 💡 If you use a **virtual environment** (like `venv` or `conda`), make sure it's activated before running these commands. If you're not sure what this means, just run the commands as-is and it will work fine.

***

### Verify it installed correctly:

After installing, run this in your terminal:

```bash
python -c "import firebase_admin; print('Firebase SDK ready!')"
```

You should see:

```
Firebase SDK ready!
```


***
