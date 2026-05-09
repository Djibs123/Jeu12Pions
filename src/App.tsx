import React, { useReducer, useMemo } from 'react';
import { Board } from './components/Board';
import { GamePanel } from './components/GamePanel';
import { MoveHistory } from './components/MoveHistory';
import { gameReducer, initialState } from './game/gameReducer';
import { getLegalMoves, getLegalCaptures } from './game/moveEngine';
import { isSameCell, getPieceAt } from './game/rules';
import { Cell, Move } from './game/types';
import './styles/global.css';
import './styles/board.css';
import './styles/game.css';

export default function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const legalMoves = useMemo(() => {
    if (!state.selectedCell || state.status === 'finished') return [];
    
    if (state.mustContinueCapture) {
       return getLegalCaptures(state.board, state.selectedCell);
    }
    
    return getLegalMoves(state.board, state.selectedCell);
  }, [state.board, state.selectedCell, state.status, state.mustContinueCapture]);

  const handleCellClick = (cell: Cell) => {
    if (state.status === 'finished') return;

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
    dispatch({ type: 'END_TURN' });
  };

  const handleRestart = () => {
    dispatch({ type: 'RESTART_GAME' });
  };

  return (
    <div className="game-container">
      <header className="header">
        <div className="header-title">
          <h1>12 Pions</h1>
          <span className="subtitle">Tactique & Tradition</span>
        </div>
        <GamePanel 
          gameState={state} 
          onEndTurn={handleEndTurn} 
          onRestart={handleRestart} 
        />
      </header>
      
      <main className="main-content">
        <aside className="left-panel">
          <h2>Joueurs</h2>
          <div className="players-info">
            <div className="player-card B">  
              <div className="player-card-header">
                <span>Joueur B</span>
              </div>
              <div className="player-dots">
                {Array.from({length: 12}).map((_, i) => <div key={`B-${i}`} className="dot B" />)}
              </div>
            </div>
            <div className="player-card A">  
              <div className="player-card-header">
                <span>Joueur A</span>
              </div>
              <div className="player-dots">
                {Array.from({length: 12}).map((_, i) => <div key={`A-${i}`} className="dot A" />)}
              </div>
            </div>
          </div>
          <div className="instruction-box">
            <p>Sélectionnez un pion. Seuls les déplacements orthogonaux sont autorisés. Les captures ne sont pas obligatoires.</p>
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
      </main>

      <footer className="footer">
        <p>{state.message || "La partie a commencé. Bonne chance aux deux joueurs."}</p>
      </footer>
    </div>
  );
}
