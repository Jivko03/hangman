document.addEventListener("DOMContentLoaded", () => {
    const hangmanImage = document.getElementById("hangmanImage");
    const wordDisplay = document.getElementById("wordDisplay");
    const guessInput = document.getElementById("guessInput");
    const guessButton = document.getElementById("guessButton");
    const attemptsDisplay = document.getElementById("attemptsDisplay");
    const wrongLettersSpan = document.querySelector("#wrongLetters span");
    const languageRadios = document.querySelectorAll('input[name="language"]');
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    const customAttemptsContainer = document.getElementById("customAttemptsContainer");
    const customAttemptsInput = document.getElementById("customAttempts");

    let word = "";
    let hiddenWord = [];
    let attemptsLeft = 6;
    let wrongLetters = new Set();

    function reloadPage() {
        fetchWords();
        updateUI();
    }

    function changeLanguage(language) {
        const texts = {
            eng: {
                title: "Hangman Game",
                selectLanguage: "Select Language:",
                english: "English",
                bulgarian: "Bulgarian",
                selectDifficulty: "Select Difficulty:",
                easy: "Easy (3 letters)",
                medium: "Medium (4 letters)",
                hard: "Hard (5 letters)",
                nightmare: "Nightmare (6 letters)",
                attemptsLeft: "Attempts left:",
                wrongLetters: "Wrong letters:",
                guessButton: "Guess",
                congratulations: "Congratulations! You guessed the word!",
                youLost: "You lost! The word was: "
            },
            bg: {
                title: "Бесеница",
                selectLanguage: "Изберете език:",
                english: "Английски",
                bulgarian: "Български",
                selectDifficulty: "Изберете трудност:",
                easy: "Лесно (3 букви)",
                medium: "Средно (4 букви)",
                hard: "Трудно (5 букви)",
                nightmare: "Кошмар (6 букви)",
                attemptsLeft: "Останали опити:",
                wrongLetters: "Грешни букви:",
                guessButton: "Познай",
                congratulations: "Поздравления! Познахте думата!",
                youLost: "Загубихте! Думата беше: "
            }
        };

        const uiTexts = texts[language];
        document.getElementById("gameTitle").textContent = uiTexts.title;
        document.getElementById("guessButton").textContent = uiTexts.guessButton;
        attemptsDisplay.textContent = uiTexts.attemptsLeft;
        wrongLettersSpan.textContent = uiTexts.wrongLetters;

        window.congratulationsMessage = uiTexts.congratulations;
        window.youLostMessage = uiTexts.youLost;

        document.querySelectorAll("#languageSelector label")[0].childNodes[1].textContent = uiTexts.english;
        document.querySelectorAll("#languageSelector label")[1].childNodes[1].textContent = uiTexts.bulgarian;

        document.querySelectorAll("#difficultySelector label")[0].childNodes[1].textContent = uiTexts.easy;
        document.querySelectorAll("#difficultySelector label")[1].childNodes[1].textContent = uiTexts.medium;
        document.querySelectorAll("#difficultySelector label")[2].childNodes[1].textContent = uiTexts.hard;
        document.querySelectorAll("#difficultySelector label")[3].childNodes[1].textContent = uiTexts.nightmare;
    }

    function updateUI() {
        const savedLanguage = localStorage.getItem("selectedLanguage") || 'eng';  
        const savedDifficulty = localStorage.getItem("selectedDifficulty") || 'easy';  

        document.querySelector(`input[name="language"][value="${savedLanguage}"]`).checked = true;
        document.querySelector(`input[name="difficulty"][value="${savedDifficulty}"]`).checked = true;

        if (savedDifficulty === "nightmare") {
            customAttemptsContainer.style.display = "block";
        } else {
            customAttemptsContainer.style.display = "none";
        }

        changeLanguage(savedLanguage);
    }

    languageRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            localStorage.setItem("selectedLanguage", radio.value);
            reloadPage();
        });
    });

    difficultyRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            localStorage.setItem("selectedDifficulty", radio.value);
            reloadPage();
        });
    });

    async function fetchWords() {
        const language = localStorage.getItem("selectedLanguage") || 'eng';  
        const difficulty = localStorage.getItem("selectedDifficulty") || 'easy';  
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
                hangmanImage.src = `assets/images/${7 - attemptsLeft}.png`;
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
        attemptsDisplay.textContent = `${localStorage.getItem("selectedLanguage") === 'bg' ? "Останали опити:" : "Attempts left:"} ${attemptsLeft}`;
    }

    function updateWrongLetters() {
        wrongLettersSpan.textContent = `${localStorage.getItem("selectedLanguage") === 'bg' ? "Грешни букви:" : "Wrong letters:"} ${Array.from(wrongLetters).join(", ")}`;
    }

    function checkGameEnd() {
        if (!hiddenWord.includes("_")) {
            alert(localStorage.getItem("selectedLanguage") === 'bg' ? "Поздравления! Познахте думата!" : "Congratulations! You guessed the word!");
            fetchWords();
        } else if (attemptsLeft <= 0) {
            alert(`${localStorage.getItem("selectedLanguage") === 'bg' ? "Загубихте! Думата беше:" : "You lost! The word was:"} ${word}`);
            fetchWords();
        }
    }

    function resetGame() {
        attemptsLeft = 6;
        wrongLetters.clear();
        updateWordDisplay();
        updateAttempts();
        updateWrongLetters();
        hangmanImage.src = "assets/images/0.png";
    }

    fetchWords();

    guessButton.addEventListener("click", handleGuess);
    guessInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            handleGuess();
        }
    });

    function updateUI() {
        const savedLanguage = localStorage.getItem("selectedLanguage") || 'eng';  
        const savedDifficulty = localStorage.getItem("selectedDifficulty") || 'easy';  

        document.querySelector(`input[name="language"][value="${savedLanguage}"]`).checked = true;
        document.querySelector(`input[name="difficulty"][value="${savedDifficulty}"]`).checked = true;

        if (savedDifficulty === "nightmare") {
            customAttemptsContainer.style.display = "block";
        } else {
            customAttemptsContainer.style.display = "none";
        }

        changeLanguage(savedLanguage);
    }

    languageRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            localStorage.setItem("selectedLanguage", radio.value);
            reloadPage();
        });
    });

    difficultyRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            localStorage.setItem("selectedDifficulty", radio.value);
            reloadPage();
        });
    });

    fetchWords();
    updateUI();
});
