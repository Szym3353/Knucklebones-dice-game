const { Schema, model } = require("mongoose");

const roomSchema = new Schema({
  code: Number,
  turn: Number,
  selecting: String,
  gameStarted: Boolean,
  gameEnded: Boolean,
  currentDice: Number,
  players: [
    {
      username: String,
      ready: Boolean,
      board: [
        {
          value: Number,
          multiplier: Number,
        },
      ],
      id: String,
      selecting: Boolean,
    },
  ],
});

module.exports = model("Room", roomSchema);
