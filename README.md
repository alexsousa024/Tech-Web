# Jogo da Trilha
# Overview
Jogo da Trilha is a web-based game inspired by the traditional board game "Nine Men's Morris." This project features an interactive user interface, multiplayer options, AI integration, and a leaderboard system. Players aim to strategically align pieces on the board to form "mills" and remove their opponent's pieces.

# Features
Multiplayer Mode

Play against another player online or locally.
Join ongoing games using unique game IDs.
AI Opponent

Three difficulty levels: Easy, Medium, Hard.
# Game Phases

Placement Phase: Place pieces on the board to form mills.
Movement Phase: Move pieces strategically to form new mills.
Capture Phase: Remove opponent pieces after forming a mill.
# Leaderboard

Displays top players based on victories and games played.
Responsive UI

Supports dynamic resizing and responsive design for various screen sizes.
# User Authentication

Secure login and registration for players.
# Project Structure


/index.html         # Main HTML file for the game
/style.css          # Styling for the game UI
/index.js           # Main server logic
/Game.js            # Core game logic and player classes
/game_logic.js      # Advanced game mechanics and rules
/comunication.js    # Client-server communication logic
/homepage.js        # UI navigation and interaction logic
# Installation and Setup
Prerequisites
Node.js (for backend server)
Modern browser (Chrome, Firefox, Edge)

# Install dependencies:

npm install
Start the server:


node index.js
Open the game in your browser:

http://localhost:8103/

# How to Play
Login/Register

Enter your nickname and password to log in or register.
Game Configuration

Choose board size (3x3, 4x4, etc.).
Select game mode: vs Computer or Multiplayer.
Set AI difficulty level if playing vs Computer.
Gameplay

Form mills: Align three pieces to capture an opponent's piece.
Reduce your opponent's pieces to less than three or block their moves to win.
Leaderboard

View the top players based on their performance.
