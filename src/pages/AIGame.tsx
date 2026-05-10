import React, { useReducer, useMemo, useEffect } from 'react';
import { Board } from '../components/Board';
import { GamePanel } from '../components/GamePanel';
import { MoveHistory } from '../components/MoveHistory';
import { ModeLayout } from '../components/ModeLayout';
import { gameReducer, initialState } from '../game/gameReducer';
import { getLegalMoves, getLegalCaptures } from '../game/moveEngine';
import { isSameCell, getPieceAt } from '../game/rules';
import { Cell } from '../game/types';
import { getAIMove, chooseRandomMove } from '../game/aiPlayer';

interface AIGameProps {
  onBackToMenu: () => void;
}

export const AIGame: React.FC<AIGameProps> = ({ onBackToMenu }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const legalMoves = useMemo(() => {
    if (!state.selectedCell || state.status === 'finished') return [];
    
    if (state.mustContinueCapture) {
       return getLegalCaptures(state.board, state.selectedCell);
    }
    
    return getLegalMoves(state.board, state.selectedCell);
  }, [state.board, state.selectedCell, state.status, state.mustContinueCapture]);

  // AI effect
  useEffect(() => {
    if (state.status === 'finished') return;

    if (state.currentPlayer === 'B') {
      const timer = setTimeout(() => {
        if (state.mustContinueCapture && state.selectedCell) {
          // AI must continue capture or end turn
          const followUpCaptures = getLegalCaptures(state.board, state.selectedCell);
          if (followUpCaptures.length > 0) {
            // just take a random capture
            const move = chooseRandomMove(followUpCaptures);
            if (move) {
              dispatch({ type: 'PLAY_MOVE', move });
            } else {
              dispatch({ type: 'END_TURN' });
            }
          } else {
            dispatch({ type: 'END_TURN' });
          }
        } else {
          // Normal AI move
          const aiMove = getAIMove(state.board, 'B');
          if (aiMove) {
            dispatch({ type: 'PLAY_MOVE', move: aiMove });
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.currentPlayer, state.status, state.mustContinueCapture, state.board, state.selectedCell]);

  const handleCellClick = (cell: Cell) => {
    if (state.status === 'finished' || state.currentPlayer === 'B') return;

    // Is it a legal move destination?
    const move = legalMoves.find(m => isSameCell(m.to, cell));
    if (move) {
      dispatch({ type: 'PLAY_MOVE', move });
      return;
    }

    // Is it a piece selection?
    const piece = getPieceAt(state.board, cell);
    if (piece && piece.player === state.currentPlayer) {
       dispatch({ type: 'SELECT_CELL', cell });
    }
  };

  const handleEndTurn = () => {
    if (state.currentPlayer === 'A') {
      dispatch({ type: 'END_TURN' });
    }
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  return (
    <ModeLayout
      title="12 Pions"
      subtitle="Mode IA - Humain vs Machine"
      footerMessage={state.message || "La partie a commencé. Bonne chance !"}
      onBack={onBackToMenu}
      headerContent={
        <GamePanel 
          gameState={state} 
          onEndTurn={handleEndTurn} 
          onRestart={handleRestart} 
        />
      }
    >
      <aside className="left-panel">
        <h2>Joueurs</h2>
        <div className="players-info">
          <div className="player-card B">  
            <div className="player-card-header">
              <span>IA (Joueur B)</span>
            </div>
            <div className="player-dots">
              {Array.from({length: 12}).map((_, i) => <div key={`B-${i}`} className="dot B" />)}
            </div>
          </div>
          <div className="player-card A">  
            <div className="player-card-header">
              <span>Vous (Joueur A)</span>
            </div>
            <div className="player-dots">
              {Array.from({length: 12}).map((_, i) => <div key={`A-${i}`} className="dot A" />)}
            </div>
          </div>
        </div>
        <div className="instruction-box">
          <p>L'IA joue automatiquement après vous. Vous jouez les pions rouges en bas.</p>
        </div>
      </aside>

      <section className="board-section">
        <div className="board-wrapper">
          <Board 
            board={state.board} 
            selectedCell={state.selectedCell} 
            legalMoves={legalMoves} 
            onCellClick={handleCellClick} 
          />
        </div>
      </section>
      
      <aside className="right-panel">
        <MoveHistory history={state.moveHistory} />
      </aside>
    </ModeLayout>
  );
};
