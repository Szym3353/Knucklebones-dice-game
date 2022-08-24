import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

//Socket
import { socket } from "./socketio";

//Css
import "./css/main.css";

//Context
import { RoomProvider } from "./context/RoomContext";

//Components
import { CircularProgress, ThemeProvider } from "@mui/material";
import { Container } from "@mui/system";

//Pages
import Room from "./pages/Room";
import HomePage from "./pages/HomePage";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="App">
      <RoomProvider>
        {isConnected ? (
          <Container
            disableGutters
            maxWidth={false}
            sx={{ height: "100vh", bgcolor: "#242424" }}
          >
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/room/:id" element={<Room />} />
            </Routes>
          </Container>
        ) : (
          <CircularProgress />
        )}
      </RoomProvider>
    </div>
  );
}

export default App;
