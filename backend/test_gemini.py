import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

try:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents="Hello"
    )
    print("SUCCESS")
    print(response.text)
except Exception as e:
    print(f"ERROR: {e}")
