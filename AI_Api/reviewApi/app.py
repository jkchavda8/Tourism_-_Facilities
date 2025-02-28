from flask import Flask, request, jsonify
from flask_cors import CORS
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import nltk
import ssl

# Fix SSL error for downloading NLTK data
try:
    _create_unverified_https_context = ssl._create_unverified_context
    ssl._create_default_https_context = _create_unverified_https_context
except AttributeError:
    pass

# Ensure VADER lexicon is downloaded
nltk.download("vader_lexicon")

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Initialize Sentiment Intensity Analyzer
sia = SentimentIntensityAnalyzer()

@app.route("/predict", methods=["POST"])
def predict():
    try:
        # print("here")
        data = request.json
        review = data.get("review", "")

        if not review:
            return jsonify({"error": "Review text is missing"}), 400

        sentiment_dict = sia.polarity_scores(review)
        sentiment = (
            "positive"
            if sentiment_dict["compound"] > 0.05
            else "negative"
            if sentiment_dict["compound"] < -0.05
            else "neutral"
        )

        return jsonify({"sentiment": sentiment, "score": sentiment_dict})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)
