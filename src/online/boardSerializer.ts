import { Board, Piece } from "../game/types";

export type FirebaseBoardCell = Piece | { empty: true };
export type FirebaseBoard = Record<string, FirebaseBoardCell>;

export const serializeBoardForFirebase = (board: Board): FirebaseBoard => {
  const fbBoard: FirebaseBoard = {};
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      const key = `${r}-${c}`;
      // Safety check in case board row is missing
      const cell = board[r] ? board[r][c] : null;
      if (cell) {
        fbBoard[key] = { ...cell };
      } else {
        fbBoard[key] = { empty: true };
      }
    }
  }
  return fbBoard;
};

export const deserializeBoardFromFirebase = (fbBoard: FirebaseBoard | undefined): Board => {
  const board: Board = [];
  for (let r = 0; r < 5; r++) {
    const row: (Piece | null)[] = [];
    for (let c = 0; c < 5; c++) {
      const key = `${r}-${c}`;
      if (fbBoard && fbBoard[key]) {
        const fbCell = fbBoard[key];
        if ('empty' in fbCell && fbCell.empty) {
          row.push(null);
        } else {
          row.push(fbCell as Piece);
        }
      } else {
        row.push(null);
      }
    }
    board.push(row);
  }
  return board;
};
