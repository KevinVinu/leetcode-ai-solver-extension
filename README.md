# LeetCode Solver Pro+ 🚀

An enterprise-grade LeetCode solution generator using FastAPI, Chrome Extension (MV3), and OpenRouter API.

## 📁 System Architecture
- **Backend**: FastAPI (Python) serving a `/solve` endpoint.
- **Frontend**: Chrome Extension (JS/HTML/CSS) for scraping and injection.
- **AI Engine**: OpenRouter (configured with Gemini 2.0 Flash).

---

## 🛠️ Installation & Setup

### 1. Backend Setup (FastAPI)
1. Navigate to the `backend/` folder.
2. Create a `.env` file and add your OpenRouter API Key:
   ```env
   OPENROUTER_API_KEY=your_sk_or_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python main.py
   ```
   *The server will run on `http://localhost:8000`.*

### 2. Frontend Setup (Chrome Extension)
1. Open Google Chrome and go to `chrome://extensions/`.
2. Enable **"Developer mode"** (top right).
3. Click **"Load unpacked"**.
4. Select the `extension/` folder from this project.

---

## 🚀 How to Use
1. Ensure the Python server is running.
2. Go to any LeetCode problem (e.g., [Two Sum](https://leetcode.com/problems/two-sum/)).
3. Click the **LC Solver Pro** icon in your browser toolbar.
4. Select your preferred **Programming Language**.
5. Click **"Solve Problem"**.
6. Wait 2-3 seconds, and watch the solution appear in your editor!

---

## 🔧 Troubleshooting
- **Injection failed**: Click once inside the LeetCode code editor before clicking Solve. This ensures the extension can find the active cursor.
- **Server Error**: Check your terminal running `main.py` for specific API error messages.
- **Model blocked**: OpenRouter might block certain prompts; check your account balance and API key permissions.
