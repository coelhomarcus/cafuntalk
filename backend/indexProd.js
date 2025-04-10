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

const users = {};

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");

  socket.on("joinRoom", (room) => {
    console.log(room);
    socket.join(room);
  });

  socket.on("message", (data) => {
    console.log("Mensagem recebida:", data);
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Usuário: ", socket.id, " desconectou!");
  });
});

server.listen(3001, () => {
  console.log("Servidor socket rodando em http://localhost:3001");
});
