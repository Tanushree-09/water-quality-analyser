from huggingface_hub import InferenceClient

HF_API_KEY = "YOUR_API_KEY"
# model = "mistralai/Mistral-7B-Instruct-v0.3"
model = "HuggingFaceH4/zephyr-7b-beta" 

print(f"Testing HF API with model: {model}")

try:
    client = InferenceClient(model=model, token=HF_API_KEY)
    messages = [{"role": "user", "content": "Why is water quality important?"}]
    response = client.chat_completion(messages, max_tokens=50)
    print("Success!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
