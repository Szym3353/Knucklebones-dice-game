import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socketio";

import { player, room } from "../context/RoomContext";

export default function useRoom() {
  const navigate = useNavigate();
  //const [roomData, setRoomData] = useState<room>();

  /* const createRoom = () => {
    socket.emit(
      "createRoom",
      { username: localStorage.getItem("nickname") ? "asd" : "Guest" },
      (err: string, res: string) => {
        if (err) {
        }
        if (res) {
          navigate(`/room/${res}`);
        }
      }
    );
  }; */

  /* const leaveRoom = (roomId: string) => {
    socket.emit("leave-room", { roomId });
    navigate("/");
  }; */

  /* const toggleReady = (
    roomId: string,
    setRoomData: React.Dispatch<React.SetStateAction<room>>
  ) => {
    socket.emit("toggle-ready", { roomId }, (err: string, res: [player]) => {
      setRoomData((prev: room) => ({
        ...prev,
        players: [...res],
      }));
    });
  }; */

  /* const joinRoom = (code: string, username: string) => {
    socket.emit("join-room", { code, username }, (err: string, res: string) => {
      if (err) {
        console.log(err);
      }
      if (res) {
        navigate(`/room/${res}`);
      }
    });
  }; */

  /* const startGame = (
    roomId: string,
    setRoomData: React.Dispatch<React.SetStateAction<room>>,
    roomData: room
  ) => {
    if (roomData?.players?.every((el: player) => el.ready === true)) {
      console.log("a tu?");
      socket.emit("start-game", { roomId }, (err: string) => {
        console.log("callback");
        if (err) {
          return console.log(err);
        }
        setRoomData((prev: room) => ({ ...prev, gameStarted: true }));
      });
    }
  }; */

  /* type rollDiceRes = {
    dice: number;
    players: [player];
  };

  const rollDice = (
    roomId: string,
    roomData: room,
    setRoomData: React.Dispatch<React.SetStateAction<room>>
  ) => {
    socket.emit("roll-dice", { roomId }, (err: string, res: rollDiceRes) => {
      if (err) {
        return console.log(err);
      }
      setRoomData((prev: room) => ({
        ...prev,
        players: res.players,
        currentDice: res.dice,
      }));
    });
  }; */

  const placeDice = (
    index: number,
    i: number,
    roomId: string,
    setRoomData: React.Dispatch<React.SetStateAction<room>>
  ) => {
    socket.emit(
      "place-dice",
      { index, i, roomId },
      (err: string, res: room) => {
        if (err) {
          return console.log(err);
        }
        setRoomData(res);
      }
    );
  };

  return {
    //roomData,
    //setRoomData,
    //createRoom,
    //leaveRoom,
    //joinRoom,
    //toggleReady,
    //startGame,
    //rollDice,
    placeDice,
  };
}
