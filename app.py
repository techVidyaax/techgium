import cv2
import torch
import os
import time
from ultralytics import YOLO
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)
static_folder = 'static/output'
# Create output directory if not exists
OUTPUT_FOLDER = "output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Load YOLO models
stone_model = YOLO(r"C:\Users\POORNA\Desktop\techgium_dataset\yolov8\best.pt")
object_model = torch.hub.load('ultralytics/yolov5', 'yolov5s')

# Image paths
image_paths = [
    "static/output/dog.jpg",
    "static/output/stone1.webp",
    "static/output/cat1.jpg"
]

detections = []

def detect_and_save():
    global detections
    detections = []

    for image_path in image_paths:
        frame = cv2.imread(image_path)
        if frame is None:
            print(f"Error: Could not load image {image_path}")
            continue

        # Run detection
        stone_results = stone_model.predict(source=frame, conf=0.5)
        object_results = object_model(frame)

        # Draw bounding boxes (stones - blue, objects - green)
        for box in stone_results[0].boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)

        for *xyxy, conf, cls in object_results.xyxy[0]:
            x1, y1, x2, y2 = map(int, xyxy)
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)

        # Save the detected image
        filename = os.path.basename(image_path)
        output_path = os.path.join(OUTPUT_FOLDER, filename)
        cv2.imwrite(output_path, frame)

        # Store detection metadata
        detections.append({
            "id": str(len(detections) + 1),
            "timestamp": time.strftime("%H:%M %p"),
            "imageUrl": f"/output/{filename}",
            "severity": "high" if len(stone_results[0].boxes) > 0 else "low",
            "description": "Detected objects in image."
        })

# Run detection when script starts
detect_and_save()

# API to serve detection results
@app.route('/detections', methods=['GET'])
def get_detections():
    return jsonify(detections)

# API to serve images
@app.route('/output/<filename>')
def get_image(filename):
    return send_from_directory(OUTPUT_FOLDER, filename)

if __name__ == "__main__":
    app.run(debug=True, port=5000)  # Change port to 5001
