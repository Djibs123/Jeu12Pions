import { Board, Move, Player } from "./types";
import { getAllLegalMovesForPlayer, shouldPromote } from "./moveEngine";
import { getPieceAt } from "./rules";

export const getCapturingMoves = (moves: Move[]): Move[] => {
  return moves.filter(m => m.type === "capture");
};

export const getPromotionMoves = (board: Board, moves: Move[], player: Player): Move[] => {
  return moves.filter(m => {
    const piece = getPieceAt(board, m.from);
    if (!piece) return false;
    return shouldPromote(piece, m.to);
  });
};

export const chooseRandomMove = (moves: Move[]): Move | null => {
  if (moves.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * moves.length);
  return moves[randomIndex];
};

export const getAIMove = (board: Board, player: Player): Move | null => {
  const allMoves = getAllLegalMovesForPlayer(board, player);
  if (allMoves.length === 0) return null;

  // 1. Try to capture
  const captures = getCapturingMoves(allMoves);
  if (captures.length > 0) {
    return chooseRandomMove(captures);
  }

  // 2. Try to promote
  const promotions = getPromotionMoves(board, allMoves, player);
  if (promotions.length > 0) {
    return chooseRandomMove(promotions);
  }

  // 3. Random move
  return chooseRandomMove(allMoves);
};
