import { Board } from "./types";

export const createInitialBoard = (): Board => {
  const board: Board = [];
  let pieceId = 0;
  for (let row = 0; row < 5; row++) {
    const boardRow: Board[0] = [];
    for (let col = 0; col < 5; col++) {
      if (row === 2 && col === 2) {
        boardRow.push(null);
      } else if (row < 2 || (row === 2 && (col === 0 || col === 1))) {
        // Player B
        boardRow.push({ id: `p_${pieceId++}`, player: "B", type: "pawn" });
      } else {
        // Player A
        boardRow.push({ id: `p_${pieceId++}`, player: "A", type: "pawn" });
      }
    }
    board.push(boardRow);
  }
  return board;
};
