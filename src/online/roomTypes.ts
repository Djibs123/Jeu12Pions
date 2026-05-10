import type { GameState, Player } from "../game/types";

export type OnlineRoomStatus = "waiting" | "playing" | "finished";

export type OnlinePlayer = {
  name: string;
  connected: boolean;
};

export type OnlineRoom = {
  code: string;
  status: OnlineRoomStatus;
  createdAt: number;
  currentPlayer: Player;
  winner: Player | null;
  players: {
    A?: OnlinePlayer;
    B?: OnlinePlayer;
  };
  game: GameState;
};
