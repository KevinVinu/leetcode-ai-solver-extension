from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import solve
import uvicorn

app = FastAPI(title="LeetCode Solver API", version="1.0.0")

# Enable CORS for the Chrome Extension
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to specific extension IDs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(solve.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "LeetCode Solver Backend is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
