import { Board, Cell, Piece } from "./types";

export const isInsideBoard = (cell: Cell): boolean => {
  return cell.row >= 0 && cell.row < 5 && cell.col >= 0 && cell.col < 5;
};

export const isSameCell = (a: Cell, b: Cell): boolean => {
  return a.row === b.row && a.col === b.col;
};

export const getPieceAt = (board: Board, cell: Cell): Piece | null => {
  if (!isInsideBoard(cell)) return null;
  return board[cell.row][cell.col];
};

export const isEmpty = (board: Board, cell: Cell): boolean => {
  if (!isInsideBoard(cell)) return false;
  return board[cell.row][cell.col] === null;
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
  return board.map(row => row.map(cell => cell ? { ...cell } : null));
};
