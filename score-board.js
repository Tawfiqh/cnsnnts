// Scoring list
let scoredWords = [];

// Scoring list functions
function updateScoredWordsList() {
    const listContainer = document.getElementById('scoredWordsList');
    listContainer.innerHTML = '';
    
    if (scoredWords.length === 0) {
        return;
    }
    
    // Sort scored words by score descending
    const sortedWords = [...scoredWords].sort((a, b) => b.score - a.score);
    
    sortedWords.forEach(item => {
        const wordItem = document.createElement('div');
        wordItem.className = 'scored-word-item';
        wordItem.textContent = `${item.word}: ${item.score}`;
        listContainer.appendChild(wordItem);
    });
}

function saveWord(word) {
    if (!word || word.trim() === '') return;
    
    const score = scoreWord(word);
    scoredWords.push({
        word: word ,
        score: score
    });
    updateScoredWordsList();
}

// Word input Enter key listener
document.getElementById('wordInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const word = this.value.trim();
        if (word) {
            saveWord(word);
            this.value = '';
            document.getElementById('score').textContent = 'Score: 0';
            clearHighlights(); // Clear highlights when word is saved
        }
    }
});

// Reset button
document.getElementById('resetButton').addEventListener('click', function() {
    stopTimer();
    scoredWords = [];
    updateScoredWordsList();
    generateBoard();
    document.getElementById('wordInput').value = '';
    document.getElementById('score').textContent = 'Score: 0';
    hideBellOverlay();
});

