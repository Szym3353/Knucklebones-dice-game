import { Card, Typography, CardHeader, Button } from "@mui/material";
import React from "react";
import { useRoom } from "../context/RoomContext";

const EndCard = () => {
  const { roomData, leaveRoom } = useRoom();

  let p1Points = 0;
  let p2Points = 0;
  for (let i = 0; i < 9; i++) {
    p1Points +=
      roomData.players[0].board[i].value *
      roomData.players[0].board[i].multiplier;
    p2Points +=
      roomData.players[1].board[i].value *
      roomData.players[1].board[i].multiplier;
  }
  return (
    <Card
      sx={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
      }}
    >
      <CardHeader title={"Game ended"} />
      <Typography>{`${
        p1Points > p2Points
          ? `Won player1 - ${roomData.players[0].username}`
          : p1Points === p2Points
          ? "Draw"
          : `Won player2 - ${roomData.players[1].username}`
      }
          `}</Typography>
      <Typography>{`${p1Points} - ${p2Points}`}</Typography>
      <Button onClick={leaveRoom} sx={{ my: 2 }} variant="contained">
        Leave
      </Button>
    </Card>
  );
};

export default EndCard;
