import google.generativeai as genai
import os

GENAI_API_KEY = "YOUR_API_KEY"
genai.configure(api_key=GENAI_API_KEY)

try:
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error listing models: {e}")
