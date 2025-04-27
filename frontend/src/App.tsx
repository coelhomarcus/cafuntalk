import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";
import { commands } from "./utils/commands";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Conversation from "./components/Conversation";
import MsgInput from "./components/MsgInput";


//PROD
const socket: Socket = io("https://api.cafuntalk.com:3001");

//DEV
// const socket: Socket = io("http://localhost:3001");

export default function App() {
  const [localMsg, setLocalMsg] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputName, setInputName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userCount, setUserCount] = useState<number>(0);
  const [isComposing, setIsComposing] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const room = useRoomName();

  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const pageTitle = useRef<string>(document.title);

  useEffect(() => {
    if (userName && "Notification" in window) {
      if (Notification.permission === "granted") {
        setNotificationsEnabled(true);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          setNotificationsEnabled(permission === "granted");
        });
      }
    }

    notificationSound.current = new Audio("/notification.mp3");
  }, [userName]);

  useEffect(() => {
    const handleFocus = (): void => {
      setIsWindowFocused(true);
      setUnreadCount(0);
      document.title = pageTitle.current;
    };

    const handleBlur = (): void => {
      setIsWindowFocused(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  //Join Room & Count
  useEffect(() => {
    if (room && userName) {
      socket.emit("joinRoom", room, userName);

      const handleUserCount = (count: number): void => {
        setUserCount(count);
      };

      socket.on("userCount", handleUserCount);

      return () => {
        socket.off("userCount", handleUserCount);
      };
    }
  }, [room, userName]);

  //SetMessage e gerenciar notificações
  useEffect(() => {
    const handleMessage = (data: Message): void => {
      setMessages((prev) => [...prev, data]);


      if (data.sender !== userName && !data.system) {
        if (notificationSound.current) {
          notificationSound.current.play().catch(e => console.log("Erro ao tocar som:", e));
        }

        if (!isWindowFocused) {
          const newCount = unreadCount + 1;
          setUnreadCount(newCount);
          document.title = `(${newCount}) ${pageTitle.current}`;

          if (notificationsEnabled) {
            const notification = new Notification(`Nova mensagem de ${data.sender}`, {
              body: data.text,
              icon: data.avatarUrl || "/favicon.ico"
            });

            notification.onclick = () => {
              window.focus();
            };
          }
        }
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [userName, isWindowFocused, unreadCount, notificationsEnabled]);

  const sendMessage = async (): Promise<void> => {
    if (!localMsg.trim()) return;

    const [isSystem, message] = commands(localMsg);

    socket.emit("message", {
      system: isSystem,
      sender: userName,
      text: message,
      room: room,
      avatarUrl: avatarUrl,
    });

    setLocalMsg("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
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
    return <Welcome
      inputName={inputName}
      setInputName={setInputName}
      setUserName={setUserName}
      avatarUrl={avatarUrl}
      setAvatarUrl={setAvatarUrl}
    />;
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-bgColor">
      {/* Header */}
      <Header online={userCount} />

      {/* Chat */}
      <Conversation
        messages={messages}
        userName={userName}
      />

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