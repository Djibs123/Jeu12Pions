import React from 'react';
import { GameState } from '../game/types';

interface GamePanelProps {
  gameState: GameState;
  onEndTurn: () => void;
  onRestart: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({ gameState, onEndTurn, onRestart }) => {
  return (
    <div className="status-panel">
      {gameState.status === 'playing' && (
        <div className="player-info">
          <div className={`player-indicator ${gameState.currentPlayer}`} />
          <span>Tour : Joueur {gameState.currentPlayer}</span>
        </div>
      )}
      
      <div className="controls">
        {gameState.mustContinueCapture && (
          <button className="end-turn" onClick={onEndTurn}>Terminer le tour</button>
        )}
        <button className="restart-btn" onClick={onRestart}>Recommencer</button>
      </div>
    </div>
  );
};
