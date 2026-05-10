import React, { useState, useEffect, useMemo } from 'react';
import { ModeLayout } from '../components/ModeLayout';
import { Board } from '../components/Board';
import { GamePanel } from '../components/GamePanel';
import { MoveHistory } from '../components/MoveHistory';
import { 
  createOnlineRoom, 
  joinOnlineRoom, 
  listenToOnlineRoom, 
  updateOnlineGameState,
  restartOnlineRoom
} from '../online/roomService';
import { OnlineRoom } from '../online/roomTypes';
import { Player, Cell } from '../game/types';
import { gameReducer } from '../game/gameReducer';
import { getLegalMoves, getLegalCaptures } from '../game/moveEngine';
import { isSameCell, getPieceAt } from '../game/rules';

interface OnlineGameProps {
  onBackToMenu: () => void;
}

export const OnlineGame: React.FC<OnlineGameProps> = ({ onBackToMenu }) => {
  const [playerName, setPlayerName] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  
  const [currentRoomCode, setCurrentRoomCode] = useState<string | null>(null);
  const [currentPlayerRole, setCurrentPlayerRole] = useState<Player | null>(null);
  const [room, setRoom] = useState<OnlineRoom | null>(null);
  
  const [localSelectedCell, setLocalSelectedCell] = useState<Cell | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Start listening to Firebase when a room code is set
  useEffect(() => {
    if (!currentRoomCode) return;
    
    const unsubscribe = listenToOnlineRoom(currentRoomCode, (updatedRoom) => {
      setRoom(updatedRoom);
      if (!updatedRoom) {
        setErrorMsg('La salle a été fermée ou est introuvable.');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [currentRoomCode]);

  // Infer selectedCell if we are in mustContinueCapture phase and page refreshed
  useEffect(() => {
    if (room && room.status === 'playing' && room.game.mustContinueCapture && !localSelectedCell) {
      const history = room.game.moveHistory || [];
      if (history.length > 0) {
        setLocalSelectedCell(history[history.length - 1].to);
      }
    }
  }, [room, localSelectedCell]);

  // Compute legal moves based on Firebase board state and local selection
  const legalMoves = useMemo(() => {
    if (!room || room.status !== 'playing' || !room.game) return [];
    if (!localSelectedCell || room.game.status === 'finished') return [];
    if (room.game.currentPlayer !== currentPlayerRole) return [];
    
    if (room.game.mustContinueCapture) {
       return getLegalCaptures(room.game.board, localSelectedCell);
    }
    
    return getLegalMoves(room.game.board, localSelectedCell);
  }, [room, localSelectedCell, currentPlayerRole]);

  const handleCreateRoom = async () => {
    setErrorMsg('');
    if (!playerName.trim()) {
      setErrorMsg('Entre ton pseudo.');
      return;
    }
    setLoading(true);
    try {
      const code = await createOnlineRoom(playerName.trim());
      setCurrentRoomCode(code);
      setCurrentPlayerRole('A');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la création de la partie.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    setErrorMsg('');
    if (!playerName.trim()) {
      setErrorMsg('Entre ton pseudo.');
      return;
    }
    if (!roomCodeInput.trim()) {
      setErrorMsg('Entre un code de partie.');
      return;
    }
    setLoading(true);
    try {
      const code = roomCodeInput.trim().toUpperCase();
      await joinOnlineRoom(code, playerName.trim());
      setCurrentRoomCode(code);
      setCurrentPlayerRole('B');
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la connexion à la partie.');
    } finally {
      setLoading(false);
    }
  };

  const handleCellClick = (cell: Cell) => {
    if (!room || room.status !== 'playing' || !currentPlayerRole) return;
    if (room.game.status === 'finished') return;
    
    // Check if it's player's turn
    if (room.game.currentPlayer !== currentPlayerRole) {
      setErrorMsg("Ce n'est pas ton tour.");
      return;
    }
    setErrorMsg('');

    // Try to move
    const move = legalMoves.find(m => isSameCell(m.to, cell));
    if (move) {
      const mockState = { ...room.game, selectedCell: localSelectedCell };
      const nextState = gameReducer(mockState, { type: 'PLAY_MOVE', move });
      
      setLocalSelectedCell(nextState.selectedCell);
      updateOnlineGameState(currentRoomCode!, nextState).catch(e => {
        console.error("Erreur d'écriture Firebase:", e);
      });
      return;
    }

    // Try to select
    const piece = getPieceAt(room.game.board, cell);
    if (piece) {
      if (piece.player !== currentPlayerRole) {
        setErrorMsg("Tu ne peux jouer que tes propres pions.");
        return;
      }
      if (room.game.mustContinueCapture) {
        if (!localSelectedCell || !isSameCell(localSelectedCell, cell)) {
          setErrorMsg("Vous devez continuer la capture ou terminer le tour.");
          return;
        }
      }
      setLocalSelectedCell(cell);
    }
  };

  const handleEndTurn = () => {
    if (!room || room.status !== 'playing' || !currentPlayerRole) return;
    if (room.game.currentPlayer !== currentPlayerRole) return;
    
    const mockState = { ...room.game, selectedCell: localSelectedCell };
    const nextState = gameReducer(mockState, { type: 'END_TURN' });
    
    setLocalSelectedCell(nextState.selectedCell);
    updateOnlineGameState(currentRoomCode!, nextState).catch(e => {
      console.error("Erreur d'écriture Firebase:", e);
    });
  };

  const handleRestart = () => {
    if (currentRoomCode) {
      setLocalSelectedCell(null);
      restartOnlineRoom(currentRoomCode).catch(e => {
        console.error("Erreur Firebase:", e);
      });
    }
  };

  // Views rendering
  if (!currentRoomCode || !currentPlayerRole) {
    return (
      <ModeLayout
        title="12 Pions"
        subtitle="Mode En Ligne"
        footerMessage="Connectez-vous pour jouer"
        onBack={onBackToMenu}
      >
        <div className="online-setup-container">
          <h2>Créer ou rejoindre une partie</h2>
          
          {errorMsg && <div className="error-alert" style={{color: 'red', marginBottom: '16px', textAlign: 'center', fontWeight: 'bold'}}>{errorMsg}</div>}
          
          <div className="online-forms">
            <div className="online-card">
              <h3>Joueur</h3>
              <div className="input-group">
                <label>Votre pseudo</label>
                <input 
                  type="text" 
                  placeholder="Ex: Maître Pions" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="online-card">
              <h3>Créer une partie</h3>
              <p>Hébergez une nouvelle partie et invitez un ami.</p>
              <button className="primary-btn mt-2" onClick={handleCreateRoom} disabled={loading}>
                {loading ? 'Création...' : 'Créer une partie'}
              </button>
            </div>

            <div className="online-card">
              <h3>Rejoindre une partie</h3>
              <div className="input-group">
                <label>Code de partie</label>
                <input 
                  type="text" 
                  placeholder="Ex: A1B2C" 
                  value={roomCodeInput}
                  onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                  disabled={loading}
                />
              </div>
              <button className="primary-btn mt-2" onClick={handleJoinRoom} disabled={loading}>
                {loading ? 'Connexion...' : 'Rejoindre'}
              </button>
            </div>
          </div>
        </div>
      </ModeLayout>
    );
  }

  if (!room) {
    return (
      <ModeLayout title="12 Pions" subtitle="Mode En Ligne" footerMessage="Connexion en cours..." onBack={onBackToMenu}>
        <div className="online-setup-container"><h2 style={{textAlign: 'center', marginTop: '40px'}}>Chargement de la salle...</h2></div>
      </ModeLayout>
    );
  }

  if (room.status === 'waiting') {
    return (
      <ModeLayout title="12 Pions" subtitle="Mode En Ligne" footerMessage="En attente du joueur B..." onBack={onBackToMenu}>
        <div className="online-setup-container" style={{textAlign: 'center', marginTop: '40px'}}>
          <h2>Salle créée !</h2>
          <p style={{marginBottom: '24px'}}>Partagez ce code avec votre ami :</p>
          <div style={{fontSize: '3rem', fontWeight: 'bold', letterSpacing: '8px', color: '#C05640', marginBottom: '32px'}}>
            {room.code}
          </div>
          <div className="instruction-box">
             <p>En attente d'un autre joueur...</p>
          </div>
        </div>
      </ModeLayout>
    );
  }

  // Playing state
  const isMyTurn = room.game.currentPlayer === currentPlayerRole;
  let footerMessage = room.game.message;
  if (!isMyTurn && room.game.status === 'playing') {
     footerMessage = `En attente du Joueur ${room.game.currentPlayer}...`;
  }

  return (
    <ModeLayout
      title="12 Pions"
      subtitle={`Code : ${room.code}`}
      footerMessage={errorMsg || footerMessage}
      onBack={onBackToMenu}
      headerContent={
        <GamePanel 
          gameState={room.game} 
          onEndTurn={handleEndTurn} 
          onRestart={handleRestart} 
        />
      }
    >
      <aside className="left-panel">
        <h2>Joueurs</h2>
        <div className="players-info">
          <div className={`player-card B ${currentPlayerRole === 'B' ? 'you' : ''}`} style={currentPlayerRole === 'B' ? {border: '2px solid #5A5A40'} : {}}>  
            <div className="player-card-header">
              <span>Joueur B {currentPlayerRole === 'B' ? "(Vous)" : ""}</span>
              <span>{room.players.B?.name}</span>
            </div>
            <div className="player-dots">
              {Array.from({length: 12}).map((_, i) => <div key={`B-${i}`} className="dot B" />)}
            </div>
          </div>
          <div className={`player-card A ${currentPlayerRole === 'A' ? 'you' : ''}`} style={currentPlayerRole === 'A' ? {border: '2px solid #C05640'} : {}}>  
            <div className="player-card-header">
              <span>Joueur A {currentPlayerRole === 'A' ? "(Vous)" : ""}</span>
              <span>{room.players.A?.name}</span>
            </div>
            <div className="player-dots">
              {Array.from({length: 12}).map((_, i) => <div key={`A-${i}`} className="dot A" />)}
            </div>
          </div>
        </div>
        <div className="instruction-box">
          <p>Vous êtes le Joueur {currentPlayerRole}. {isMyTurn ? "C'est à vous de jouer !" : "Attendez votre tour."}</p>
        </div>
      </aside>

      <section className="board-section">
        <div className="board-wrapper">
          <Board 
            board={room.game.board} 
            selectedCell={localSelectedCell} 
            legalMoves={legalMoves} 
            onCellClick={handleCellClick} 
          />
        </div>
      </section>
      
      <aside className="right-panel">
        <MoveHistory history={room.game.moveHistory || []} />
      </aside>
    </ModeLayout>
  );
};
