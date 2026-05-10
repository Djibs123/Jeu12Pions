import { database } from "./firebaseConfig";
import { ref, set, get, update, onValue, off } from "firebase/database";
import { OnlineRoom, OnlineRoomStatus } from "./roomTypes";
import { GameState, Player } from "../game/types";
import { initialState, GameAction, gameReducer } from "../game/gameReducer";
import { createInitialBoard } from "../game/initialBoard";

export const generateRoomCode = (): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const createOnlineRoom = async (playerName: string): Promise<string> => {
  const roomCode = generateRoomCode();
  const roomRef = ref(database, `rooms/${roomCode}`);
  
  const roomData: OnlineRoom = {
    code: roomCode,
    status: "waiting",
    createdAt: Date.now(),
    currentPlayer: "A",
    winner: null,
    players: {
      A: {
        name: playerName,
        connected: true
      }
    },
    game: {
      ...initialState,
      board: createInitialBoard(),
      selectedCell: null
    }
  };

  await set(roomRef, roomData);
  return roomCode;
};

export const joinOnlineRoom = async (roomCode: string, playerName: string): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  
  if (!snapshot.exists()) {
    throw new Error("Code de partie introuvable.");
  }
  
  const room = snapshot.val() as OnlineRoom;
  
  if (room.status !== "waiting" || room.players.B) {
    throw new Error("La partie est déjà complète.");
  }
  
  await update(roomRef, {
    "players/B": { name: playerName, connected: true },
    "status": "playing"
  });
};

export const listenToOnlineRoom = (roomCode: string, callback: (room: OnlineRoom | null) => void): (() => void) => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  
  const unsubscribe = onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as OnlineRoom);
    } else {
      callback(null);
    }
  });

  return () => {
    off(roomRef, "value", unsubscribe);
  };
};

export const updateOnlineGameState = async (roomCode: string, game: GameState): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  
  // Clean selectedCell before sending to Firebase
  const cleanGame = {
    ...game,
    selectedCell: null
  };
  
  await update(roomRef, {
    game: cleanGame,
    currentPlayer: cleanGame.currentPlayer,
    winner: cleanGame.winner,
    status: cleanGame.status === "finished" ? "finished" : "playing"
  });
};

export const restartOnlineRoom = async (roomCode: string): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  
  const newGame: GameState = {
    ...initialState,
    board: createInitialBoard(),
    selectedCell: null
  };
  
  await update(roomRef, {
    game: newGame,
    currentPlayer: "A",
    winner: null,
    status: "playing"
  });
};

export const leaveOnlineRoom = async (roomCode: string, player: Player): Promise<void> => {
  const playerRef = ref(database, `rooms/${roomCode}/players/${player}`);
  await update(playerRef, { connected: false });
};
