let express = require("express");
const cors = require("cors");
let http = require("http");
let app = express();
let server = http.createServer(app);
let socketio = require("socket.io");
let io = socketio.listen(server);

app.use(cors());
function boot() {
  const PORT = 5050;

  let users = {};

  let socketToRoom = {};

  const maximum = process.env.MAXIMUM || 4;

  io.on("connection", (socket) => {
    socket.on("join_room", (data) => {
      if (users[data.room]) {
        const length = users[data.room].length;
        if (length === maximum) {
          socket.to(socket.id).emit("room_full");
          return;
        }
        users[data.room].push({ id: socket.id, email: data.email });
      } else {
        users[data.room] = [{ id: socket.id, email: data.email }];
      }
      socketToRoom[socket.id] = data.room;

      socket.join(data.room);
      console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

      const usersInThisRoom = users[data.room].filter(
        (user) => user.id !== socket.id
      );

      socket.emit("users_muted_info", usersInThisRoom);

      io.sockets.to(socket.id).emit("all_users", usersInThisRoom);
    });

    socket.on("offer", (data) => {
      //console.log(data.sdp);
      socket.to(data.offerReceiveID).emit("getOffer", {
        sdp: data.sdp,
        offerSendID: data.offerSendID,
        offerSendEmail: data.offerSendEmail,
      });
    });

    socket.on("answer", (data) => {
      //console.log(data.sdp);
      socket
        .to(data.answerReceiveID)
        .emit("getAnswer", { sdp: data.sdp, answerSendID: data.answerSendID });
    });

    socket.on("candidate", (data) => {
      //console.log(data.candidate);
      socket.to(data.candidateReceiveID).emit("getCandidate", {
        candidate: data.candidate,
        candidateSendID: data.candidateSendID,
      });
    });

    socket.on("toggle_mic", (data) => {
      socket.to(data.room).emit("mute", { id: socket.id, muted: data.muted });
      const roomID = socketToRoom[socket.id];
      const room = users[roomID];
      if (room) {
        room.forEach((user) => {
          if (user.id === socket.id) {
            user.isMuted = data.muted;
          }
        });
        // const usersInThisRoom = room.filter((user) => user.id !== socket.id);
        // socket.to(roomID).emit("mute", { id: socket.id, muted: data.muted });
        // socket.emit("users_muted_info", usersInThisRoom);
      }
    });

    socket.on("speaking", (data) => {
      socket
        .to(data.room)
        .emit("speak", { id: socket.id, speaking: data.speaking });
    });

    socket.on("chat_send", (data) => {
      socket.to(data.room).emit("chat_receive", {
        id: socket.id,
        msg: data.msg,
        name: data.name,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[${socketToRoom[socket.id]}]: ${socket.id} exit`);
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
        room = room.filter((user) => user.id !== socket.id);
        users[roomID] = room;
        if (room.length === 0) {
          delete users[roomID];
          return;
        }
      }
      socket.to(roomID).emit("user_exit", { id: socket.id });
    });

    socket.on("change_time", (timeData) => {
      socket.to(timeData.room).emit("time_changed", timeData);
    });
  });

  server.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
  });
}
module.exports = boot;
