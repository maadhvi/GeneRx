import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.environ.get("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"

data = {
    "contents": [{"parts": [{"text": "Hello"}]}]
}

try:
    response = requests.post(url, json=data)
    print("STATUS:", response.status_code)
    print(response.json())
except Exception as e:
    print("ERROR:", e)
