import React, { useState } from "react";

//Components
import JoinRoom from "../components/JoinRoom";
import Navbar from "../components/Navbar";
import { Card, CardHeader, Container, TextField } from "@mui/material";

const HomePage = () => {
  const [showJoin, setShowJoin] = useState<boolean>(false);

  return (
    <>
      <Navbar toggle={setShowJoin} />
      {showJoin && <JoinRoom />}
      <Container>
        <Card sx={{ p: 3 }}>
          <CardHeader title={"Knucklebones"}></CardHeader>
          <TextField
            label="Nickname"
            onChange={(e) =>
              localStorage.setItem("nickname", e.currentTarget.value)
            }
            defaultValue={`${
              localStorage.getItem("nickname")
                ? localStorage.getItem("nickname")
                : "Guest"
            }`}
            variant="outlined"
          />
        </Card>
      </Container>
    </>
  );
};

export default HomePage;
