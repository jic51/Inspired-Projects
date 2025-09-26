const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const sendButton = document.getElementById('sendButton');
const undoButton = document.getElementById('undoButton');
const saveButton = document.getElementById('saveButton');
const statusMessage = document.getElementById('statusMessage');
const receivedDrawingContainer = document.getElementById('receivedDrawingContainer');

// Drawing state
let isDrawing = false;
let hasSentDrawing = false;
const brushWidth = 10; // <--- CHANGE THE VALUE HERE (e.g., from 4 to 10)
let hue = 0;
let recordedStrokes = [];
let lastTimestamp = 0;
let currentStrokeId = 0;

let lastX = 0;
let lastY = 0;

// Replay state
let isReplaying = false;
let replayTimeout;

// --- Canvas Setup ---
function resizeCanvas() {
    const rect = canvas.parentNode.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    // Set line width *after* resize to maintain consistency
    ctx.lineWidth = brushWidth; // <--- THIS LINE IS CRUCIAL AND WAS MISSING
    // Redraw existing content after resize to prevent it from clearing
    if (recordedStrokes.length > 0) {
        redrawCanvas();
    }
}
window.addEventListener('load', resizeCanvas);
window.addEventListener('resize', resizeCanvas);

ctx.lineWidth = brushWidth; // <--- AND THIS LINE IS NEEDED FOR INITIAL SETUP
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// --- Rainbow Color Function ---
function getRainbowColor() {
    hue = (hue + 1) % 360;
    return `hsl(${hue}, 100%, 50%)`;
}

// --- Drawing Functions ---
function startDrawing(e) {
    e.preventDefault();

    if (e.button !== 0 && !e.touches) {
        return;
    }

    if (isReplaying) {
        stopReplay();
        return;
    }

    // New workflow: clear canvas on touch after a drawing has been sent
    if (hasSentDrawing) {
        clearCanvas();
        return;
    }

    isDrawing = true;
    currentStrokeId++;
    const { offsetX, offsetY } = getEventCoords(e);

    lastX = offsetX;
    lastY = offsetY;

    lastTimestamp = performance.now();
    recordedStrokes.push({
        type: 'start',
        x: offsetX,
        y: offsetY,
        timestampOffset: 0,
        strokeId: currentStrokeId
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
        timestampOffset: currentTimestamp - lastTimestamp,
        strokeId: currentStrokeId
    });
    lastTimestamp = currentTimestamp;
}

function stopDrawing() {
    isDrawing = false;
    recordedStrokes.push({ type: 'end', timestampOffset: 0, strokeId: currentStrokeId });
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

// --- Replay and Control Functions ---

function stopReplay() {
    isReplaying = false;
    clearTimeout(replayTimeout);
    redrawCanvas();
    statusMessage.textContent = 'Replay stopped. Draw a new masterpiece!';
    sendButton.disabled = false;
}

async function replayDrawing(drawingData) {
    isReplaying = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lastReplayX = 0;
    let lastReplayY = 0;

    for (let i = 0; i < drawingData.strokes.length && isReplaying; i++) {
        const stroke = drawingData.strokes[i];

        if (stroke.timestampOffset > 0) {
            await new Promise(resolve => setTimeout(resolve, stroke.timestampOffset));
        }

        // Check `isReplaying` immediately after the await
        if (!isReplaying) {
            return;
        }

        switch (stroke.type) {
            case 'start':
                lastReplayX = stroke.x;
                lastReplayY = stroke.y;
                break;
            case 'draw':
                ctx.strokeStyle = stroke.color;
                // Use beginPath and moveTo for each segment for correct coloring
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
        // This is a simplified replay loop.
        replayTimeout = setTimeout(() => {
            replayDrawing(drawingData);
        }, 500);
    }
}

// Undo function
function undoStroke() {
    if (isReplaying || recordedStrokes.length === 0) return;

    const lastStrokeId = recordedStrokes[recordedStrokes.length - 1].strokeId;
    recordedStrokes = recordedStrokes.filter(stroke => stroke.strokeId !== lastStrokeId);

    redrawCanvas();
    statusMessage.textContent = 'Last stroke undone.';
}

// Save function
function saveDrawing() {
    if (recordedStrokes.length === 0) {
        statusMessage.textContent = 'Draw something to save!';
        return;
    }
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'rainbow_drawing.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    statusMessage.textContent = 'Drawing saved!';
}

// Redraw all recorded strokes
function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let lastRedrawX = 0;
    let lastRedrawY = 0;

    // Reset line width before redrawing
    ctx.lineWidth = brushWidth;

    recordedStrokes.forEach(stroke => {
        switch (stroke.type) {
            case 'start':
                lastRedrawX = stroke.x;
                lastRedrawY = stroke.y;
                break;
            case 'draw':
                ctx.strokeStyle = stroke.color;
                ctx.beginPath();
                ctx.moveTo(lastRedrawX, lastRedrawY);
                ctx.lineTo(stroke.x, stroke.y);
                ctx.stroke();

                lastRedrawX = stroke.x;
                lastRedrawY = stroke.y;
                break;
        }
    });
}

// Clear canvas function
function clearCanvas() {
    stopReplay();
    recordedStrokes = [];
    hasSentDrawing = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    statusMessage.textContent = 'Canvas cleared! Start drawing a new masterpiece!';
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

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

undoButton.addEventListener('click', undoStroke);
saveButton.addEventListener('click', saveDrawing);

sendButton.addEventListener('click', () => {
    if (recordedStrokes.length === 0) {
        statusMessage.textContent = 'Draw something before sending!';
        return;
    }
    statusMessage.textContent = 'Sending drawing...';
    sendButton.disabled = true;

    const drawingData = {
        width: canvas.width,
        height: canvas.height,
        strokes: recordedStrokes,
        senderId: 'userA',
        recipientId: 'userB'
    };

    console.log("Simulating send:", drawingData);

    setTimeout(() => {
        statusMessage.textContent = 'Drawing sent! Replaying your art... Tap the canvas to clear it.';
        hasSentDrawing = true;
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

// Initial status message
statusMessage.textContent = 'Start drawing your rainbow masterpiece!';
