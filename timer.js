// Timer variables
let timerInterval = null;
let timeRemaining = 30;
let isTimerRunning = false;

// Timer functions
function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    timeRemaining = 30;
    document.getElementById('startTimer').disabled = true;
    document.getElementById('timerDisplay').textContent = timeRemaining;
    
    timerInterval = setInterval(() => {
        timeRemaining--;
        document.getElementById('timerDisplay').textContent = timeRemaining;
        
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            isTimerRunning = false;
            showBellOverlay();
        }
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    isTimerRunning = false;
    timeRemaining = 30;
    document.getElementById('timerDisplay').textContent = timeRemaining;
    document.getElementById('startTimer').disabled = false;
}

function showBellOverlay() {
    const overlay = document.getElementById('bellOverlay');
    overlay.classList.add('show', 'jiggle');
}

function hideBellOverlay() {
    const overlay = document.getElementById('bellOverlay');
    overlay.classList.remove('show', 'jiggle');
}

// Timer event listener
document.getElementById('startTimer').addEventListener('click', startTimer);

