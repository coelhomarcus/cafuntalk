import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import { useRoomName } from "../src/hooks/useRoomName";
import { commands } from "./utils/commands";
import { ThemeProvider } from "./contexts/ThemeContext";

import Header from "./components/Header";
import Welcome from "./components/Welcome";
import Conversation from "./components/Conversation";
import MsgInput from "./components/MsgInput";

//PROD
// const socket: Socket = io("https://api.cafuntalk.com:3001");

//DEV
const socket: Socket = io("http://192.168.1.2:3001");
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

  // Controle de notificações
  const lastNotificationTime = useRef<number>(0);
  const notificationQueue = useRef<Message[]>([]);
  const notificationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const NOTIFICATION_DELAY = 3000; // 3 segundos entre notificações

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

  // Função para processar a fila de notificações (usando useCallback para referência estável)
  const processNotificationQueue = useCallback(() => {
    if (notificationQueue.current.length === 0 || isWindowFocused) {
      notificationTimeout.current = null;
      return;
    }

    const now = Date.now();
    if (now - lastNotificationTime.current >= NOTIFICATION_DELAY) {
      const pendingMessages = notificationQueue.current;
      notificationQueue.current = [];

      // Se há mais de uma mensagem, agrupe-as
      if (pendingMessages.length > 1) {
        const senders = [...new Set(pendingMessages.map(msg => msg.sender))];

        if (notificationSound.current) {
          notificationSound.current.play().catch(e => console.log("Erro ao tocar som:", e));
        }

        if (notificationsEnabled) {
          const notification = new Notification(
            `${pendingMessages.length} novas mensagens`,
            {
              body: `De ${senders.join(", ")}`,
              icon: "/icons/logo.svg"
            }
          );

          notification.onclick = () => {
            window.focus();
          };
        }
      } else if (pendingMessages.length === 1) {
        // Apenas uma mensagem, mostrar normalmente
        const message = pendingMessages[0];

        if (notificationSound.current) {
          notificationSound.current.play().catch(e => console.log("Erro ao tocar som:", e));
        }

        if (notificationsEnabled) {
          const notification = new Notification(
            `${message.sender}`,
            {
              body: message.text,
              icon: message.avatarUrl || "/icons/logo.svg"
            }
          );

          notification.onclick = () => {
            window.focus();
          };
        }
      }

      lastNotificationTime.current = now;
    }

    // Configurar o próximo processamento da fila
    notificationTimeout.current = setTimeout(
      processNotificationQueue,
      NOTIFICATION_DELAY - (Date.now() - lastNotificationTime.current)
    );
  }, [isWindowFocused, notificationsEnabled]);

  useEffect(() => {
    const handleFocus = (): void => {
      setIsWindowFocused(true);
      setUnreadCount(0);
      document.title = pageTitle.current;

      // Limpar fila de notificações quando a janela recebe foco
      notificationQueue.current = [];
      if (notificationTimeout.current) {
        clearTimeout(notificationTimeout.current);
        notificationTimeout.current = null;
      }
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
        if (!isWindowFocused) {
          // Atualizar contador de não lidas e título
          const newCount = unreadCount + 1;
          setUnreadCount(newCount);
          document.title = `(${newCount}) ${pageTitle.current}`;

          // Adicionar à fila de notificações
          notificationQueue.current.push(data);

          // Iniciar processamento da fila se não estiver em andamento
          if (!notificationTimeout.current) {
            notificationTimeout.current = setTimeout(processNotificationQueue, 0);
          }
        }
      }
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [userName, isWindowFocused, unreadCount, processNotificationQueue]);

  const sendMessage = async (): Promise<void> => {
    if (!localMsg.trim()) return;

    const [isSystem, message] = commands(localMsg);

    // Usar o avatar padrão se nenhum foi selecionado
    const defaultAvatar = "/pfps/1.webp";
    const finalAvatarUrl = avatarUrl || defaultAvatar;

    socket.emit("message", {
      system: isSystem,
      sender: userName,
      text: message,
      room: room,
      avatarUrl: finalAvatarUrl,
    });

    setLocalMsg("");
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
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

  // Envolver tudo em ThemeProvider para fornecer contexto de tema para todos os componentes
  return (
    <ThemeProvider>
      {!userName ? (
        <Welcome
          inputName={inputName}
          setInputName={setInputName}
          setUserName={setUserName}
          avatarUrl={avatarUrl}
          setAvatarUrl={setAvatarUrl}
        />
      ) : (
        <div className="flex flex-col h-[100dvh] bg-bgColor">
          {/* Header com o seletor de tema */}
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
      )}
    </ThemeProvider>
  );
}