import React from "react";

//Context
import { useRoom } from "../context/RoomContext";

//Socketio
import { socket } from "../socketio";

//Components
import RoomGameBoard from "./RoomGameBoard";
import { Box, Container } from "@mui/system";
import { Button, Card, CardHeader } from "@mui/material";
import EndCard from "./EndCard";

const RoomGame = () => {
  const { rollDice, roomData } = useRoom();

  return (
    <Container
      component={"div"}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
      }}
    >
      {roomData.gameEnded && <EndCard />}
      <Box>
        <Card sx={{ mb: 2 }}>
          <CardHeader title={`Player ${roomData.turn + 1} turn`} />
        </Card>
        <Card
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            p: 2,
          }}
        >
          <Box
            sx={{
              width: 100,
              height: 100,
              //border: "1px solid black",
              boxShadow: "1px 3px 8px rgba(0,0,0,0.4)",
              mb: 2,
            }}
          >
            {roomData.currentDice}
          </Box>
          <Button
            onClick={rollDice}
            variant={"contained"}
            disabled={
              roomData.players[roomData.turn].id !== socket.id ||
              roomData.currentDice > 0
            }
          >
            Roll dice
          </Button>
        </Card>
      </Box>
      <Box>
        <RoomGameBoard variant="top" />
        <RoomGameBoard variant="bottom" />
      </Box>
    </Container>
  );
};

export default RoomGame;
