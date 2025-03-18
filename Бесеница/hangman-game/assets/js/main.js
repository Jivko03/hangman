// This file contains the JavaScript logic for the Hangman game. 
// It handles user interactions, manages the game state, implements the logic for selecting words from the external JSON file, and updates the UI based on user input.

const wordListUrl = '../db/words.json';
let selectedWord = '';
let guessedLetters = [];
let remainingAttempts = 6;

document.addEventListener('DOMContentLoaded', () => {
    fetchWords();
    document.getElementById('guessInput').addEventListener('input', handleGuess);
});

function fetchWords() {
    fetch(wordListUrl)
        .then(response => response.json())
        .then(data => {
            const difficulty = document.getElementById('difficulty').value;
            selectedWord = selectWord(data, difficulty);
            displayWord();
        })
        .catch(error => console.error('Error fetching words:', error));
}

function selectWord(words, difficulty) {
    const filteredWords = words.filter(word => word.length >= 3 && word.length <= 6);
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function displayWord() {
    const display = document.getElementById('wordDisplay');
    display.innerHTML = selectedWord.split('').map(letter => (guessedLetters.includes(letter) ? letter : '_')).join(' ');
}

function handleGuess(event) {
    const guess = event.target.value.toLowerCase();
    if (guess && !guessedLetters.includes(guess) && selectedWord.includes(guess)) {
        guessedLetters.push(guess);
        displayWord();
    } else if (guess && !guessedLetters.includes(guess)) {
        guessedLetters.push(guess);
        remainingAttempts--;
        updateAttempts();
    }
    event.target.value = '';
    checkGameOver();
}

function updateAttempts() {
    const attemptsDisplay = document.getElementById('attemptsDisplay');
    attemptsDisplay.textContent = `Remaining Attempts: ${remainingAttempts}`;
}

function checkGameOver() {
    if (remainingAttempts <= 0) {
        alert('Game Over! The word was: ' + selectedWord);
        resetGame();
    } else if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
        alert('Congratulations! You guessed the word: ' + selectedWord);
        resetGame();
    }
}

function resetGame() {
    guessedLetters = [];
    remainingAttempts = 6;
    fetchWords();
}