import React from 'react';
import './Board.css';

const Board = ({ boardData, players, winningLines, onCellClick }) => {

    const getCoord = (index) => {
        const row = Math.floor(index / 10);
        const col = index % 10;
        // Center of cell in percentage
        return { x: col * 10 + 5, y: row * 10 + 5 };
    };

    return (
        <div className="board-container">
            <div className="board">
                {boardData.map((cell, index) => {
                    const owner = cell ? players.find(p => p.id === cell.playerId) : null;
                    return (
                        <div
                            key={index}
                            className={`cell ${cell ? 'occupied' : 'empty'}`}
                            onClick={() => onCellClick(index)}
                            style={{
                                backgroundColor: owner ? owner.color : '#ffffff',
                                borderColor: owner ? owner.color : undefined
                            }}
                        >
                            {cell ? (
                                <span className="cell-number occupied-text">
                                    {index + 1}
                                </span>
                            ) : (
                                <span className="cell-number-placeholder">

                                </span>
                            )}
                        </div>
                    );
                })}

                <svg className="lines-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {winningLines.map((line, i) => {
                        const start = getCoord(line[0]);
                        const end = getCoord(line[line.length - 1]);

                        return (
                            <line
                                key={i}
                                x1={start.x}
                                y1={start.y}
                                x2={end.x}
                                y2={end.y}
                                className="winning-line"
                            />
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default Board;
