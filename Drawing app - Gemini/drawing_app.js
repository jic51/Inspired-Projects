const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearButton');
const sendButton = document.getElementById('sendButton');
const statusMessage = document.getElementById('statusMessage');
const receivedDrawingContainer = document.getElementById('receivedDrawingContainer');

// Drawing state
let isDrawing = false;
const brushWidth = 5;
let hue = 0;
let recordedStrokes = [];
let lastTimestamp = 0;

let lastX = 0;
let lastY = 0;

// Replay state
let isReplaying = false;
let replayTimeout;

// --- Canvas Setup ---
ctx.lineWidth = brushWidth;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// --- Rainbow Color Function ---
function getRainbowColor() {
    hue = (hue + 1) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

// --- Modified Drawing Functions ---
function startDrawing(e) {
    // NEW: Stop any ongoing replay if the user starts to draw
    if (isReplaying) {
        stopReplay();
    }
    isDrawing = true;
    const { offsetX, offsetY } = getEventCoords(e);
    
    // Do NOT clear the canvas here. The drawing can have multiple strokes now.
    
    lastX = offsetX;
    lastY = offsetY;
    
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
    
    ctx.strokeStyle = getRainbowColor();
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
    
    lastX = offsetX;
    lastY = offsetY;

    const currentTimestamp = performance.now();
    recordedStrokes.push({
        type: 'draw',
        x: offsetX,
        y: offsetY,
        color: ctx.strokeStyle,
        timestampOffset: currentTimestamp - lastTimestamp
    });
    lastTimestamp = currentTimestamp;
}

function stopDrawing() {
    isDrawing = false;
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

// --- New Replay-related functions ---

function stopReplay() {
    isReplaying = false;
    clearTimeout(replayTimeout);
    // NEW: Clear canvas and strokes here, as requested
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    recordedStrokes = [];
    statusMessage.textContent = 'Replay stopped. Draw a new masterpiece!';
}

async function replayDrawing(drawingData) {
    if (isReplaying) {
        stopReplay();
    }
    
    isReplaying = true;
    
    // The canvas is already cleared by the send button, so no need to clear here.
    
    let lastReplayX = 0;
    let lastReplayY = 0;

    for (let i = 0; i < drawingData.strokes.length && isReplaying; i++) {
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
                ctx.strokeStyle = stroke.color;
                ctx.beginPath();
                ctx.moveTo(lastReplayX, lastReplayY);
                ctx.lineTo(stroke.x, stroke.y);
                ctx.stroke();
                
                lastReplayX = stroke.x;
                lastReplayY = stroke.y;
                break;
            case 'end':
                break;
        }
    }
    
    if (isReplaying) {
        replayTimeout = setTimeout(() => {
            replayDrawing(drawingData);
        }, 500);
    }
}

// --- Event Listeners and Button Handlers ---
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing); 

canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchcancel', stopDrawing);

canvas.addEventListener('mousedown', stopReplay);
canvas.addEventListener('touchstart', stopReplay);

clearButton.addEventListener('click', () => {
    stopReplay();
    statusMessage.textContent = 'Canvas cleared! Start drawing a new masterpiece!';
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
        statusMessage.textContent = 'Drawing sent! Replaying your art...';
        // NEW: Clear the canvas just before the replay starts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        replayDrawing(drawingData);
    }, 1000);
});

// --- Display and Manage Received Drawings (No changes here) ---
function displayReceivedDrawing(drawingData) {
    stopReplay();
    
    receivedDrawingContainer.innerHTML = ''; 

    const receivedCanvas = document.createElement('canvas');
    receivedCanvas.id = 'receivedDrawingCanvas';
    receivedCanvas.width = drawingData.width;
    receivedCanvas.height = drawingData.height;
    receivedDrawingContainer.appendChild(receivedCanvas);

    const receivedMessage = document.createElement('p');
    receivedMessage.textContent = `New drawing received from ${drawingData.senderId}! Disappearing in 2 hours.`;
    receivedDrawingContainer.appendChild(receivedMessage);
    
    let lastReplayX = 0;
    let lastReplayY = 0;
    
    const DEMO_DISAPPEAR_MS = 10 * 1000; 

    async function replayForRecipient() {
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
                receivedCanvas.getContext('2d').strokeStyle = stroke.color;
                receivedCanvas.getContext('2d').beginPath();
                receivedCanvas.getContext('2d').moveTo(lastReplayX, lastReplayY);
                receivedCanvas.getContext('2d').lineTo(stroke.x, stroke.y);
                receivedCanvas.getContext('2d').stroke();
                
                lastReplayX = stroke.x;
                lastReplayY = stroke.y;
                break;
            case 'end':
                break;
        }
      }
    }
    
    replayForRecipient();

    setTimeout(() => {
        receivedDrawingContainer.innerHTML = '<p>The drawing has disappeared!</p>';
        console.log('Drawing disappeared after 2 hours (or demo time).');
    }, DEMO_DISAPPEAR_MS);
}

statusMessage.textContent = 'Start drawing your rainbow masterpiece!';