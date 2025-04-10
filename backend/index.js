import express from "express";
import { createServer } from "https";
import { Server } from "socket.io";
import fs from "fs";

// Certificados HTTPS
const privateKey = fs.readFileSync(
  "/etc/letsencrypt/live/api.cafuntalk.com/privkey.pem",
  "utf8"
);
const certificate = fs.readFileSync(
  "/etc/letsencrypt/live/api.cafuntalk.com/fullchain.pem",
  "utf8"
);
const credentials = { key: privateKey, cert: certificate };

const app = express();
const server = createServer(credentials, app);
const io = new Server(server, {
  cors: { origin: "https://cafuntalk.com" },
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");

  socket.on("joinRoom", (room, userName) => {
    socket.join(room);

    users.set(socket.id, { userName, room });

    io.to(room).emit("message", {
      sender: "System",
      text: `${userName} joined the room.`,
      room: room,
      avatarIndex: null,
      system: true,
    });

    const count = Array.from(users.values()).filter(
      (u) => u.room === room
    ).length;
    io.to(room).emit("userCount", count);
  });

  socket.on("message", (data) => {
    console.log("Mensagem recebida:", data);
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const { userName, room } = user;

      io.to(room).emit("message", {
        sender: "System",
        text: `${userName} left the room.`,
        room: room,
        avatarIndex: null,
        system: true,
      });

      users.delete(socket.id);

      // Atualiza contagem
      const count = Array.from(users.values()).filter(
        (u) => u.room === room
      ).length;
      io.to(room).emit("userCount", count);
    }
    console.log("Usuário: ", socket.id, " desconectou!");
  });
});

server.listen(3001, () => {
  console.log("Servidor socket rodando na porta 3001");
});
