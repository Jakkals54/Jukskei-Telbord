// ==========================================================================
// CORE VARIABLES & INITIALIZATION
// ==========================================================================

const NUM_SCORE_SLOTS = 23;
const PIN_BOX_COUNT = 10;

// Initialize the timer state
let timeRemainingSeconds = 0;
let countdownInterval = null;
let currentGameDuration = 0;


// ==========================================================================
// 1. UI POPULATORS (Runs once on load)
// ==========================================================================

function initializeUI() {
    // A. Populate the 23 Score Slots (Central Grid)
    const scoreGrid = document.getElementById('score-grid');
    for (let i = 1; i <= NUM_SCORE_SLOTS; i++) {
        const slot = document.createElement('div');
        slot.className = 'score-slot-display';
        slot.id = `score-slot-${i}`;
        slot.textContent = i;
        scoreGrid.appendChild(slot);
    }

    // B. Populate Radio Buttons and Pin Boxes (Local & Visitor)
    ['local', 'visitor'].forEach(team => {
        // --- Radio Buttons (Score) ---
        const scoreSlotsDiv = document.querySelector(`.team-side.${team} .score-slots`);
        let html = `<p>Score (1-23):</p>`;
        for (let i = 1; i <= NUM_SCORE_SLOTS; i++) {
            html += `
                <label>
                    <input type="radio" name="${team}Score${i}" value="${i}" required> 
                    ${i}
                </label><br>
            `;
        }
        scoreSlotsDiv.innerHTML = html;
        
        // --- Pin Checkboxes ---
        const pinGrid = document.querySelector(`.team-side.${team} .pin-grid`);
        let pinHTML = '';
        for (let i = 1; i <= PIN_BOX_COUNT; i++) {
            pinHTML += `
                <div class="pin-checkbox">
                    <input type="checkbox" id="${team}-pin-${i}" class="pin-checkbox">
                    <label for="${team}-pin-${i}">${i}</label>
                </div>
            `;
        }
        // Append the pins to the appropriate location
        if (team === 'local') {
            document.getElementById('local-pins').innerHTML = pinHTML;
        } else {
            document.getElementById('visitor-pins').innerHTML = pinHTML;
        }
    });

    // C. Attach Event Listeners (The functional buttons)
    setupButtonListeners();
}

// ==========================================================================
// 2. CORE GAME FUNCTIONS
// ==========================================================================

function startTimer() {
    const dropdown = document.getElementById('cboSpelTyd'); // Assuming the dropdown ID is 'cboSpelTyd'
    const selectedValue = dropdown.value; 

    if (!selectedValue || isNaN(parseInt(selectedValue))) {
        alert("Please select a valid game duration.");
        return;
    }

    const minutes = parseInt(selectedValue);
    timeRemainingSeconds = minutes * 60;
    currentGameDuration = minutes;
    
    // Reset the display
    document.getElementById('countdown-display').textContent = formatTime(timeRemainingSeconds);
    document.getElementById('start-btn').disabled = true;
    document.getElementById('cancel-btn').disabled = false;

    // Start the countdown
    countdownInterval = setInterval(updateTimer, 1000); 
}

function updateTimer() {
    timeRemainingSeconds--;
    
    // Update display
    document.getElementById('countdown-display').textContent = formatTime(timeRemainingSeconds);

    // Alarm Check: 5-Minute Warning (300 seconds)
    if (timeRemainingSeconds === 300 && timeRemainingSeconds > 0) {
        alert("⚠️ 5 MINUTE WARNING! Time is running low!");
    }

    // Check for end
    if (timeRemainingSeconds <= 0) {
        clearInterval(countdownInterval);
        alert("🔔 TIME'S UP! The game has ended.");
        // Reset state after time runs out
        resetGame();
    }
}


function resetGame() {
    // Reset all state elements
    document.getElementById('countdown-display').textContent = '---';
    document.getElementById('start-btn').disabled = false;
    document.getElementById('cancel-btn').disabled = true;
    timeRemainingSeconds = 0;
}


function clearAllScores() {
    // Logic to uncheck all pins and uncheck all radios
    document.querySelectorAll('.pin-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    
    // Clear the visual score board (you might want to reset this to zero values)
    document.getElementById('score-grid').innerHTML = '';
    for (let i = 1; i <= 23; i++) {
        const slot = document.createElement('div');
        slot.className = 'score-slot-display';
        slot.textContent = i;
        document.getElementById('score-grid').appendChild(slot);
    }
}

// ==========================================================================
// 3. EVENT LISTENERS & UTILITIES
// ==========================================================================

function setupButtonListeners() {
    // Start Button
    document.getElementById('start-btn').addEventListener('click', startTimer);

    // Cancel Button
    document.getElementById('cancel-btn').addEventListener('click', () => {
        clearInterval(countdownInterval);
        resetGame();
    });

    // Clear All Button
    document.getElementById('clear-all-btn').addEventListener('click', clearAllScores);

    // Dynamic Pin Action Button Listeners (Uses event delegation for efficiency)
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', handlePinClick);
    });
}

function handlePinClick(event) {
    const team = event.currentTarget.dataset.team;
    const pinNumber = event.currentTarget.dataset.pin;
    
    // Logic for handling pin boxes: Check if the box is already ticked
    const pinCheckboxId = `${team}-pin-${pinNumber}`;
    const checkbox = document.getElementById(pinCheckboxId);
    
    // Toggle the box
    checkbox.checked = !checkbox.checked;
    
    console.log(`${team} pinned ${pinNumber}`);
    // Future: Add logic here to update the score calculation visually
}


// UTILITY FUNCTION
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Run the initialization when the script loads
document.addEventListener('DOMContentLoaded', initializeUI);

