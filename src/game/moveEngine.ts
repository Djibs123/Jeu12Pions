import { Board, Cell, Move, Player, Piece } from "./types";
import { isInsideBoard, getPieceAt, isEmpty, isEnemy, cloneBoard } from "./rules";
import { getPawnDirections, ORTHOGONAL_DIRECTIONS } from "./directions";

export const getPawnMoves = (board: Board, from: Cell): Move[] => {
  const moves: Move[] = [];
  const piece = getPieceAt(board, from);
  if (!piece || piece.type !== "pawn") return moves;

  const dirs = getPawnDirections(piece.player);
  for (const d of dirs) {
    const to = { row: from.row + d.r, col: from.col + d.c };
    if (isEmpty(board, to)) {
      moves.push({ from, to, type: "move" });
    }
  }
  return moves;
};

export const getQueenMoves = (board: Board, from: Cell): Move[] => {
  const moves: Move[] = [];
  const piece = getPieceAt(board, from);
  if (!piece || piece.type !== "queen") return moves;

  for (const d of ORTHOGONAL_DIRECTIONS) {
    let step = 1;
    while (true) {
      const to = { row: from.row + d.r * step, col: from.col + d.c * step };
      if (!isInsideBoard(to)) break;
      if (isEmpty(board, to)) {
        moves.push({ from, to, type: "move" });
      } else {
        break; // blocked by any piece
      }
      step++;
    }
  }
  return moves;
};

export const getPawnCaptures = (board: Board, from: Cell): Move[] => {
  const moves: Move[] = [];
  const piece = getPieceAt(board, from);
  if (!piece || piece.type !== "pawn") return moves;

  const dirs = getPawnDirections(piece.player);
  for (const d of dirs) {
    const jumped = { row: from.row + d.r, col: from.col + d.c };
    const to = { row: from.row + d.r * 2, col: from.col + d.c * 2 };
    
    if (isInsideBoard(jumped) && isInsideBoard(to)) {
      const jumpedPiece = getPieceAt(board, jumped);
      if (isEnemy(piece, jumpedPiece) && isEmpty(board, to)) {
        moves.push({ from, to, type: "capture", captured: [jumped] });
      }
    }
  }
  return moves;
};

export const getQueenCaptures = (board: Board, from: Cell): Move[] => {
  const moves: Move[] = [];
  const piece = getPieceAt(board, from);
  if (!piece || piece.type !== "queen") return moves;

  for (const d of ORTHOGONAL_DIRECTIONS) {
    let step = 1;
    let foundEnemyCell: Cell | null = null;
    
    while (true) {
      const to = { row: from.row + d.r * step, col: from.col + d.c * step };
      if (!isInsideBoard(to)) break;
      
      const targetPiece = getPieceAt(board, to);
      
      if (!foundEnemyCell) {
        if (targetPiece) {
          if (isEnemy(piece, targetPiece)) {
            foundEnemyCell = to;
          } else {
            break; // blocked by own piece
          }
        }
      } else {
        // We already found an enemy, now we look for empty landing spots
        if (isEmpty(board, to)) {
          moves.push({ from, to, type: "capture", captured: [foundEnemyCell] });
        } else {
          break; // blocked by another piece after the enemy
        }
      }
      step++;
    }
  }
  return moves;
};

export const getLegalMoves = (board: Board, from: Cell): Move[] => {
  const piece = getPieceAt(board, from);
  if (!piece) return [];
  if (piece.type === "pawn") {
    return [...getPawnMoves(board, from), ...getPawnCaptures(board, from)];
  } else {
    return [...getQueenMoves(board, from), ...getQueenCaptures(board, from)];
  }
};

export const getLegalCaptures = (board: Board, from: Cell): Move[] => {
  const piece = getPieceAt(board, from);
  if (!piece) return [];
  if (piece.type === "pawn") {
    return getPawnCaptures(board, from);
  } else {
    return getQueenCaptures(board, from);
  }
};

export const getAllLegalMovesForPlayer = (board: Board, player: Player): Move[] => {
  const moves: Move[] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const piece = getPieceAt(board, { row: r, col: c });
      if (piece && piece.player === player) {
        moves.push(...getLegalMoves(board, { row: r, col: c }));
      }
    }
  }
  return moves;
};

export const applyMove = (board: Board, move: Move): Board => {
  const newBoard = cloneBoard(board);
  const piece = newBoard[move.from.row][move.from.col];
  
  newBoard[move.from.row][move.from.col] = null;
  newBoard[move.to.row][move.to.col] = piece;
  
  if (move.type === "capture" && move.captured && move.captured.length > 0) {
    for (const cap of move.captured) {
      newBoard[cap.row][cap.col] = null;
    }
  }
  
  return newBoard;
};

export const shouldPromote = (piece: Piece, cell: Cell): boolean => {
  if (piece.type === "queen") return false;
  if (piece.player === "A" && cell.row === 0) return true;
  if (piece.player === "B" && cell.row === 4) return true;
  return false;
};

export const promoteIfNeeded = (board: Board, cell: Cell): boolean => {
  const piece = getPieceAt(board, cell);
  if (piece && shouldPromote(piece, cell)) {
    piece.type = "queen";
    return true;
  }
  return false;
};

export const switchPlayer = (player: Player): Player => {
  return player === "A" ? "B" : "A";
};
