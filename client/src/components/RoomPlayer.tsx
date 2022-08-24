import React from "react";

//Components
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Card, CardHeader, Typography } from "@mui/material";

//Types
import { player } from "../context/RoomContext";
type props = {
  player: player;
  index: number;
};

const RoomPlayer = ({ player, index }: props) => {
  return (
    <Card sx={{ mr: 2 }}>
      <CardHeader
        subheader={player.username}
        variant="h6"
        title={`Player ${index + 1}`}
      />
      <Typography
        sx={{ mt: 3 }}
        color={player.ready ? "#14a37f" : "#676767"}
        justifyContent={"center"}
        alignItems={"center"}
        display="flex"
      >
        {player.ready ? (
          <>
            <DoneIcon fontSize="inherit" /> Ready
          </>
        ) : (
          <>
            <CloseIcon fontSize="inherit" /> Not ready
          </>
        )}
      </Typography>
    </Card>
  );
};

export default RoomPlayer;
