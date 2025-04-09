import { useEffect, useRef } from "react";

import isImageUrl from "../utils/isImageUrl";

const Conversation = ({ messages, userName }: TConversation) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor p-4 space-y-3">
      {messages.map((m, i) => {
        const isMe = m.sender === userName;
        const isImage = isImageUrl(m.text);

        return (
          <div
            key={i}
            className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
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
                <img src={m.text} alt="img" className="rounded-lg max-w-xs" />
              ) : (
                <p className="text-xl font-message">{m.text}</p>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Conversation;
