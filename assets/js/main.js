document.addEventListener("DOMContentLoaded", () => {
    const hangmanImage = document.getElementById("hangmanImage");
    const wordDisplay = document.getElementById("wordDisplay");
    const guessInput = document.getElementById("guessInput");
    const guessButton = document.getElementById("guessButton");
    const attemptsDisplay = document.getElementById("attemptsDisplay");
    const wrongLettersSpan = document.querySelector("#wrongLetters span");
    const languageSelector = document.getElementById("language");
    const difficultySelector = document.getElementById("difficulty");

    let word = "";
    let hiddenWord = [];
    let attemptsLeft = 7; // Updated from 6 to 7
    let wrongLetters = new Set();

    async function fetchWords() {
        const language = languageSelector.value;
        const difficulty = difficultySelector.value;
        const filePath = `db/words_${language}.json`;

        try {
            const response = await fetch(filePath);
            const words = await response.json();
            const filteredWords = words.filter(w => w.length === getWordLength(difficulty));
            word = filteredWords[Math.floor(Math.random() * filteredWords.length)].toUpperCase();
            hiddenWord = Array(word.length).fill("_");
            resetGame();
        } catch (error) {
            console.error("Error loading words:", error);
        }
    }

    function getWordLength(difficulty) {
        const lengths = { easy: 3, medium: 4, hard: 5, nightmare: 6 };
        return lengths[difficulty] || 3;
    }

    function updateWordDisplay() {
        wordDisplay.textContent = hiddenWord.join(" ");
    }

    function handleGuess() {
        const guess = guessInput.value.toUpperCase().trim();
        if (!guess) return;

        if (guess.length === 1) {
            if (word.includes(guess)) {
                for (let i = 0; i < word.length; i++) {
                    if (word[i] === guess) {
                        hiddenWord[i] = guess;
                    }
                }
            } else {
                wrongLetters.add(guess);
                attemptsLeft--;
                hangmanImage.src = `assets/images/${7 - attemptsLeft}.png`; // Adjusted for 7 attempts
            }
        } else if (guess.length === word.length) {
            if (guess === word) {
                hiddenWord = word.split("");
            } else {
                attemptsLeft = 0;
            }
        }

        guessInput.value = "";
        updateWordDisplay();
        updateAttempts();
        updateWrongLetters();
        checkGameEnd();
    }

    function updateAttempts() {
        attemptsDisplay.textContent = `Брой опити: ${attemptsLeft}`;
    }

    function updateWrongLetters() {
        wrongLettersSpan.textContent = Array.from(wrongLetters).join(", ");
    }

    function checkGameEnd() {
        if (!hiddenWord.includes("_")) {
            alert("Поздравления! Позна думата!");
            fetchWords(); // Reset game
        } else if (attemptsLeft <= 0) {
            alert(`Загуби! Думата беше: ${word}`);
            fetchWords(); // Reset game
        }
    }

    function resetGame() {
        attemptsLeft = 7; // Reset attempts
        wrongLetters.clear();
        updateWordDisplay();
        updateAttempts();
        updateWrongLetters();
        hangmanImage.src = "assets/images/0.png"; // Reset to first image
    }

    guessButton.addEventListener("click", handleGuess);
    guessInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            handleGuess();
        }
    });

    languageSelector.addEventListener("change", fetchWords);
    difficultySelector.addEventListener("change", fetchWords);

    fetchWords();
});
