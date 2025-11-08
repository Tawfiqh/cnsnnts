// Letter constants
const consonants = 'BCDFGHJKLMNPQRSTVWXYZ';
const uncommonLetters = ['F', 'V', 'W'];
const veryUncommonLetters = ['Q', 'X'];
const columnScores = [5, 4, 3, 2];
let currentBoard = [];
let letterElements = []; // Store references to letter div elements for highlighting

// Weighted letter distribution - common letters appear 3x more frequently
const commonConsonants = 'BCDFGHKLMNPRST'; // Common consonants
const rareConsonants = 'QXJZVWY'; // Rare consonants (already very uncommon)

function getWeightedRandomLetter() {
    // Create weighted array: common letters appear 3x more frequently
    const weightedLetters = [];
    
    // Add common letters 3 times
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < commonConsonants.length; j++) {
            weightedLetters.push(commonConsonants[j]);
        }
    }
    
    // Add rare letters 1 time
    for (let i = 0; i < rareConsonants.length; i++) {
        weightedLetters.push(rareConsonants[i]);
    }
    
    // Pick random letter from weighted array
    return weightedLetters[Math.floor(Math.random() * weightedLetters.length)];
}

function generateBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';
    currentBoard = [];
    letterElements = []; // Reset letter element references
    let letterCounts = {};
    let uncommonCount = 0;
    
    // Pick 8 letters using weighted distribution
    while (currentBoard.length < 8) {
        const letter = getWeightedRandomLetter();
        
        // Check if we've already used this letter twice
        if (letterCounts[letter] && letterCounts[letter] >= 2) {
            continue;
        }
        
        // Check if it's an uncommon or very uncommon letter
        const isUncommon = uncommonLetters.includes(letter) || veryUncommonLetters.includes(letter);
        
        // If it's uncommon, check if we've already got two uncommon letters
        if (isUncommon && uncommonCount >= 2) {
            continue;
        }
        
        // Add the letter to the board
        currentBoard.push(letter);
        
        // Update our counter for each letter and each uncommon letters
        letterCounts[letter] = (letterCounts[letter] || 0) + 1;
        if (isUncommon) uncommonCount++;
        
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter';
        letterDiv.textContent = letter;
        
        // Store reference to letter element for highlighting
        letterElements.push({
            letter: letter,
            element: letterDiv
        });
        
        // Add styling for uncommonLetters                
        if (uncommonLetters.includes(letter)) {
            letterDiv.classList.add('uncommon');
            const bonusSpan = document.createElement('span');
            bonusSpan.className = 'bonus';
            bonusSpan.textContent = '+1';
            letterDiv.appendChild(bonusSpan);
        }                
        // Add styling for veryUncommonLetters !!
        else if (veryUncommonLetters.includes(letter)) {
            letterDiv.classList.add('very-uncommon');
            const bonusSpan = document.createElement('span');
            bonusSpan.className = 'bonus';
            bonusSpan.textContent = '+2';
            letterDiv.appendChild(bonusSpan);
        }
        
        board.appendChild(letterDiv);
    }
}

function copyScoreBoard(lettersBoard){
    scoreBoard = []
    
    for (i = 0; i < lettersBoard.length; i++) {
        let letterScore = columnScores[i % 4]
        const letter = lettersBoard[i]
        
        if (uncommonLetters.includes(letter)) {
            letterScore += 1;
        } else if (veryUncommonLetters.includes(letter)) {
            letterScore += 2;
        }
        
        scoreBoard.push( [letter,letterScore] )
    }
    
    scoreBoard.sort((a,b) => b[1] - a[1] )
    return scoreBoard
}

function scoreWord(word) {
    totalScore = 0;
    
    let scoreBoard = copyScoreBoard(currentBoard)
    console.log("original ScoreBoard:", scoreBoard.map(a=>a[0]))
    
    word = word.toUpperCase()
    
    for (let i = 0; i < word.length; i++) {
        const letter = word[i].toUpperCase();
        const scoredLetter = scoreBoard.find( a => {
            return a[0] == letter
        })
        
        console.log("letter found!:", scoredLetter)
        
        if (scoredLetter != null) {
            totalScore = totalScore + scoredLetter[1]
            console.log("Scoring", scoredLetter[1], " current total is:",totalScore)
            
            const index = scoreBoard.indexOf(scoredLetter);
            scoreBoard.splice(index, 1);
            console.log(scoreBoard.map(a=>a[0]))
        }
    }
    
    return totalScore;
}

// Clear all letter highlights
function clearHighlights() {
    letterElements.forEach(item => {
        item.element.classList.remove('used');
    });
}

// Highlight letters used in the input word (matching scoring logic)
function highlightUsedLetters(word) {
    // Clear all previous highlights
    clearHighlights();
    
    if (!word || word.trim() === '') {
        return;
    }
    
    // Create a copy of available letters (matching scoring logic)
    let availableLetters = [];
    letterElements.forEach(item => {
        availableLetters.push({
            letter: item.letter,
            element: item.element
        });
    });
    
    word = word.toUpperCase();
    
    // For each letter in the word, find and highlight a matching letter from the board
    for (let i = 0; i < word.length; i++) {
        const letter = word[i].toUpperCase();
        const matchedIndex = availableLetters.findIndex(item => item.letter === letter);
        
        if (matchedIndex !== -1) {
            // Highlight the matched letter
            availableLetters[matchedIndex].element.classList.add('used');
            // Remove it from available letters (so duplicates work correctly)
            availableLetters.splice(matchedIndex, 1);
        }
    }
}

// Word input event listeners
document.getElementById('wordInput').addEventListener('input', function() {
    const word = this.value;
    const score = scoreWord(word);
    console.log("Scored word as:", score)
    document.getElementById('score').textContent = `Score: ${score}`;
    highlightUsedLetters(word); // Highlight letters used in the word
});

// Viewport scaling functions
// https://stackoverflow.com/questions/52467896/transform-scale-using-viewport-units
function setVwScale(){
    //const range = 1 / 400;
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    var scaleValue;
    var scaleFactor;
    var orientation = width > height ? "landscape" : "portrait";
    var scalingDimension;
    
    if (width >= 900) { // Side by side layout when > 900px wide
        if (orientation == "portrait") { // narrow screen = stacked layout
            // Taller screen (portrait) - scale based on width as that is the limiting factor
            scaleFactor = 1 / 750;
            scalingDimension = width;
            scalingDimensionName = "width";

        } else { // landscape scaling = height scaling
            // Taller screen (portrait) - scale based on height as that is the limiting factor
            scaleFactor = 1 / 650;
            scalingDimension = height;
            scalingDimensionName = "height";
        }
        scaleValue = 1.3;

    }
    else{ //Column view when < 900px wide ✅
         if (orientation == "portrait") { // narrow screen = stacked layout
            // Taller screen (portrait) - scale based on width as that is the limiting factor
            scaleFactor = 1 / 400;
            scalingDimension = width;
            scalingDimensionName = "width";
        } else { // landscape scaling = height scaling
            // Taller screen (portrait) - scale based on height as that is the limiting factor
            scaleFactor = 1 / 400;
            scalingDimension = height;
            scalingDimensionName = "height";
        }
        scaleValue = scaleFactor * scalingDimension;

    }
    
    // Enhanced debug logging
    console.log("\n\n=== VW Scale Debug ===");
    console.log("Window dimensions:", { width, height });
    console.log("Orientation:", orientation, "scaling based on", scalingDimensionName);
    console.log("Scale factor:", scaleFactor, `(1/${1/scaleFactor})`);
    console.log("Calculation:", `${scaleFactor} × ${scalingDimension} = ${scaleValue}`);
    console.log("Final scaleValue:", scaleValue);
    console.log("========================");
    
    document.documentElement.style.setProperty('--vw-scale', scaleValue);
}
setVwScale()

window.addEventListener('resize', setVwScale);

// Initialize board
generateBoard();

