import { Container } from "@mui/system";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socketio";

import RoomLobby from "../components/RoomLobby";
import RoomGame from "../components/RoomGame";
import { errorType, useRoom } from "../context/RoomContext";

import { player, room } from "../context/RoomContext";

const Room = () => {
  let { id } = useParams();
  const { roomData, setRoomData, setErrors } = useRoom();

  useEffect(() => {
    socket.emit("get-room", { id }, (err: errorType, res: room) => {
      if (err) setErrors((prev: errorType[]) => [...prev, err]);
      if (res) {
        setRoomData(res);
      }
    });
    socket.on("startGame", () => {
      setRoomData((prev: room) => ({ ...prev, gameStarted: true }));
    });
    socket.on("change-users", (data: [player]) => {
      setRoomData((prev: room) => ({
        ...prev,
        players: [...data],
      }));
    });
    socket.on("update-room", (data: room) => {
      setRoomData({ ...data });
    });
    socket.on("diceRoll", (data: number) => {
      setRoomData((prev: room) => ({
        ...prev,
        currentDice: data,
      }));
    });
    return () => {
      socket.off("diceRoll");
      socket.off("startGame");
      socket.off("get-room");
      socket.off("change-users");
    };
  }, []);

  return (
    <Container sx={{ pt: 5 }}>
      {roomData?.gameStarted ? <RoomGame /> : <RoomLobby />}
    </Container>
  );
};

export default Room;
