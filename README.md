# Hundred Chart Chase

A fun, interactive multiplayer game where players race to find patterns on a 100-chart!

## Game Rules

**Goal:** Record three numbers in a row (horizontal, vertical, or diagonal) in your designated color to score points. The player with the highest score when the board is full wins!

**How to Play:**
1.  **Setup**: Enter the number of players (2-5) and their names.
2.  **Turns**: Players take turns selecting a hidden cell on the 100-chart.
3.  **Guess**: When a cell is clicked, the player must correctly guess the number hidden there (1-100).
4.  **Score**: 
    *   If the guess is correct, the cell is filled with the player's color.
    *   If a player forms a line of **3 consecutive numbers** (horizontally, vertically, or diagonally), they get a point!
    *   The numbers used in a scoring line are "crossed out" (marked as scored) and cannot be used again for new lines.
5.  **Win**: The game continues until all numbers are revealed. The player with the most points wins!

## Features
-   **Multiplayer Support**: Play with 2 to 5 players.
-   **Interactive Board**: Click to reveal and claim spots.
-   **Automatic Scoring**: The game automatically detects winning lines and updates scores.
-   **Responsive Design**: Works on desktop and mobile devices.
-   **Visual Feedback**: Winning lines are drawn on the board, and a winner banner appears at the end.

## Tech Stack
-   **React**: UI Library
-   **Vite**: Build tool
-   **Tailwind CSS**: Styling
-   **PostCSS & Autoprefixer**: CSS processing

## Installation & Running

1.  Clone the repository:
    ```bash
    git clone https://github.com/jpashami/hundred-chart-chase.git
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser to the URL shown (usually `http://localhost:5173`).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**This software is provided "as-is" and is free forever.**

## Educational Purpose
Hundred Chart Chase is designed as a free educational tool that helps students build a mental model of our number system. Through gameplay, children learn to see how numbers grow and recognize the patterns that each group of 10 follows.

**Learning Goals:**
-   **Build Number Sense**: Develop a mental model of the number system (1-100) by understanding how numbers are organized and relate to each other
-   **Practice Counting Strategies**: Count forward and backward by 1s and 10s from any starting point on the hundreds chart
-   **Use Benchmarks**: Learn to accurately place numbers on the chart using reference points and patterns
-   **Strategic Reasoning**: Apply problem-solving skills to determine number placement and plan moves ahead
-   **Pattern Recognition**: Discover and use the repeating patterns in our base-10 number system

Perfect for classrooms, homeschooling, or family game nights!

