let steps = 0;
let previousZ = null;
const threshold = 12; // Example threshold value, adjust as needed

function startStepCounter() {
    document.getElementById('statusMessage').textContent = 'Requesting motion sensor access...';

    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    document.getElementById('statusMessage').textContent = 'Access granted! Start walking.';
                    startListeningToMotion();
                } else {
                    document.getElementById('statusMessage').textContent = 'Permission to access motion sensors denied.';
                }
            })
            .catch(error => {
                console.error(error);
                document.getElementById('statusMessage').textContent = 'Error requesting motion sensor access.';
            });
    } else {
        startListeningToMotion();
    }
}

function startListeningToMotion() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;

            if (acceleration && previousZ !== null) {
                const deltaZ = Math.abs(acceleration.z - previousZ);

                if (deltaZ > threshold) {
                    steps++;
                    document.getElementById('stepCount').textContent = steps;
                }
            }

            previousZ = acceleration ? acceleration.z : null;
        });

        document.getElementById('statusMessage').textContent = 'Motion sensor active. Start walking to see step count.';
    } else {
        document.getElementById('statusMessage').textContent = 'DeviceMotionEvent is not supported on this device.';
    }
}
