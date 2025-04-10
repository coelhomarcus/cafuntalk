import express from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import fs from "fs";

// Certificados HTTPS
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.coelhomarcus.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.coelhomarcus.com/fullchain.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const app = express();
const server = createServer(credentials, app);
const io = new Server(server, {
  cors: { origin: "https://chat.coelhomarcus.com" },
});

const roomUsersCount = {};
const userRoomMap = {};
let user = "";

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");

  socket.on("joinRoom", (room, userName) => {
    socket.join(room);
    user = userName;
    userRoomMap[socket.id] = room;

    if (!roomUsersCount[room]) {
      roomUsersCount[room] = 0;
    }
    roomUsersCount[room]++;

    io.to(room).emit("userCount", roomUsersCount[room]);

    io.to(room).emit("message", {
      sender: "System",
      text: `${user} joined the room.`,
      room: room,
      avatarIndex: null,
      system: true,
    });
  });

  socket.on("message", (data) => {
    console.log("Mensagem recebida:", data);
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    const room = userRoomMap[socket.id];
    if (room) {
      roomUsersCount[room] = Math.max((roomUsersCount[room] || 1) - 1, 0);

      io.to(room).emit("userCount", roomUsersCount[room]);

      io.to(room).emit("message", {
        sender: "System",
        text: `${user} left the room.`,
        room: room,
        avatarIndex: null,
        system: true,
      });

      delete userRoomMap[socket.id];
    }
    console.log("Usuário: ", socket.id, " desconectou!");
  });
});

server.listen(3001, () => {
  console.log("Servidor socket rodando na porta 3001");
});
