const { Server } = require("socket.io");
const { mongoose } = require("mongoose");

require("dotenv").config();

const Room = require("./models/room");

const io = new Server(5000, {});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }, (err) => {
  console.log("Connected to database");
});

io.on("connection", (socket) => {
  socket.on("createRoom", async (data, callBackFunc) => {
    try {
      let newRoom = new Room({
        code: Math.floor(Math.random() * 90000) + 10000,
        turn: 0,
        gameStarted: false,
        currentDice: 0,
        players: [
          {
            ready: false,
            board: [
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
              {
                value: 0,
                multiplier: 1,
              },
            ],
            id: socket.id,
            username: data.username,
            selecting: false,
          },
        ],
      });

      newRoom.save();

      callBackFunc(null, newRoom._id);
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("toggle-ready", async (data, callBackFunc) => {
    try {
      let room = await Room.findById({ _id: data });

      room.players[
        room.players.findIndex((player) => player.id === socket.id)
      ].ready =
        !room.players[
          room.players.findIndex((player) => player.id === socket.id)
        ].ready;

      room.save();

      callBackFunc(null, room.players);
      socket.to(data).emit("change-users", room.players);
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("leave-room", async (data, callBackFunc) => {
    try {
      let room = await Room.findById({ _id: data });
      room.players = room.players.filter((player) => player.id !== socket.id);
      socket.leave(`${data}`);
      if (room.players.length < 1) {
        return Room.findByIdAndDelete({ _id: data });
      }
      room.save();
      socket.to(data).emit("change-users", room.players);
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("join-room", async (data, callBackFunc) => {
    try {
      if (data.code.length !== 5) {
        console.log("?");
        return callBackFunc({
          message: "Incorrect code",
          action: false,
          type: "warning",
        });
      }

      let room = await Room.findOne({ code: data.code });
      if (!room) {
        return callBackFunc({
          message: "Incorrect code",
          action: false,
          type: "warning",
        });
      }
      room.players.push({
        id: socket.id,
        username: data.username,
        board: [
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
          {
            value: 0,
            multiplier: 1,
          },
        ],
        ready: false,
      });

      room.save();

      socket.to(`${room._id}`).emit("change-users", room.players);
      callBackFunc(null, room._id);
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("start-game", async (data, callBackFunc) => {
    try {
      let room = await Room.findById({ _id: data });
      if (!room) {
        throw new Error("This room does not exists");
      }
      if (room.players.some((el) => el.ready === false)) return;

      room.gameStarted = true;

      room.save();

      callBackFunc(null);
      socket.to(`${data}`).emit("startGame");
    } catch (error) {
      console.log(error);
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("get-room", async (data, callBackFunc) => {
    try {
      let room = await Room.findById(data.id);
      if (room.players.some((e) => e.id === socket.id)) {
        socket.join(`${room._id}`);
        return callBackFunc(null, room);
      }
      return callBackFunc({
        message: "You are not in this room",
        action: "changePath",
        type: "error",
      });
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("roll-dice", async (data, callBackFunc) => {
    try {
      let room = await Room.findById(data);
      let diceThrow = Math.floor(Math.random() * (6 - 1 + 1) + 1);
      room.players[
        room.players.findIndex((el) => el.id === socket.id)
      ].selecting = true;
      room.currentDice = diceThrow;
      room.save();
      socket.to(`${room._id}`).emit("diceRoll", diceThrow);
      callBackFunc(null, { dice: diceThrow, players: room.players });
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });

  socket.on("place-dice", async (data, callBackFunc) => {
    try {
      let room = await Room.findById({ _id: data.roomId });
      if (data.index !== room.turn)
        return callBackFunc({
          message: `It's not your turn. ${data.index} - ${room.turn}`,
          action: false,
          type: "warning",
        });
      if (
        room.players[data.index].selecting === false ||
        room.currentDice === 0
      ) {
        return callBackFunc({
          message: `Roll the dice. Current dice: ${
            room.currentDice
          }, Selecting: ${room.players[data.index].selecting}`,
          action: false,
          type: "warning",
        });
      }

      //Set values, including multiplier
      room.players[data.index].board = countValue(
        room.players[data.index].board,
        data.i,
        room.currentDice
      );

      //Check break same dices on opponent's board
      let opponentIndex = data.index === 1 ? 0 : 1;
      room.players[opponentIndex].board = checkBreak(
        room.players[opponentIndex].board,
        data.i,
        room.currentDice
      );

      //Clear dice and change turn
      room.currentDice = 0;
      room.turn = room.turn === 0 ? 1 : 0;
      room.players[data.index].selecting = false;

      //Check end
      if (room.players[data.index].board.every((el) => el.value > 0)) {
        room.gameEnded = true;
      }

      room.save();
      socket.to(`${data.roomId}`).emit("update-room", room);
      callBackFunc(null, room);
    } catch (error) {
      callBackFunc({ message: error.message, action: false, type: "error" });
    }
  });
});

function checkBreak(opponentBoard, index, currentDice) {
  //Lower index to first row
  while (index > 2) {
    index -= 3;
  }

  //Loop all rows up
  while (index < 9) {
    //If opponent has same value - break it
    if (opponentBoard[index].value == currentDice) {
      opponentBoard[index].value = 0;
      opponentBoard[index].multiplier = 1;
    }
    index += 3;
  }
  return opponentBoard;
}

function countValue(board, index, currentDice) {
  board[index].value = currentDice;

  //PLACE ON TOP ROW
  if (index < 3) {
    if (board[index + 3].value == currentDice) {
      board[index].multiplier = 2;
      board[index + 3].multiplier = 2;
    }
    if (board[index + 3 * 2].value == currentDice) {
      board[index].multiplier = 2;
      board[index + 3 * 2].multiplier = 2;
    }
    if (
      board[index + 3].value == currentDice &&
      board[index + 3 * 2].value == currentDice
    ) {
      board[index].multiplier = 9;
      board[index + 3].multiplier = 9;
      board[index + 3 * 2].multiplier = 9;
    }
  }

  //PLACE ON MID ROW
  if (index >= 3 && index < 6) {
    if (board[index - 3].value == currentDice) {
      board[index].multiplier = 2;
      board[index - 3].multiplier = 2;
    }
    if (board[index + 3].value == currentDice) {
      board[index].multiplier = 2;
      board[index + 3].multiplier = 2;
    }
    if (
      board[index - 3].value == currentDice &&
      board[index + 3].value == currentDice
    ) {
      board[index].multiplier = 9;
      board[index - 3].multiplier = 9;
      board[index + 3].multiplier = 9;
    }
  }

  //PLACE ON BOTTOM ROW
  if (index >= 6) {
    if (board[index - 3].value == currentDice) {
      board[index].multiplier = 2;
      board[index - 3].multiplier = 2;
    }
    if (board[index - 3 * 2].value == currentDice) {
      board[index].multiplier = 2;
      board[index - 3 * 2].multiplier = 2;
    }
    if (
      board[index - 3].value == currentDice &&
      board[index - 3 * 2].value == currentDice
    ) {
      board[index].multiplier = 9;
      board[index - 3].multiplier = 9;
      board[index - 3 * 2].multiplier = 9;
    }
  }
  return board;
}
