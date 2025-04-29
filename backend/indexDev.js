import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const users = new Map();

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");

  socket.on("joinRoom", (room, userName) => {
    socket.join(room);

    users.set(socket.id, { userName, room, avatarUrl: null });

    io.to(room).emit("message", {
      sender: "System",
      text: `${userName} entrou na sala.`,
      room: room,
      avatarUrl: null,
      system: true,
    });

    // Enviar lista atualizada de usuários
    const roomUsers = Array.from(users.values())
      .filter((u) => u.room === room)
      .map(u => ({ userName: u.userName, avatarUrl: u.avatarUrl }));

    const count = roomUsers.length;
    io.to(room).emit("userCount", count);
    io.to(room).emit("userList", roomUsers);
  });

  socket.on("message", async (data) => {
    console.log("Mensagem recebida:", data);

    // Atualizar o avatarUrl do usuário
    if (users.has(socket.id)) {
      const user = users.get(socket.id);
      user.avatarUrl = data.avatarUrl;
      users.set(socket.id, user);
    }

    // Retransmite a mensagem com o avatarUrl enviado pelo frontend
    io.to(data.room).emit("message", {
      ...data
    });
  });

  socket.on("requestUserList", (room) => {
    // Quando um cliente solicita a lista de usuários
    const roomUsers = Array.from(users.values())
      .filter((u) => u.room === room)
      .map(u => ({ userName: u.userName, avatarUrl: u.avatarUrl }));

    socket.emit("userList", roomUsers);
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const { userName, room } = user;

      io.to(room).emit("message", {
        sender: "System",
        text: `${userName} saiu da sala.`,
        room: room,
        avatarUrl: null,
        system: true,
      });

      users.delete(socket.id);

      // Atualiza contagem e lista de usuários
      const roomUsers = Array.from(users.values())
        .filter((u) => u.room === room)
        .map(u => ({ userName: u.userName, avatarUrl: u.avatarUrl }));

      const count = roomUsers.length;
      io.to(room).emit("userCount", count);
      io.to(room).emit("userList", roomUsers);
    }
    console.log("Usuário: ", socket.id, " desconectou!");
  });
});

server.listen(3001, () => {
  console.log("Servidor socket rodando na porta 3001");
});
