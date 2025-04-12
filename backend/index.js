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
const avatars = [
  "/pfps/1.jpeg",
  "/pfps/2.jpeg",
  "/pfps/3.jpeg",
  "/pfps/4.jpeg",
];

const getRandomAvatar = () => {
  const index = Math.floor(Math.random() * avatars.length);
  return avatars[index];
};

io.on("connection", (socket) => {
  console.log("Usuário: ", socket.id, " conectou!");
  const randomAvatar = getRandomAvatar();

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

  socket.on("message", async (data) => {
    console.log("Mensagem recebida:", data);

    const isValid = await isValidImageUrl(data.avatarUrl);
    const finalAvatar = isValid ? data.avatarUrl : randomAvatar;

    io.to(data.room).emit("message", {
      ...data,
      avatarUrl: finalAvatar,
    });
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

async function isValidImageUrl(url) {
  if (!url || url.trim() === "") {
    return false;
  }

  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("content-type") || "";
    return res.ok && contentType.startsWith("image/");
  } catch (err) {
    console.error("Erro ao validar imagem");
    return false;
  }
}

server.listen(3001, () => {
  console.log("Servidor socket rodando na porta 3001");
});
