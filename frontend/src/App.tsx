// Chat.tsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Conversation from "./components/Conversation";
import MsgInput from "./components/MsgInput";

const socket = io("http://localhost:3001");

export default function App() {
  const [localMsg, setLocalMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);

  const [isComposing, setIsComposing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null!);

  const room = useRoomName();

  //Join Room
  useEffect(() => {
    if (room) {
      socket.emit("joinRoom", room);
    }
  }, [room]);

  //Send Message & Clean up
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

  if (userName) {
    return (
      <div className="flex flex-col h-screen bg-bgColor">
        <Header />

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
  } else {
    return (
      <Welcome
        inputRef={inputRef}
        inputName={inputName}
        setInputName={setInputName}
        setUserName={setUserName}
      />
    );
  }
}
