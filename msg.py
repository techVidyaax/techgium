from flask import Flask, jsonify, Response
import random
import time
from flask_cors import CORS

# Initialize Flask app and enable CORS
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# List of random directions for simulation
directions = ["North", "South", "East", "West"]

# Function to simulate random message detection with time and distance
def generate_messages():
    detected_ranges = {}  # Dictionary to store detected ranges
    
    while True:
        # Simulate random distance and direction
        distance = random.randint(1, 400)  # Random distance between 1 and 400 mm
        direction = random.choice(directions)  # Random direction
        
        if 0 < distance <= 400:
            # Bucketize the distance into ranges of 50mm
            distance_bucket = (distance // 50) * 50
            key = (direction, distance_bucket)

            # Only send new messages if the (direction, distance_bucket) pair has not been detected yet
            if key not in detected_ranges:
                detected_ranges[key] = True  # Mark this range as detected
                current_time = time.strftime('%Y-%m-%d %H:%M:%S')  # Get current time
                message = f"Object Detected at {direction}, Distance: {distance}mm, Time: {current_time}"
                yield f"data: {message}\n\n"  # Send the message to the client as an SSE

        time.sleep(0.1)  # Short delay to simulate continuous updates

@app.route("/events")
def stream():
    return Response(generate_messages(), content_type="text/event-stream")

@app.route("/status", methods=["GET"])
def get_status():
    # For quick testing, returning the current status (could be used to debug)
    distance = random.randint(1, 400)
    direction = random.choice(directions)
    current_time = time.strftime('%Y-%m-%d %H:%M:%S')
    message = f"Alert: Object detected at {direction}, Distance: {distance}mm, Time: {current_time}"
    return jsonify({"message": message})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
