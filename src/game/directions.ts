import { Player } from "./types";

export const getForwardDirection = (player: Player): number => {
  return player === "A" ? -1 : 1;
};

export const getPawnDirections = (player: Player) => {
  const forward = getForwardDirection(player);
  return [
    { r: forward, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];
};

export const ORTHOGONAL_DIRECTIONS = [
  { r: -1, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: -1 },
  { r: 0, c: 1 },
];
