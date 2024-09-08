let stepCount = 0;
let isCounting = false;

// Check if the device supports Accelerometer
if ('Accelerometer' in window) {
    let accelerometer = new Accelerometer({ frequency: 10 });

    // Event listener for accelerometer readings
    accelerometer.addEventListener('reading', e => {
        if (isCounting) {
            if (detectStep(accelerometer.x, accelerometer.y, accelerometer.z)) {
                stepCount++;
                document.getElementById("stepCount").innerText = stepCount;
            }
        }
    });
    accelerometer.start();
} else {
    alert("Accelerometer not supported by your device.");
}

// Function to start and stop the step counter
function startStepCounter() {
    isCounting = !isCounting;
    if (isCounting) {
        document.getElementById('startStopBtn').innerHTML = '&#10074;&#10074;'; // Pause icon
    } else {
        document.getElementById('startStopBtn').innerHTML = '&#9654;'; // Play icon
        sendStepsToServer(stepCount);
    }
}

// Function to detect a step based on acceleration
function detectStep(x, y, z) {
    const threshold = 12; // You may need to adjust this threshold for better accuracy
    let totalAcceleration = Math.sqrt(x * x + y * y + z * z);
    return totalAcceleration > threshold;
}

// Function to send step count to the server
function sendStepsToServer(steps) {
    fetch('/save_steps', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ steps: steps })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Steps successfully saved:", data.steps);
        } else {
            console.error("Error saving steps:", data.error);
        }
    })
    .catch(error => {
        console.error("Request failed:", error);
    });
}
