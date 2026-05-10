import { GameState, Move, Cell, GameStatus } from "./types";
import { createInitialBoard } from "./initialBoard";
import { applyMove, promoteIfNeeded, getLegalCaptures, switchPlayer, promoteLastPieces } from "./moveEngine";
import { checkWinner } from "./victory";
import { isSameCell, getPieceAt } from "./rules";

export type GameAction = 
  | { type: "SELECT_CELL"; cell: Cell }
  | { type: "PLAY_MOVE"; move: Move }
  | { type: "END_TURN" }
  | { type: "RESTART_GAME" };

export const initialState: GameState = {
  board: createInitialBoard(),
  currentPlayer: "A",
  status: "playing",
  winner: null,
  selectedCell: null,
  moveHistory: [],
  message: "Au joueur A de jouer",
  mustContinueCapture: false
};

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case "SELECT_CELL": {
      if (state.status === "finished") return state;
      const { cell } = action;
      
      const piece = getPieceAt(state.board, cell);
      
      if (piece && piece.player === state.currentPlayer) {
        // If in capture chain, can only select the piece doing the capturing
        if (state.mustContinueCapture) {
          if (state.selectedCell && isSameCell(state.selectedCell, cell)) {
             return state;
          } else {
             return { ...state, message: "Vous devez continuer la capture ou terminer le tour." };
          }
        }
        return { ...state, selectedCell: cell, message: "" };
      }
      
      return state;
    }
    
    case "PLAY_MOVE": {
      if (state.status === "finished") return state;
      const { move } = action;
      
      const piece = getPieceAt(state.board, move.from);
      if (!piece) return state;

      const newBoard = applyMove(state.board, move);
      const promoted = promoteIfNeeded(newBoard, move.to);
      promoteLastPieces(newBoard);
      
      // Update history
      const moveRecord = {
        player: piece.player,
        pieceType: piece.type, // type before promotion
        from: move.from,
        to: move.to,
        type: move.type,
        captured: move.captured || [],
        promoted
      };

      const newHistory = [...state.moveHistory, moveRecord];

      let nextPlayer = state.currentPlayer;
      let nextStatus = state.status;
      let nextWinner = state.winner;
      let nextMsg = "";
      let continueCapture = false;
      let nextSelectedCell = null;

      // Check for optional follow-up capture.
      // If the piece got promoted by this capture, getLegalCaptures will use queen rules.
      if (move.type === "capture") {
        const furtherCaptures = getLegalCaptures(newBoard, move.to);
        if (furtherCaptures.length > 0) {
          continueCapture = true;
          nextSelectedCell = move.to;
          nextMsg = "Capture multiple possible. Continuez ou terminez le tour.";
        }
      }

      if (!continueCapture) {
        // Turn over
        nextPlayer = switchPlayer(state.currentPlayer);
        nextWinner = checkWinner(newBoard, state.currentPlayer);
        if (nextWinner) {
          nextStatus = "finished";
          nextMsg = `Le joueur ${nextWinner} a gagné !`;
        } else {
          nextMsg = `Au joueur ${nextPlayer} de jouer`;
        }
      }

      return {
        ...state,
        board: newBoard,
        currentPlayer: nextPlayer,
        status: nextStatus as GameStatus,
        winner: nextWinner,
        moveHistory: newHistory,
        message: nextMsg,
        mustContinueCapture: continueCapture,
        selectedCell: nextSelectedCell
      };
    }
    
    case "END_TURN": {
      if (state.status === "finished") return state;
      if (!state.mustContinueCapture) return state;
      
      const nextPlayer = switchPlayer(state.currentPlayer);
      const nextWinner = checkWinner(state.board, state.currentPlayer);
      
      return {
        ...state,
        currentPlayer: nextPlayer,
        status: nextWinner ? "finished" : "playing",
        winner: nextWinner,
        message: nextWinner ? `Le joueur ${nextWinner} a gagné !` : `Au joueur ${nextPlayer} de jouer`,
        mustContinueCapture: false,
        selectedCell: null
      };
    }
    
    case "RESTART_GAME":
      return { ...initialState, board: createInitialBoard() };
      
    default:
      return state;
  }
};
