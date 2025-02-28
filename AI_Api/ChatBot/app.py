import os
import google.generativeai as genai
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure Gemini API
GEMINI_API_KEY = ""
genai.configure(api_key=GEMINI_API_KEY)

# Load Gemini 2.0 model
model = genai.GenerativeModel("gemini-2.0-flash")  

# Function to get AI response from Gemini 2.0 API
def get_ai_response(query):
    try:
        response = model.generate_content(f""" 
            You are place intelligence and you can only provide information about places.
            If any other query comes, respond with "I only provide information about Places." And make sure response should be large. It should be midium.
            Answer this place-related question:{query}
""")
        if response and response.candidates:
            return response.candidates[0].content.parts[0].text
    except Exception as e:
        return f"Error fetching AI response: {str(e)}"

# Chatbot API route
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_input = data.get("message")

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    # Get AI response from Gemini API
    ai_response = get_ai_response(user_input)
    
    return jsonify({"response": ai_response})

# Run Flask app
if __name__ == "__main__":
    app.run(port=5002,debug=True)
