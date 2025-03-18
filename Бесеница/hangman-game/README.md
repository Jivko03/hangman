# Hangman Game

## Overview
This project is a simple Hangman game that allows users to guess letters in a hidden word. The game supports both English and Bulgarian words, which are sourced from an external JSON file.

## Project Structure
```
hangman-game
├── assets
│   ├── css
│   │   └── main.css
│   ├── js
│   │   └── main.js
├── src
│   ├── main.html
│   └── db
│       └── words.json
├── package.json
├── README.md
```

## Files Description
- **assets/css/main.css**: Contains styles for the Hangman game application, defining layout, colors, fonts, and other visual elements.
- **assets/js/main.js**: Contains the JavaScript logic for the Hangman game, handling user interactions, managing game state, and updating the UI.
- **src/main.html**: The main HTML structure of the application, including a dropdown menu for difficulty levels and an input field for user guesses.
- **src/db/words.json**: An array of words ranging from 3 to 6 letters in both English and Bulgarian, serving as the source of words for the game.
- **package.json**: Configuration file for npm, listing dependencies, scripts, and metadata for the project.
- **README.md**: Documentation for the project, including setup instructions and additional information.

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies using npm:
   ```
   npm install
   ```
4. Start a local server to serve the HTML file and access the JSON file. You can use a simple server like `http-server` or any other local server setup.
5. Open your browser and navigate to `http://localhost:PORT/src/main.html` to play the game.

## Additional Information
- Ensure that CORS is configured properly if you are accessing the JSON file from a cloud source.
- The game is designed to be simple and user-friendly, making it suitable for all ages. Enjoy playing Hangman!