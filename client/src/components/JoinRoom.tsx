import React, { useState } from "react";

//Context
import { useRoom } from "../context/RoomContext";

//Components
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

const JoinRoom = () => {
  const [code, setCode] = useState<string>();

  const { joinRoom } = useRoom();

  return (
    <Box
      position={"absolute"}
      display="flex"
      flexDirection={"column"}
      sx={{
        zIndex: "1000",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "#fff",
        boxShadow: "2px 4px 6px rgba(0,0,0,0.3)",
        py: 2,
        px: 4,
      }}
    >
      <Typography variant="h6">Join room</Typography>
      <TextField
        id="filled-basic"
        label="Code"
        variant="filled"
        sx={{ boxShadow: "2px 4px 7px rgba(0,0,0,0.2)", my: 2 }}
        onChange={(e) => setCode(e.target.value)}
      />
      <Button
        onClick={() =>
          joinRoom(
            code || "",
            localStorage.getItem("nickname") ? "asd" : "Guest"
          )
        }
        variant="contained"
      >
        Join
      </Button>
    </Box>
  );
};

export default JoinRoom;
