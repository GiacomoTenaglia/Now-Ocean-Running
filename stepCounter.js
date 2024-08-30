let steps = 0;
let previousAcceleration = null;
let accelerationMagnitudes = [];
const magnitudeThreshold = 1.2; // Base threshold for magnitude
const accelerationWindowSize = 10; // Number of samples to consider for dynamic threshold adjustment
const alpha = 0.8; // Low-pass filter coefficient

function startListeningToMotion() {
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', (event) => {
            let acceleration = event.accelerationIncludingGravity;

            // Apply low-pass filter to smooth data
            acceleration = lowPassFilter(acceleration, previousAcceleration, alpha);

            // Calculate the magnitude of the acceleration vector
            const magnitude = calculateMagnitude(acceleration);

            // Keep a history of the last few magnitudes to calculate dynamic threshold
            accelerationMagnitudes.push(magnitude);
            if (accelerationMagnitudes.length > accelerationWindowSize) {
                accelerationMagnitudes.shift();
            }

            // Calculate dynamic threshold based on standard deviation
            const stdDev = calculateStandardDeviation(accelerationMagnitudes);
            const dynamicThreshold = magnitudeThreshold + stdDev;

            // Step detection based on dynamic threshold
            if (previousAcceleration && magnitude > dynamicThreshold) {
                steps++;
                document.getElementById('stepCount').textContent = steps;
            }

            previousAcceleration = acceleration;
        });

        document.getElementById('statusMessage').textContent = 'Motion sensor active. Start walking to see step count.';
    } else {
        document.getElementById('statusMessage').textContent = 'DeviceMotionEvent is not supported on this device.';
    }
}

// Low-pass filter function
function lowPassFilter(acceleration, previousAcceleration, alpha = 0.8) {
    if (!previousAcceleration) return acceleration;

    return {
        x: alpha * previousAcceleration.x + (1 - alpha) * acceleration.x,
        y: alpha * previousAcceleration.y + (1 - alpha) * acceleration.y,
        z: alpha * previousAcceleration.z + (1 - alpha) * acceleration.z,
    };
}

// Calculate the magnitude of the acceleration vector
function calculateMagnitude(acceleration) {
    return Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
}

// Calculate the standard deviation of an array of numbers
function calculateStandardDeviation(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / values.length);
}

