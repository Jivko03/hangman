const wordListUrls = {
    eng: 'db/words_eng.json',
    bg: 'db/words_bg.json'
};

let selectedLanguage = 'eng';
let selectedDifficulty = 'easy';
let selectedWord = '';
let guessedLetters = [];
let remainingAttempts = 7;
let currentImageIndex = 0;
let winImage = '../assets/images/win.png';

document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language');
    const difficultySelector = document.getElementById('difficulty');
    const guessButton = document.getElementById('guessButton');

    languageSelector.addEventListener('change', handleLanguageChange);
    difficultySelector.addEventListener('change', handleDifficultyChange);
    guessButton.addEventListener('click', handleGuess);

    fetchWords();
});

function handleLanguageChange(event) {
    selectedLanguage = event.target.value;
    resetGame();
}

function handleDifficultyChange(event) {
    selectedDifficulty = event.target.value;
    resetGame();
}

function fetchWords() {
    const wordListUrl = wordListUrls[selectedLanguage];
    fetch(wordListUrl)
        .then(response => response.json())
        .then(data => {
            selectedWord = selectWord(data);
            displayWord();
        })
        .catch(error => console.error('Error fetching words:', error));
}

function selectWord(words) {
    const wordLengths = {
        easy: 3,
        medium: 4,
        high: 5,
        nightmare: 6
    };
    const filteredWords = words.filter(word => word.length === wordLengths[selectedDifficulty]);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function displayWord() {
    const display = document.getElementById('wordDisplay');
    display.textContent = selectedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
}

function handleGuess() {
    const guessInput = document.getElementById('guessInput');
    const guess = guessInput.value.toLowerCase();
    guessInput.value = '';

    if (guess === selectedWord) {
        alert('Победи!');
        winImage.display;
        resetGame();
        return;
    }

    if (guess.length === 1 && selectedWord.includes(guess)) {
        guessedLetters.push(guess);
        displayWord();
    } else {
        remainingAttempts--;
        currentImageIndex++;
        updateHangmanImage();
        updateAttempts();
    }

    checkGameOver();
}

function updateHangmanImage() {
    const hangmanImage = document.getElementById('hangmanImage');
    hangmanImage.src = `assets/images/${currentImageIndex}.png`;
}

function updateAttempts() {
    const attemptsDisplay = document.getElementById('attemptsDisplay');
    attemptsDisplay.textContent = `Опити: ${remainingAttempts}`;
}

function checkGameOver() {
    if (remainingAttempts <= 0) {
        alert(`Край на играта! Думата беше: ${selectedWord}`);
        resetGame();
    } else if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
        alert('Позна!');
        winImage.display;
        resetGame();
    }
}

function resetGame() {
    guessedLetters = [];
    remainingAttempts = 7;
    currentImageIndex = 0;
    updateHangmanImage();
    updateAttempts();
    fetchWords();
}