// Chat.tsx
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "./components/Header";
import Welcome from "./components/Welcome";

const socket = io("http://localhost:3001");

type Message = {
  sender: string;
  text: string;
};

export default function App() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]); // data = { sender, text }
    });
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;

    socket.emit("message", {
      sender: userName,
      text: msg,
    });

    setMsg("");
  };

  if (userName) {
    return (
      <div className="flex flex-col h-screen bg-[#131313]">
        <Header />
        {/* Área do chat/scroll */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#303030] scrollbar-track-[#131313] p-4 space-y-3">
          {messages.map((m, i) => {
            const isMe = m.sender === userName;

            return (
              <div
                key={i}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <p className="font-medium mb-1 text-sm text-gray-400">
                  {m.sender}
                </p>
                <div
                  className={`max-w-[75%] p-3 ${
                    isMe
                      ? "bg-[#FFB085] text-[#1C1C1C] rounded-2xl rounded-tr-none"
                      : "bg-[#C8A2FF] text-[#1C1C1C] rounded-2xl rounded-tl-none"
                  }`}
                >
                  <p className="text-xl">{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input fixado no final */}
        <div className="bg-[#131313] border-t border-[#303030] p-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#191919] border border-[#303030] rounded px-4 py-2">
              <input
                className="w-full bg-transparent outline-none text-gray-200 placeholder-gray-400"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                placeholder="Digite sua mensagem..."
              />
            </div>
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              onClick={sendMessage}
            >
              Enviar
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
