


# from flask import Flask, jsonify, send_from_directory
# from flask_cors import CORS

# app = Flask(__name__, static_folder="../frontend", static_url_path="/")
# CORS(app)

# # Serve frontend
# @app.route("/")
# def serve_frontend():
#     return send_from_directory("../frontend", "index.html")

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000, debug=True)









from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import requests
import os

# Get the absolute path to the frontend directory
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))

app = Flask(__name__, static_folder=frontend_path, static_url_path="/")
CORS(app, resources={r"/*": {"origins": "*"}})

# Proxy route to fetch text from detect.py
@app.route("/get_text")
def proxy_get_text():
    try:
        response = requests.get('http://127.0.0.1:5001/get_text')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Serve frontend
@app.route("/")
def serve_frontend():
    return send_from_directory(frontend_path, "index.html")

# Proxy route for video feed
@app.route("/video_feed")
def proxy_video_feed():
    try:
        response = requests.get('http://127.0.0.1:5001/video_feed', stream=True)
        return response.raw
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)