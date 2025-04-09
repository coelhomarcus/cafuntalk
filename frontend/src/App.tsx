// Chat.tsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";

import Header from "./components/Header";
import Welcome from "./components/Welcome";

const socket = io("http://localhost:3001");

type Message = {
  sender: string;
  text: string;
  room: string;
};

export default function App() {
  const room = useRoomName();
  socket.emit("joinRoom", room);

  const [localMsg, setLocalMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);

  const [isComposing, setIsComposing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
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

  function isImageUrl(text: string) {
    return text.match(/\.(jpeg|jpg|gif|png|webp)$/i);
  }

  if (userName) {
    return (
      <div className="flex flex-col h-screen bg-bgColor">
        <Header />
        {/* Área do chat/scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor p-4 space-y-3">
          {messages.map((m, i) => {
            const isMe = m.sender === userName;
            const isImage = isImageUrl(m.text);

            return (
              <div
                key={i}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <p className="font-medium mb-1 text-sm text-gray-400 font-name">
                  {m.sender}
                </p>
                <div
                  className={`max-w-[75%] p-3 ${
                    isMe
                      ? "bg-user text-[#3B1F00] rounded-lg rounded-tr-none"
                      : "bg-friend text-[#1C1C1C] rounded-lg rounded-tl-none"
                  }`}
                >
                  {isImage ? (
                    <img
                      src={m.text}
                      alt="img"
                      className="rounded-lg max-w-xs"
                    />
                  ) : (
                    <p className="text-xl font-message">{m.text}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Input fixado no final */}
        <div className="bg-bgColor border-t border-borderColor p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-bgInput border border-borderColor rounded px-4 py-2">
              <input
                className="w-full bg-transparent outline-none text-textInput placeholder-placeholder"
                value={localMsg}
                onChange={(e) => setLocalMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleKeyDown(e);
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                placeholder="Type your message..."
              />
            </div>
            <button
              className="bg-user text-bgColor font-medium py-2 px-4 rounded-md border border-user shadow-sm hover:bg-bgColor hover:text-user hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
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
