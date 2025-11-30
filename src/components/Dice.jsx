import React from 'react';
import './Dice.css';

const Dice = ({ value, rolling }) => {
  return (
    <div className={`dice face-${value} ${rolling ? 'rolling' : ''}`}>
      {Array.from({ length: value }).map((_, i) => (
        <span key={i} className="dot" />
      ))}
    </div>
  );
};

export default Dice;
