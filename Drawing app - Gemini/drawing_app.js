const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');
const receivedDrawingContainer = document.getElementById('receivedDrawingContainer');

// Drawing state
let isDrawing = false;
const brushWidth = 5; // Fixed brush width
let hue = 0; // For rainbow color
let recordedStrokes = []; // Stores objects with {x, y, color, timestampOffset}
let lastTimestamp = 0;

// --- Canvas Setup ---
ctx.lineWidth = brushWidth;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// --- Rainbow Color Function ---
function getRainbowColor() {
    hue = (hue + 1) % 360; // Cycle through hues 0-359
    return `hsl(${hue}, 100%, 50%)`; // Full saturation, 50% lightness
}

// --- Drawing Functions ---
function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoords(e);
    ctx.strokeStyle = getRainbowColor();
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
    
    // Record the start of a new stroke
    lastTimestamp = performance.now();
    recordedStrokes.push({
        type: 'start',
        x: offsetX,
        y: offsetY,
        color: ctx.strokeStyle,
        timestampOffset: 0 // Start of a new stroke has 0 offset
    });
}

function draw(e) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getEventCoords(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    // Record the drawing point
    const currentTimestamp = performance.now();
    recordedStrokes.push({
        type: 'draw',
        x: offsetX,
        y: offsetY,
        color: ctx.strokeStyle, // Store color with each point for consistency during replay
        timestampOffset: currentTimestamp - lastTimestamp // Time since last point
    });
    lastTimestamp = currentTimestamp;
}

function stopDrawing() {
    isDrawing = false;
    ctx.closePath();
    // Mark end of stroke
    recordedStrokes.push({ type: 'end', timestampOffset: 0 }); 
}

function getEventCoords(e) {
    if (e.touches && e.touches.length > 0) {
        // Handle touch events
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    } else {
        // Handle mouse events
        return {
            offsetX: e.offsetX,
            offsetY: e.offsetY
        };
    }
}

// --- Event Listeners for Drawing ---
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); // Stop drawing if mouse leaves canvas

// Touch events for mobile
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

// --- Control Buttons ---
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recordedStrokes = []; // Clear recorded strokes too
    statusMessage.textContent = 'Canvas cleared!';
});

sendButton.addEventListener('click', () => {
    if (recordedStrokes.length === 0) {
        statusMessage.textContent = 'Draw something before sending!';
        return;
    }
    statusMessage.textContent = 'Sending drawing...';
    
    // In a real app, this data would be sent to a server
    const drawingData = {
        width: canvas.width,
        height: canvas.height,
        strokes: recordedStrokes,
        senderId: 'userA', // Placeholder for actual user ID
        recipientId: 'userB' // Placeholder for actual recipient ID
    };

    // --- MOCK SERVER SEND ---
    // Simulate sending to a server and then receiving it back for replay
    console.log("Simulating send:", drawingData);
    // After sending, you might clear the canvas or give feedback
    
    // Simulate receiving it on another user's device (or locally for testing)
    // This part would typically be handled by a WebSocket or push notification
    setTimeout(() => {
        statusMessage.textContent = 'Drawing sent! Simulating reception.';
        displayReceivedDrawing(drawingData);
    }, 1000); // Simulate network delay
    // --- END MOCK SERVER SEND ---

    recordedStrokes = []; // Clear local strokes after sending
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// --- Replay Drawing Function ---
async function replayDrawing(drawingData, targetCanvas) {
    const replayCtx = targetCanvas.getContext('2d');
    replayCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    replayCtx.lineWidth = brushWidth;
    replayCtx.lineCap = 'round';
    replayCtx.lineJoin = 'round';

    for (let i = 0; i < drawingData.strokes.length; i++) {
        const stroke = drawingData.strokes[i];
        
        // Wait for the recorded time offset
        if (stroke.timestampOffset > 0) {
            await new Promise(resolve => setTimeout(resolve, stroke.timestampOffset));
        }

        switch (stroke.type) {
            case 'start':
                replayCtx.strokeStyle = stroke.color;
                replayCtx.beginPath();
                replayCtx.moveTo(stroke.x, stroke.y);
                break;
            case 'draw':
                replayCtx.strokeStyle = stroke.color; // Ensure color consistency
                replayCtx.lineTo(stroke.x, stroke.y);
                replayCtx.stroke();
                break;
            case 'end':
                replayCtx.closePath();
                break;
        }
    }
}

// --- Display and Manage Received Drawings ---
function displayReceivedDrawing(drawingData) {
    // Clear previous received drawings to simplify the demo
    receivedDrawingContainer.innerHTML = ''; 

    const receivedCanvas = document.createElement('canvas');
    receivedCanvas.id = 'receivedDrawingCanvas';
    receivedCanvas.width = drawingData.width;
    receivedCanvas.height = drawingData.height;
    receivedDrawingContainer.appendChild(receivedCanvas);

    const receivedMessage = document.createElement('p');
    receivedMessage.textContent = `New drawing received from ${drawingData.senderId}! Disappearing in 2 hours.`;
    receivedDrawingContainer.appendChild(receivedMessage);

    replayDrawing(drawingData, receivedCanvas);

    // Set the self-destruction timer
    const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
    // For demo purposes, let's make it disappear in 10 seconds
    const DEMO_DISAPPEAR_MS = 10 * 1000; 

    setTimeout(() => {
        receivedDrawingContainer.innerHTML = '<p>The drawing has disappeared!</p>';
        console.log('Drawing disappeared after 2 hours (or demo time).');
    }, DEMO_DISAPPEAR_MS); // Use DEMO_DISAPPEAR_MS for testing, TWO_HOURS_MS for production
}

// Initialize status
statusMessage.textContent = 'Start drawing your rainbow masterpiece!';