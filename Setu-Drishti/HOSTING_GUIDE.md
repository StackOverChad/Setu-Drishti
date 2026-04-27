# Hosting Guide: Setu-Drishti 2.0 × OmniMed

Since this is a Hackathon project, "hosting" it can mean a few different things depending on your goal (e.g., demoing locally on your own devices vs. deploying it publicly for judges to visit). I have outlined the three best approaches below.

---

## Method 1: Docker Compose (Best for VPS or Cloud VMs)
I have just generated a `docker-compose.yml` and the necessary Dockerfiles for your backend and frontend. This allows you to spin up the entire application stack with a single command. 

This is the best method if you are deploying to an AWS EC2, DigitalOcean Droplet, or simply want to run it reliably on your local machine.

**Steps:**
1. Ensure you have Docker and Docker Compose installed.
2. From the `Setu-Drishti` root directory, run:
   ```bash
   docker-compose up --build
   ```
3. This will launch:
   * **Backend:** `http://localhost:8000`
   * **Simulator:** Running in the background pushing data to the backend.
   * **Frontend:** `http://localhost:5173`

---

## Method 2: Local Wi-Fi Hosting (Fastest for Live Presentations)
If you just want your team or the judges to access the dashboard and mobile app using their own devices while on the same Wi-Fi network, you do not need to deploy it to the cloud.

**Steps:**
1. Find your machine's local IP address (e.g., `192.168.1.15`). You can find this by running `ipconfig` on Windows.
2. **Backend:** Change your run command to explicitly use your IP:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```
3. **Frontend:** Change your run command to expose it to the network:
   ```bash
   npm run dev -- --host 0.0.0.0
   ```
4. Update the `.env` or API base URL in your frontend and mobile app to point to `http://192.168.1.15:8000` instead of `localhost`.
5. Anyone on the same Wi-Fi can now visit `http://192.168.1.15:5173`.

---

## Method 3: Cloud Deployment (Vercel + Render)
If you want the project to be permanently hosted on the internet with public URLs (e.g., `https://setu-drishti.vercel.app`), follow this architecture:

### 1. The Backend & Simulator (Deploy to Render / Railway)
Since you need the `simulator.py` running in tandem with `main.py` and the XGBoost model requires memory, Render or Railway is ideal.
* **Platform:** Render.com (Web Service)
* **Build Command:** `pip install -r requirements.txt`
* **Start Command:** Since you need both, use a shell script or the Dockerfile provided to launch both the FastAPI server and the Simulator.
* **Env Vars:** Make sure to set `GEMINI_API_KEY`, `TWILIO_ACCOUNT_SID`, etc.

### 2. The Frontend (Deploy to Vercel)
Vite + React apps deploy seamlessly to Vercel.
* **Platform:** Vercel.com
* Link your GitHub repository.
* Vercel will auto-detect it as a Vite project.
* Change the API calls in your frontend to point to the new Render backend URL instead of `localhost:8000`.

### 3. The Mobile App (Deploy to Expo)
For the mobile component, simply publish it to Expo.
* Navigate to `SetuDrishtiApp`
* Run `npx expo publish` or use Expo Application Services (EAS) to build APKs/AABs.
* Ensure you update the API base URL in the mobile app to the public Render URL before publishing.

---
*Tip: If you only need it online temporarily for a presentation, use **Ngrok** or **Cloudflare Tunnels** to tunnel your `localhost:5173` and `localhost:8000` to public URLs instantly!*
