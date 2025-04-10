// Chat.tsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Conversation from "./components/Conversation";
import MsgInput from "./components/MsgInput";

//PROD
// const socket = io("https://api.coelhomarcus.com:3001");

// //DEV
const socket = io("http://localhost:3001");

const avatars = [
  "https://i.pinimg.com/736x/6c/74/10/6c74100c2039f9352bfc2bcbb766d813.jpg",
  "https://tr.rbxcdn.com/180DAY-596e34a607016d245c74aa2976662af6/420/420/Hat/Webp/noFilter",
  "https://tr.rbxcdn.com/b26e419134c49a0f6c2bbfc24aaf9c8a/420/420/Hat/Png",
  "https://tr.rbxcdn.com/180DAY-f98adbee32f29755aa3a0f09a35d71df/420/420/Hat/Png/noFilter",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5Hnnmn8d6CCWP0eYNnRxZwl6GfkbO6hfwRg&s",
];

const index = Math.floor(Math.random() * (avatars.length - 1));

export default function App() {
  const [localMsg, setLocalMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null!);
  const room = useRoomName();

  //Join Room & Count
  useEffect(() => {
    if (room && userName) {
      socket.emit("joinRoom", room, userName);

      const handleUserCount = (count: number) => {
        setUserCount(count);
      };

      socket.on("userCount", handleUserCount);

      return () => {
        socket.off("userCount", handleUserCount);
      };
    }
  }, [room, userName]);

  //SetMessage
  useEffect(() => {
    const handleMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const sendMessage = () => {
    if (!localMsg.trim()) return;

    socket.emit("message", {
      sender: userName,
      text: localMsg,
      room: room,
      avatarIndex: index,
    });

    setLocalMsg("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedMsg = localMsg.trim();
      if (!trimmedMsg || trimmedMsg === "'") {
        setLocalMsg("");
        return;
      }
      sendMessage();
    }
  };

  if (!userName) {
    return (
      <Welcome
        inputRef={inputRef}
        inputName={inputName}
        setInputName={setInputName}
        setUserName={setUserName}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bgColor">
      {/* Chat */}
      <Header online={userCount} />

      {/* Chat */}
      <Conversation messages={messages} userName={userName} avatars={avatars} />

      {/* Input */}
      <MsgInput
        localMsg={localMsg}
        setLocalMsg={setLocalMsg}
        handleKeyDown={handleKeyDown}
        setIsComposing={setIsComposing}
        sendMessage={sendMessage}
      />
    </div>
  );
}
