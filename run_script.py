import subprocess
import time

# Start msg.py
msg_process = subprocess.Popen(["python", "msg.py"])
time.sleep(2)  # Give some time for msg.py to start

# Start app.py on a different port
app_process = subprocess.Popen(["python", "app.py"])

# Wait for both to finish
msg_process.wait()
app_process.wait()
