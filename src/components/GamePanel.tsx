import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { GameState } from '../game/types';

interface GamePanelProps {
  gameState: GameState;
  onEndTurn: () => void;
  onRestart: () => void;
}

export const GamePanel: React.FC<GamePanelProps> = ({ gameState, onEndTurn, onRestart }) => {
  useEffect(() => {
    if (gameState.status === 'finished' && gameState.winner) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: gameState.winner === 'A' ? ['#C05640', '#FFFFFF', '#D1C7B1'] : ['#5A5A40', '#FFFFFF', '#D1C7B1']
      });
    }
  }, [gameState.status, gameState.winner]);

  return (
    <div className="status-panel">
      {gameState.status === 'playing' && (
        <div className="player-info">
          <motion.div 
            key={gameState.currentPlayer}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`player-indicator ${gameState.currentPlayer}`} 
          />
          <motion.span
            key={`txt-${gameState.currentPlayer}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Tour : Joueur {gameState.currentPlayer}
          </motion.span>
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
