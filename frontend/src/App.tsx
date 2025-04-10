// Chat.tsx
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";
import { getRandomAvatar } from "./utils/avatarUtils";
import { isValidImageUrl } from "../src/utils/avatarUtils";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Conversation from "./components/Conversation";
import MsgInput from "./components/MsgInput";

//PROD
// const socket = io("https://api.cafuntalk.com:3001");

//DEV
const socket = io("http://localhost:3001");
const avatarRandomized = getRandomAvatar();

export default function App() {
  const [localMsg, setLocalMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
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

  const sendMessage = async () => {
    if (!localMsg.trim()) return;

    const isValid = await isValidImageUrl(avatarUrl);
    const finalAvatar = isValid ? avatarUrl : avatarRandomized;

    socket.emit("message", {
      sender: userName,
      text: localMsg,
      room: room,
      avatarUrl: finalAvatar,
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
        inputName={inputName}
        setInputName={setInputName}
        setUserName={setUserName}
        avatarUrl={avatarUrl}
        setAvatarUrl={setAvatarUrl}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bgColor">
      {/* Chat */}
      <Header online={userCount} />

      {/* Chat */}
      <Conversation messages={messages} userName={userName} />

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
