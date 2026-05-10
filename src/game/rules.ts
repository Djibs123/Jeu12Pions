import { Board, Cell, Piece } from "./types";

export const isInsideBoard = (cell: Cell): boolean => {
  return cell.row >= 0 && cell.row < 5 && cell.col >= 0 && cell.col < 5;
};

export const isSameCell = (a: Cell, b: Cell): boolean => {
  return a.row === b.row && a.col === b.col;
};

export const getPieceAt = (board: Board, cell: Cell): Piece | null => {
  if (!board || !isInsideBoard(cell)) return null;
  const row = board[cell.row];
  if (!row) return null;
  return row[cell.col] || null;
};

export const isEmpty = (board: Board, cell: Cell): boolean => {
  if (!board || !isInsideBoard(cell)) return false;
  const row = board[cell.row];
  if (!row) return true;
  return !row[cell.col];
};

export const isEnemy = (piece: Piece, target: Piece | null): boolean => {
  if (!target) return false;
  return piece.player !== target.player;
};

export const isOwnPiece = (piece: Piece, target: Piece | null): boolean => {
  if (!target) return false;
  return piece.player === target.player;
};

export const cloneBoard = (board: Board): Board => {
  // Ensure we reconstruct a 5x5 board in case Firebase stripped lengths
  const newBoard: Board = [];
  for (let r = 0; r < 5; r++) {
    const row = board && board[r] ? board[r] : [];
    const newRow = [];
    for (let c = 0; c < 5; c++) {
      const p = row[c] ? { ...row[c]! } : null;
      newRow.push(p);
    }
    newBoard.push(newRow);
  }
  return newBoard;
};
