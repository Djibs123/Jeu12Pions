import { GameState } from '../game/types';

export type OnlinePlayer = {
  name: string;
  connected: boolean;
};

export type OnlineRoom = {
  code: string;
  status: "waiting" | "playing" | "finished";
  players: {
    A?: OnlinePlayer;
    B?: OnlinePlayer;
  };
  game: GameState;
};
