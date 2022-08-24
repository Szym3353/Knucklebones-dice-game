import { Alert } from "@mui/material";
import { Box } from "@mui/system";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socketio";

type valueType = {
  roomData: room;
  setRoomData: React.Dispatch<React.SetStateAction<room>>;
  errors: errorType[] | [];
  setErrors: React.Dispatch<React.SetStateAction<errorType[] | []>>;
  leaveRoom: any;
  toggleReady: any;
  startGame: any;
  joinRoom: any;
  createRoom: any;
  rollDice: any;
  placeDice: any;
};

export type errorType = {
  message: string;
  type: "error" | "warning" | "info" | "success";
  action: "changePath" | false;
};

type rollDiceRes = {
  dice: number;
  players: [player];
};

let defaultRoom: room = {
  _id: "",
  code: 12345,
  gameStarted: false,
  gameEnded: false,
  turn: 0,
  currentDice: 0,
  players: [
    {
      ready: false,
      board: [{ value: 0, multiplier: 0 }],
      id: "a",
      username: "a",
      selecting: false,
    },
  ],
};

type props = {
  children?: ReactNode;
};

export type boardValue = {
  value: number;
  multiplier: number;
};

export type player = {
  ready: boolean;
  board: boardValue[];
  id: string;
  username: string;
  selecting: boolean;
};

export type room = {
  code: number;
  players: player[];
  gameStarted: boolean;
  turn: number;
  currentDice: number;
  _id: string;
  gameEnded: boolean;
};

const RoomContext = React.createContext<valueType>({} as valueType);

export function useRoom() {
  return useContext(RoomContext);
}

export function RoomProvider({ children }: props) {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState<room>(defaultRoom);
  const [errors, setErrors] = useState<errorType[] | []>([]);

  useEffect(() => {
    if (errors.length > 0) {
      if (errors[errors.length - 1].action === "changePath") {
        navigate("/");
      }
    }
  }, [errors]);

  function createRoom() {
    socket.emit(
      "createRoom",
      {
        username: localStorage.getItem("nickname")
          ? localStorage.getItem("nickname")
          : "Guest",
      },
      (err: errorType, res: string) => {
        if (err) {
          setErrors((prev: errorType[]) => [...prev, err]);
        }
        if (res) {
          navigate(`/room/${res}`);
        }
      }
    );
  }

  function leaveRoom() {
    socket.emit("leave-room", roomData._id, (err: errorType) => {
      if (err) setErrors((prev: errorType[]) => [...prev, err]);
    });
    setRoomData(defaultRoom);
    navigate("/");
  }

  function toggleReady() {
    socket.emit("toggle-ready", roomData._id, (err: string, res: [player]) => {
      setRoomData((prev: room) => ({
        ...prev,
        players: [...res],
      }));
    });
  }

  function startGame() {
    if (roomData?.players?.every((el: player) => el.ready === true)) {
      socket.emit("start-game", roomData._id, (err: errorType) => {
        if (err) {
          if (err) return setErrors((prev: errorType[]) => [...prev, err]);
        }
        setRoomData((prev: room) => ({ ...prev, gameStarted: true }));
      });
    }
  }

  function joinRoom(code: string, username: string) {
    socket.emit(
      "join-room",
      { code, username },
      (err: errorType, res: string) => {
        if (err) setErrors((prev: errorType[]) => [...prev, err]);
        if (res) {
          navigate(`/room/${res}`);
        }
      }
    );
  }

  function rollDice() {
    socket.emit(
      "roll-dice",
      roomData._id,
      (err: errorType, res: rollDiceRes) => {
        if (err) setErrors((prev: errorType[]) => [...prev, err]);

        if (res) {
          setRoomData((prev: room) => ({
            ...prev,
            players: res.players,
            currentDice: res.dice,
          }));
        }
      }
    );
  }

  function placeDice(index: number, i: number) {
    socket.emit(
      "place-dice",
      { index, i, roomId: roomData._id },
      (err: errorType, res: room) => {
        if (err) setErrors((prev: errorType[]) => [...prev, err]);

        if (res) setRoomData(res);
      }
    );
  }

  const value = {
    roomData,
    setRoomData,
    errors,
    setErrors,
    leaveRoom,
    toggleReady,
    startGame,
    joinRoom,
    createRoom,
    rollDice,
    placeDice,
  };

  return (
    <RoomContext.Provider value={value}>
      <Box sx={{ position: "absolute", bottom: 0, right: "10px" }}>
        {errors
          ? errors.map((err: errorType, index: number) => {
              return (
                <Alert
                  onClick={() => setErrors([])}
                  sx={{ m: 1, bgcolor: "rgba(0,0,0,0.8)", cursor: "pointer" }}
                  severity={err.type}
                >
                  {err.message}
                </Alert>
              );
            })
          : ""}
      </Box>
      {children}
    </RoomContext.Provider>
  );
}
