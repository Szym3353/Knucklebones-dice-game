import React from "react";

//Context
import { boardValue, useRoom } from "../context/RoomContext";

//Components
import { Box, Card, CardHeader, Paper } from "@mui/material";

//Types
type props = {
  variant: "top" | "bottom";
};

const RoomGameBoard = ({ variant }: props) => {
  let { placeDice, roomData } = useRoom();

  let index = variant === "top" ? 0 : 1;
  let playerBoard = roomData.players[index].board;

  let playerPoints = 0;
  playerBoard.forEach((el: boardValue) => {
    return (playerPoints += el.value * el.multiplier);
  });
  return (
    <Card sx={{ mb: 1 }}>
      {variant === "top" && (
        <CardHeader title={`Player's 1 board - ${playerPoints}`} />
      )}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          width: 360,
        }}
      >
        {playerBoard.map((el: boardValue, i: number) => {
          return (
            <Paper
              key={`${variant}${i}`}
              sx={{
                width: 100,
                height: 100,
                bgcolor: `${
                  el.multiplier === 1
                    ? "#eee"
                    : el.multiplier === 2
                    ? "green"
                    : "blue"
                }`,
                boxShadow: "0px 1px 4px rgba(0,0,0,0.4)",
                mx: 1,
              }}
              onClick={() => placeDice(index, i)}
            >
              {el.value === 0 ? "" : `${el.value} * ${el.multiplier}`}
            </Paper>
          );
        })}
      </Box>
      {variant === "bottom" && (
        <CardHeader title={`Player's 2 board - ${playerPoints}`} />
      )}
    </Card>
  );
};

export default RoomGameBoard;
