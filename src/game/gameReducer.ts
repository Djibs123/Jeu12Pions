import { GameState, Move, Cell, GameStatus } from "./types";
import { createInitialBoard } from "./initialBoard";
import { applyMove, promoteIfNeeded, getLegalCaptures, switchPlayer, promoteLastPieces } from "./moveEngine";
import { checkWinner } from "./victory";
import { cloneBoard } from "./rules";
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
      if (!piece) {
        console.warn("Piece not found at", move.from);
        return state;
      }

      const newBoard = applyMove(state.board, move);
      
      let continueCapture = false;
      let nextSelectedCell = null;
      let nextMsg = "";
      
      if (move.type === "capture") {
        const furtherCaptures = getLegalCaptures(newBoard, move.to);
        if (furtherCaptures.length > 0) {
          continueCapture = true;
          nextSelectedCell = move.to;
          nextMsg = "Capture multiple possible. Continuez ou terminez le tour.";
        }
      }

      let promoted = false;
      // Only promote if we are NOT continuing to capture
      // (a piece that lands on the last row during a capture sequence only promotes if it stops)
      if (!continueCapture) {
        promoted = promoteIfNeeded(newBoard, move.to);
        promoteLastPieces(newBoard);
      }
      
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
      let nextStatus: GameStatus = state.status;
      let nextWinner = state.winner;

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
        status: nextStatus,
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
      
      const newBoard = cloneBoard(state.board);
      if (state.selectedCell) {
        promoteIfNeeded(newBoard, state.selectedCell);
      }
      promoteLastPieces(newBoard);

      const nextPlayer = switchPlayer(state.currentPlayer);
      const nextWinner = checkWinner(newBoard, state.currentPlayer);
      
      return {
        ...state,
        board: newBoard,
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
