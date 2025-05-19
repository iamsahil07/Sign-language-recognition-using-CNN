








# import cv2
# import torch
# from ultralytics import YOLO
# import numpy as np
# from flask import Flask, Response, jsonify

# # Load YOLOv11 model properly
# model = YOLO(r'C:\Users\SahilPandey\Desktop\pirosign2\backend\best.pt')

# # Flask app setup
# app = Flask(__name__)

# # Open webcam
# camera = cv2.VideoCapture(0)
# detected_text = ""  # Stores the latest detected letter

# # Function to capture video and detect ASL letters
# def generate_frames():
#     global detected_text
#     while True:
#         success, frame = camera.read()
#         if not success:
#             break

#         # Run YOLOv11 inference
#         results = model(frame)

#         # Process detection results
#         for result in results:
#             for box in result.boxes:
#                 x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
#                 conf = box.conf[0].item()  # Confidence score
#                 cls = int(box.cls[0].item())  # Class index

#                 if conf > 0.5:  # Confidence threshold
#                     letter = model.names[cls]  # Get detected letter
#                     detected_text = letter  # Store latest detected letter
                    
#                     # Draw bounding box and letter
#                     cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
#                     cv2.putText(frame, letter, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

#         # Encode frame as JPEG
#         _, buffer = cv2.imencode('.jpg', frame)
#         frame_bytes = buffer.tobytes()

#         yield (b'--frame\r\n'
#                b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# # API Route to stream video
# @app.route('/video_feed')
# def video_feed():
#     return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# # API Route to get detected letter
# @app.route('/get_text')
# def get_text():
#     global detected_text
#     return jsonify({"detected_text": detected_text})

# # Run Flask app
# if __name__ == "__main__":
#     app.run(debug=True, port=5001)





























import cv2
import torch
from ultralytics import YOLO
import numpy as np
from flask import Flask, Response, jsonify
from flask_cors import CORS
from collections import Counter

# Load YOLOv11 model
model = YOLO(r'/Users/sahil/Downloads/pirosign2/backend/best.pt')

# Flask app setup
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Open webcam
camera = cv2.VideoCapture(0)

# Letter detection stabilization
letter_buffer = []
detected_text = ""

# Function to capture video and detect ASL letters
def generate_frames():
    global detected_text, letter_buffer
    while True:
        success, frame = camera.read()
        if not success:
            break
        
        # Run YOLOv11 inference
        results = model(frame)
        
        # Process detection results
        current_letters = []
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])  # Bounding box coordinates
                conf = box.conf[0].item()  # Confidence score
                cls = int(box.cls[0].item())  # Class index
                
                if conf > 0.5:  # Confidence threshold
                    letter = model.names[cls]  # Get detected letter
                    current_letters.append(letter)
                    
                    # Draw bounding box and letter
                    cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
                    cv2.putText(frame, letter, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Stabilize letter detection
        if current_letters:
            letter_buffer.extend(current_letters)
            
            # Keep only last 10 detections
            letter_buffer = letter_buffer[-10:]
            
            # Get most common letter
            if letter_buffer:
                most_common = Counter(letter_buffer).most_common(1)[0][0]
                detected_text = most_common
        
        # Encode frame as JPEG
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

# API Route to stream video
@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# API Route to get detected letter
@app.route('/get_text')
def get_text():
    global detected_text
    return jsonify({"detected_text": detected_text})

# Run Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001, debug=True)