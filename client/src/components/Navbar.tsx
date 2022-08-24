import React from "react";

//Context
import { useRoom } from "../context/RoomContext";

//Components
import { Stack } from "@mui/system";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";

//Types
type props = {
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navbar = ({ toggle }: props) => {
  const { createRoom } = useRoom();
  return (
    <AppBar position="static" sx={{ mb: 10 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" component="div" sx={{ mr: 5 }}>
          {localStorage.getItem("nickname")
            ? localStorage.getItem("nickname")
            : "Guest"}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button startIcon={<AddIcon />} onClick={createRoom} color="inherit">
            Stwórz pokój
          </Button>
          <Button
            onClick={() => toggle((prev: boolean) => !prev)}
            startIcon={<EmojiPeopleIcon />}
            color="inherit"
          >
            Dołącz do pokoju
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
