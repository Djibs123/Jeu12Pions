export type Player = "A" | "B";
export type PieceType = "pawn" | "queen";

export type Cell = {
  row: number;
  col: number;
};

export type Piece = {
  id: string;
  player: Player;
  type: PieceType;
};

export type BoardCell = Piece | null;
export type Board = BoardCell[][];

export type GameStatus = "playing" | "finished";

export type MoveType = "move" | "capture";

export type Move = {
  from: Cell;
  to: Cell;
  type: MoveType;
  captured?: Cell[];
};

export type MoveRecord = {
  player: Player;
  pieceType: PieceType;
  from: Cell;
  to: Cell;
  type: MoveType;
  captured: Cell[];
  promoted: boolean;
};

export type GameState = {
  board: Board;
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  selectedCell: Cell | null;
  moveHistory: MoveRecord[];
  message: string;
  mustContinueCapture: boolean;
};
