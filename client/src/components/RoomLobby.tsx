import React from "react";

//Context
import { useRoom } from "../context/RoomContext";

//Components
import RoomPlayer from "./RoomPlayer";
import { Button, CardHeader, Card } from "@mui/material";
import { Box } from "@mui/system";

//types
import { player } from "../context/RoomContext";

const RoomLobby = () => {
  const { roomData, leaveRoom, toggleReady, startGame } = useRoom();

  return (
    <Card sx={{ p: 3 }}>
      <Box
        component="div"
        display="flex"
        sx={{ justifyContent: "space-between" }}
      >
        <CardHeader
          subheader={`Code: ${roomData?.code}`}
          title={`Knucklebones room ${roomData?.players?.length} / 2`}
        />
        <Button onClick={leaveRoom} variant="contained" sx={{ mr: 2 }}>
          Opuść lobby
        </Button>
      </Box>
      <Box component="div" display="flex" sx={{ mb: 5 }}>
        {roomData &&
          roomData.players?.map((player: player, i: number) => (
            <RoomPlayer player={player} index={i} />
          ))}
      </Box>
      <Button
        onClick={toggleReady}
        variant="contained"
        sx={{ bgcolor: "green", mr: 2 }}
      >
        Ready
      </Button>
      <Button
        variant="contained"
        sx={{ bgcolor: "green" }}
        disabled={
          roomData?.players.some((el: player) => el.ready === false) ||
          roomData?.players.length === 1
        }
        onClick={startGame}
      >
        Start game
      </Button>
    </Card>
  );
};

export default RoomLobby;
