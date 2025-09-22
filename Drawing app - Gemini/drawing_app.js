const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');
const receivedDrawingContainer = document.getElementById('receivedDrawingContainer');

// Drawing state
let isDrawing = false;
const brushWidth = 5;
let hue = 0; // For rainbow color 🌈
let recordedStrokes = []; // Stores objects with {x, y, color, timestampOffset}
let lastTimestamp = 0;

// --- Canvas Setup ---
ctx.lineWidth = brushWidth;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// --- Rainbow Color Function ---
function getRainbowColor() {
    hue = (hue + 1) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

// Store previous coordinates to draw a tiny segment
let lastX = 0;
let lastY = 0;

// --- Modified Drawing Functions ---
function startDrawing(e) {
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoords(e);
    
    // Store the initial position for the first tiny segment
    lastX = offsetX;
    lastY = offsetY;
    
    // Start of a new stroke for recording purposes
    lastTimestamp = performance.now();
    recordedStrokes.push({
        type: 'start',
        x: offsetX,
        y: offsetY,
        timestampOffset: 0
    });
}

function draw(e) {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getEventCoords(e);
    
    // Set a new rainbow color for this tiny line segment
    ctx.strokeStyle = getRainbowColor();
    
    // Create a new path for this single segment
    ctx.beginPath();
    ctx.moveTo(lastX, lastY); // Move from the last point...
    ctx.lineTo(offsetX, offsetY); // ...to the current point
    ctx.stroke();
    
    // Update the last position for the next segment
    lastX = offsetX;
    lastY = offsetY;

    // Record the drawing point
    const currentTimestamp = performance.now();
    recordedStrokes.push({
        type: 'draw',
        x: offsetX,
        y: offsetY,
        color: ctx.strokeStyle, // Store the new color with each point
        timestampOffset: currentTimestamp - lastTimestamp
    });
    lastTimestamp = currentTimestamp;
}

function stopDrawing() {
    isDrawing = false;
    // No need to ctx.closePath() here because we are drawing many small lines
    recordedStrokes.push({ type: 'end', timestampOffset: 0 });
}

function getEventCoords(e) {
    if (e.touches && e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: e.touches[0].clientX - rect.left,
            offsetY: e.touches[0].clientY - rect.top
        };
    } else {
        return {
            offsetX: e.offsetX,
            offsetY: e.offsetY
        };
    }
}

// --- Event Listeners and Button Handlers (No changes here) ---
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recordedStrokes = [];
    statusMessage.textContent = 'Canvas cleared!';
});

sendButton.addEventListener('click', () => {
    if (recordedStrokes.length === 0) {
        statusMessage.textContent = 'Draw something before sending!';
        return;
    }
    statusMessage.textContent = 'Sending drawing...';
    
    const drawingData = {
        width: canvas.width,
        height: canvas.height,
        strokes: recordedStrokes,
        senderId: 'userA',
        recipientId: 'userB'
    };

    console.log("Simulating send:", drawingData);
    
    setTimeout(() => {
        statusMessage.textContent = 'Drawing sent! Simulating reception.';
        displayReceivedDrawing(drawingData);
    }, 1000);

    recordedStrokes = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// --- Replay Drawing Function (No change is needed here, as it was already handling separate points) ---
async function replayDrawing(drawingData, targetCanvas) {
    const replayCtx = targetCanvas.getContext('2d');
    replayCtx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);
    replayCtx.lineWidth = brushWidth;
    replayCtx.lineCap = 'round';
    replayCtx.lineJoin = 'round';

    let lastReplayX = 0;
    let lastReplayY = 0;

    for (let i = 0; i < drawingData.strokes.length; i++) {
        const stroke = drawingData.strokes[i];
        
        if (stroke.timestampOffset > 0) {
            await new Promise(resolve => setTimeout(resolve, stroke.timestampOffset));
        }

        switch (stroke.type) {
            case 'start':
                lastReplayX = stroke.x;
                lastReplayY = stroke.y;
                break;
            case 'draw':
                replayCtx.strokeStyle = stroke.color;
                replayCtx.beginPath();
                replayCtx.moveTo(lastReplayX, lastReplayY);
                replayCtx.lineTo(stroke.x, stroke.y);
                replayCtx.stroke();
                
                lastReplayX = stroke.x;
                lastReplayY = stroke.y;
                break;
            case 'end':
                break;
        }
    }
}

// --- Display and Manage Received Drawings (No changes here) ---
function displayReceivedDrawing(drawingData) {
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

    const DEMO_DISAPPEAR_MS = 10 * 1000; 

    setTimeout(() => {
        receivedDrawingContainer.innerHTML = '<p>The drawing has disappeared!</p>';
        console.log('Drawing disappeared after 2 hours (or demo time).');
    }, DEMO_DISAPPEAR_MS);
}

statusMessage.textContent = 'Start drawing your rainbow masterpiece!';