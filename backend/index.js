import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const users = {};

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");

  socket.on("message", (data) => {
    console.log("Mensagem recebida:", data);
    io.emit("message", data); // broadcast para todos os clientes
  });

  socket.on("disconnect", () => {
    console.log("Usuário: ", socket.id, " desconectou!");
  });
});

server.listen(3001, () => {
  console.log("Servidor socket rodando em http://localhost:3001");
});
