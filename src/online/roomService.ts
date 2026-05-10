import { database } from "./firebaseConfig";
import { ref, set, get, update, onValue, onDisconnect } from "firebase/database";
import { OnlineRoom } from "./roomTypes";
import { GameState, Player } from "../game/types";
import { initialState } from "../game/gameReducer";
import { createInitialBoard } from "../game/initialBoard";
import { serializeBoardForFirebase, deserializeBoardFromFirebase } from "./boardSerializer";

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
  
  const roomData = {
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
      board: serializeBoardForFirebase(createInitialBoard()),
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
      const rawRoom = snapshot.val();
      if (rawRoom.game && rawRoom.game.board) {
         rawRoom.game.board = deserializeBoardFromFirebase(rawRoom.game.board);
         // Ensure moveHistory is an array even if Firebase stripped it empty
         rawRoom.game.moveHistory = rawRoom.game.moveHistory || [];
      }
      callback(rawRoom as OnlineRoom);
    } else {
      callback(null);
    }
  });

  return () => {
    unsubscribe();
  };
};

export const updateOnlineGameState = async (roomCode: string, game: GameState): Promise<void> => {
  const roomRef = ref(database, `rooms/${roomCode}`);
  
  // Clean selectedCell before sending to Firebase
  const cleanGame = {
    ...game,
    board: serializeBoardForFirebase(game.board),
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
  
  const newGame = {
    ...initialState,
    board: serializeBoardForFirebase(createInitialBoard()),
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

export const setupPlayerPresence = async (roomCode: string, player: Player): Promise<void> => {
  const connectedRef = ref(database, ".info/connected");
  const playerStatusRef = ref(database, `rooms/${roomCode}/players/${player}/connected`);

  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)
      set(playerStatusRef, true);

      // When I disconnect, update the last time I was seen online
      onDisconnect(playerStatusRef).set(false);
    }
  });
};
