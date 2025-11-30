import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import './index.css';

const PRESET_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

function App() {
  const [gameState, setGameState] = useState('setup'); // setup, playing, finished
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerConfig, setPlayerConfig] = useState([
    { name: 'Player 1', color: PRESET_COLORS[0] },
    { name: 'Player 2', color: PRESET_COLORS[1] }
  ]);

  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [boardData, setBoardData] = useState(Array(100).fill(null));
  const [winningLines, setWinningLines] = useState([]);

  // Guessing Modal State
  const [showGuessModal, setShowGuessModal] = useState(false);
  const [selectedCellIndex, setSelectedCellIndex] = useState(null);
  const [guessInput, setGuessInput] = useState('');
  const [guessError, setGuessError] = useState(false);

  // Test Mode
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    setPlayerConfig(prev => {
      const newConfig = [...prev];
      if (numPlayers > newConfig.length) {
        for (let i = newConfig.length; i < numPlayers; i++) {
          newConfig.push({ name: `Player ${i + 1}`, color: PRESET_COLORS[i % PRESET_COLORS.length] });
        }
      } else {
        newConfig.splice(numPlayers);
      }
      return newConfig;
    });
  }, [numPlayers]);

  const handleStartGame = (e) => {
    e.preventDefault();
    const initializedPlayers = playerConfig.map((p, i) => ({
      ...p,
      id: i,
      score: 0
    }));
    setPlayers(initializedPlayers);
    setBoardData(Array(100).fill(null));
    setWinningLines([]);
    setCurrentPlayerIndex(0);
    setGameState('playing');
  };

  const checkWinCondition = (index, currentBoard, playerId) => {
    const directions = [
      { r: 0, c: 1 },   // Horizontal
      { r: 1, c: 0 },   // Vertical
      { r: 1, c: 1 },   // Diagonal TL-BR
      { r: 1, c: -1 }   // Diagonal TR-BL
    ];

    const newLines = [];
    const cellsToMarkScored = [];

    const row = Math.floor(index / 10);
    const col = index % 10;

    directions.forEach(({ r, c }) => {
      let consecutive = [];
      // Check a range around the placed cell
      for (let k = -2; k <= 2; k++) {
        const rCheck = row + k * r;
        const cCheck = col + k * c;
        const idxCheck = rCheck * 10 + cCheck;

        if (rCheck >= 0 && rCheck < 10 && cCheck >= 0 && cCheck < 10) {
          const cell = currentBoard[idxCheck];
          // Valid if it's the current placed cell OR (owned by player AND not already used in a line)
          const isMatch = (idxCheck === index) || (cell && cell.playerId === playerId && !cell.scored);

          if (isMatch) {
            consecutive.push(idxCheck);
            if (consecutive.length === 3) {
              newLines.push([...consecutive]);
              cellsToMarkScored.push(...consecutive);
              consecutive = []; // Reset to find distinct lines? Or overlapping? 
              // Rules say "Those numbers can no longer be used". 
              // So we consume them immediately.
              // Since we are iterating, we might find multiple lines.
            }
          } else {
            consecutive = [];
          }
        }
      }
    });

    return { newLines, cellsToMarkScored };
  };

  const handleCellClick = (index) => {
    if (boardData[index] !== null) return;
    setSelectedCellIndex(index);
    setGuessInput('');
    setGuessError(false);
    setShowGuessModal(true);
  };

  const submitGuess = (e) => {
    e.preventDefault();
    const correctNumber = selectedCellIndex + 1;
    if (parseInt(guessInput) === correctNumber) {
      // Correct!
      confirmMove(selectedCellIndex);
      setShowGuessModal(false);
    } else {
      setGuessError(true);
    }
  };

  const confirmMove = (index) => {
    const currentPlayer = players[currentPlayerIndex];
    const newBoard = [...boardData];

    newBoard[index] = { playerId: currentPlayer.id, scored: false };

    const { newLines, cellsToMarkScored } = checkWinCondition(index, newBoard, currentPlayer.id);

    if (newLines.length > 0) {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].score += newLines.length;
      setPlayers(updatedPlayers);

      cellsToMarkScored.forEach(idx => {
        if (newBoard[idx]) newBoard[idx].scored = true;
      });

      setWinningLines(prev => [...prev, ...newLines]);
    }

    setBoardData(newBoard);

    // Check if board is full
    const isFull = newBoard.every(cell => cell !== null);
    if (isFull) {
      setGameState('finished');
    } else {
      setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    }
  };

  const handleRestart = () => {
    setGameState('setup');
    setBoardData(Array(100).fill(null));
    setWinningLines([]);
    setPlayers([]);
  };

  const getWinner = () => {
    if (players.length === 0) return null;
    return players.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  };

  const autoFillBoard = () => {
    // Confirm before auto-filling
    const confirmed = window.confirm(
      '🧪 TEST MODE\n\nThis will automatically fill the entire board and end the game.\n\nAre you sure you want to continue?'
    );

    if (!confirmed) return;

    // Test mode: Auto-fill the board with random player selections
    const newBoard = [...boardData];
    const emptyIndices = [];

    for (let i = 0; i < 100; i++) {
      if (newBoard[i] === null) {
        emptyIndices.push(i);
      }
    }

    let currentPlayer = currentPlayerIndex;

    emptyIndices.forEach(index => {
      const playerId = players[currentPlayer].id;
      newBoard[index] = { playerId, scored: false };

      // Check for wins
      const { newLines, cellsToMarkScored } = checkWinCondition(index, newBoard, playerId);

      if (newLines.length > 0) {
        players[currentPlayer].score += newLines.length;
        cellsToMarkScored.forEach(idx => {
          if (newBoard[idx]) newBoard[idx].scored = true;
        });
        setWinningLines(prev => [...prev, ...newLines]);
      }

      currentPlayer = (currentPlayer + 1) % players.length;
    });

    setBoardData(newBoard);
    setPlayers([...players]);
    setGameState('finished');
  };


  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600">Hundred Chart Chase</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-blue-800 leading-relaxed">
              🎓 <strong>Free Educational Software</strong><br />
              Build a mental model of our number system! This game helps students understand how numbers grow
              and recognize patterns in groups of 10. Practice counting forward and backward by 1s and 10s
              while developing strategic thinking skills.
            </p>
            <p className="text-xs text-blue-600 mt-2">Free forever • Open Source • Made with ❤️ for learning</p>
          </div>
          <form onSubmit={handleStartGame} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Players</label>
              <div className="flex gap-2">
                {[2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setNumPlayers(n)}
                    className={`flex-1 py-2 rounded-lg border transition-all ${numPlayers === n
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                      }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Player Details</label>
              {playerConfig.map((p, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div
                    className="w-8 h-8 rounded-full shadow-sm border-2 border-white ring-1 ring-slate-200"
                    style={{ backgroundColor: p.color }}
                  />
                  <input
                    type="text"
                    required
                    value={p.name}
                    onChange={(e) => {
                      const newConfig = [...playerConfig];
                      newConfig[i].name = e.target.value;
                      setPlayerConfig(newConfig);
                    }}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder={`Player ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
            >
              Start Game
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Left Panel: Game Info */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Hundred Chart Chase</h1>

            {gameState === 'finished' ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">Game Over!</h2>
                <p className="text-lg text-yellow-700">
                  Winner: <span className="font-bold">{getWinner()?.name}</span> with {getWinner()?.score} points!
                </p>
                <button
                  onClick={handleRestart}
                  className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-bold shadow-sm"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <span className="text-indigo-900 font-medium">Current Turn</span>
                  <span
                    className="px-3 py-1 rounded-full text-white text-sm font-bold shadow-sm"
                    style={{ backgroundColor: players[currentPlayerIndex].color }}
                  >
                    {players[currentPlayerIndex].name}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Scoreboard</h3>
                  {players.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className={`font-medium ${currentPlayerIndex === p.id ? 'text-slate-900' : 'text-slate-600'}`}>
                          {p.name}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800">{p.score} pts</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleRestart}
                  className="mt-6 w-full py-2 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  End Game & Restart
                </button>

                {/* Test Mode Button */}
                <button
                  onClick={autoFillBoard}
                  className="w-full py-2 bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium rounded-lg transition-colors border border-purple-300"
                >
                  🧪 Test Mode: Auto-Fill Board
                </button>
              </div>
            )}
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm leading-relaxed">
            <strong>📚 How to play:</strong>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Click a cell to select it.</li>
              <li>Guess the hidden number correctly to claim the spot.</li>
              <li>Get 3 in a row (horizontal, vertical, diagonal) to score a point.</li>
              <li>Scored numbers cannot be used again.</li>
              <li>Game ends when the board is full. Highest score wins!</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-blue-200">
              <p className="text-xs text-blue-700">
                <strong>Educational Benefits:</strong> Build a mental model of the number system by seeing how numbers
                grow and recognizing patterns in groups of 10. Practice counting forward and backward by 1s and 10s,
                use benchmarks to place numbers accurately, and develop strategic reasoning skills.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Board */}
        <div className="lg:w-2/3 flex justify-center relative">
          <Board
            boardData={boardData}
            players={players}
            winningLines={winningLines}
            onCellClick={gameState === 'playing' ? handleCellClick : () => { }}
            currentPlayerColor={players[currentPlayerIndex]?.color}
          />
        </div>

      </div>

      {/* Guess Modal */}
      {showGuessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">
              What number is hidden here?
            </h3>
            <form onSubmit={submitGuess}>
              <input
                type="number"
                autoFocus
                value={guessInput}
                onChange={(e) => {
                  setGuessInput(e.target.value);
                  setGuessError(false);
                }}
                className={`w-full text-center text-3xl font-bold p-4 border-2 rounded-xl mb-4 outline-none transition-colors ${guessError ? 'border-red-500 bg-red-50 text-red-900' : 'border-indigo-200 focus:border-indigo-500'
                  }`}
                placeholder="?"
              />
              {guessError && (
                <p className="text-red-500 text-center mb-4 font-medium animate-pulse">
                  Incorrect! Try again.
                </p>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowGuessModal(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
