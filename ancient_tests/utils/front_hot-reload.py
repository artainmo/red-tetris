import os
import time

directory = "../../src/client"

# Store the initial file modification times
initial_times = {}
for root, dirs, files in os.walk(directory):
    for filename in files:
        path = os.path.join(root, filename)
        initial_times[path] = os.path.getmtime(path)

# Continuously check for changes
while True:
    time.sleep(1)  # Wait for 1 second before checking again
    for root, dirs, files in os.walk(directory):
        for filename in files:
            path = os.path.join(root, filename)
            modified_time = os.path.getmtime(path)
            if modified_time != initial_times.get(path):
                print(f"{path} has been modified!")
                os.system('cd ..; make refresh_front')
                initial_times[path] = modified_time
