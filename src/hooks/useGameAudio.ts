import { useEffect, useRef } from 'react';
import { GameState } from '../game/types';
import { gameAudio } from '../game/audio';

export const useGameAudio = (gameState: GameState | null) => {
  const previousHistoryLength = useRef(0);
  const previousStatus = useRef('playing');
  const initRef = useRef(false);

  useEffect(() => {
    if (!gameState) return;

    const history = gameState.moveHistory || [];
    
    if (!initRef.current) {
      previousHistoryLength.current = history.length;
      previousStatus.current = gameState.status;
      initRef.current = true;
      return;
    }

    if (history.length > previousHistoryLength.current) {
      // A new move was made
      const lastMove = history[history.length - 1];
      
      gameAudio.init(); // Must be called after user interaction, here it usually happens after a click

      if (lastMove.promoted) {
         gameAudio.playPromote();
      } else if (lastMove.type === 'capture' || (lastMove.captured && lastMove.captured.length > 0)) {
         gameAudio.playCapture();
      } else {
         gameAudio.playMove();
      }
    }
    
    previousHistoryLength.current = history.length;

    if (gameState.status === 'finished' && previousStatus.current !== 'finished') {
       gameAudio.init();
       gameAudio.playGameOver();
    }
    
    previousStatus.current = gameState.status;

  }, [gameState]);
};
