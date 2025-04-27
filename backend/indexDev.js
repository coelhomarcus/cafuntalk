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

    users.set(socket.id, { userName, room });

    io.to(room).emit("message", {
      sender: "System",
      text: `${userName} entrou na sala.`,
      room: room,
      avatarIndex: null,
      system: true,
    });

    const count = Array.from(users.values()).filter(
      (u) => u.room === room
    ).length;
    io.to(room).emit("userCount", count);
  });

  socket.on("message", async (data) => {
    console.log("Mensagem recebida:", data);

    const avatarMap = {
      marcus: "https://avatars.githubusercontent.com/u/106438089?v=4",
      vitoria: "https://i.pinimg.com/736x/90/43/58/904358a14809a275f0fe94c1f7efe69a.jpg",

    };

    let customAvatar = avatarMap[data.avatarUrl];

    if (!customAvatar) {
      const isValid = await isValidImageUrl(data.avatarUrl);
      customAvatar = isValid ? data.avatarUrl : "/pfps/1.webp";
    }

    io.to(data.room).emit("message", {
      ...data,
      avatarUrl: customAvatar,
    });
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      const { userName, room } = user;

      io.to(room).emit("message", {
        sender: "System",
        text: `${userName} saiu da sala.`,
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

async function isValidImageUrl(url) {
  if (!url || url.trim() === "") return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const contentType = res.headers.get("content-type") || "";
    return res.ok && contentType.startsWith("image/");
  } catch (err) {
    console.error("Erro ao validar imagem:", err.message || err);
    return false;
  }
}
