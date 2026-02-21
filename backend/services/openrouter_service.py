import httpx
import re
from config import settings

class OpenRouterService:
    @staticmethod
    async def get_solution(title: str, description: str, language: str) -> str:
        prompt = f"""
        Solve this LeetCode problem.
        
        Programming Language: {language}
        Problem Title: {title}
        
        Problem Description:
        {description}
        
        Requirements:
        1. Return ONLY the source code.
        2. DO NOT include any explanations, comments, or markdown formatting (no backticks).
        3. Follow the standard LeetCode function signature.
        4. Optimize for both time and space complexity.
        5. Just provide the code that can be directly pasted into an IDE.
        """

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:8000",
            "X-Title": "LeetCode Solver Pro",
            "Content-Type": "application/json"
        }

        payload = {
            "model": settings.DEFAULT_MODEL,
            "messages": [
                {"role": "system", "content": "You are an expert competitive programmer. You provide clean, optimized code solutions without any extra text."},
                {"role": "user", "content": prompt}
            ]
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                settings.OPENROUTER_URL,
                headers=headers,
                json=payload,
                timeout=45.0
            )
            
            if response.status_code != 200:
                raise Exception(f"OpenRouter API Error: {response.text}")

            data = response.json()
            raw_solution = data['choices'][0]['message']['content']
            
            return OpenRouterService.clean_code(raw_solution)

    @staticmethod
    def clean_code(code: str) -> str:
        # Remove markdown code blocks if present
        code = re.sub(r'```(?:\w+)?\n', '', code)
        code = code.replace('```', '')
        
        # Remove leading/trailing whitespace
        return code.strip()
