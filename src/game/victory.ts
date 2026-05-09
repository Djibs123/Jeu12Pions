import { Board, Player } from "./types";
import { getAllLegalMovesForPlayer } from "./moveEngine";
import { getPieceAt } from "./rules";

export const getPieceCount = (board: Board, player: Player): number => {
  let count = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const piece = getPieceAt(board, { row: r, col: c });
      if (piece && piece.player === player) count++;
    }
  }
  return count;
};

export const hasAnyLegalMove = (board: Board, player: Player): boolean => {
  const moves = getAllLegalMovesForPlayer(board, player);
  return moves.length > 0;
};

export const checkWinner = (board: Board, currentPlayer: Player): Player | null => {
  const opponent = currentPlayer === "A" ? "B" : "A";
  if (getPieceCount(board, opponent) === 0) return currentPlayer;
  if (!hasAnyLegalMove(board, opponent)) return currentPlayer;
  return null;
};
