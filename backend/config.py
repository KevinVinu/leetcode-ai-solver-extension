import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    DEFAULT_MODEL: str = "ENTER YOUR API KEY" # Production-ready model
    OPENROUTER_URL: str = "https://openrouter.ai/api/v1/chat/completions"

settings = Settings()
