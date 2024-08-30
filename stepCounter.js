let steps = 0;
let previousZ = null;
const threshold = 12; // Example threshold value, adjust as needed

function startStepCounter() {
    // Check if DeviceMotionEvent is supported
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;

            // Basic step detection algorithm based on changes in Z-axis acceleration
            if (acceleration && previousZ !== null) {
                const deltaZ = Math.abs(acceleration.z - previousZ);

                if (deltaZ > threshold) {
                    steps++;
                    document.getElementById('stepCount').textContent = steps;
                }
            }

            previousZ = acceleration ? acceleration.z : null;
        });
    } else {
        alert('DeviceMotionEvent is not supported on this device.');
    }
}
