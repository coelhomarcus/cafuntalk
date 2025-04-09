import { useEffect, useRef } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import isImageUrl from "../utils/isImageUrl";
import isCode from "../utils/isCode";

const Conversation = ({ messages, userName, avatars }: TConversation) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor p-4 space-y-3">
      {messages.map((m, i) => {
        const isMe = m.sender === userName;
        const isImage = isImageUrl(m.text);
        const [lang, code] = isCode(m.text) ?? ["", ""];

        return (
          <div
            key={i}
            className={`flex ${isMe ? "justify-end" : "justify-start"}`}
          >
            {!isMe && (
              <div className="flex-shrink-0 mr-2">
                <img
                  src={avatars[m.avatarIndex]}
                  alt={`Avatar de ${m.sender}`}
                  className="w-12 h-12 rounded-full object-cover border border-borderColor"
                />
              </div>
            )}

            <div className={`flex flex-col max-w-[75%]`}>
              <p className="font-medium mb-1 text-sm text-gray-400 font-name">
                {m.sender}
              </p>
              <div
                className={`p-2 ${
                  isMe
                    ? "bg-user text-[#3B1F00] rounded-lg rounded-tr-none"
                    : "bg-friend text-[#1C1C1C] rounded-lg rounded-tl-none"
                }`}
              >
                {isImage ? (
                  <img src={m.text} alt="img" className="rounded-lg max-w-xs" />
                ) : code ? (
                  <SyntaxHighlighter
                    language={lang}
                    style={coldarkDark}
                    customStyle={{ margin: "0", fontSize: "0.9rem" }}
                    className="rounded-lg rounded-tr-none"
                    wrapLines={true}
                  >
                    {code}
                  </SyntaxHighlighter>
                ) : (
                  <pre className="text-xl font-message">{m.text}</pre>
                )}
                <div ref={bottomRef} />
              </div>
            </div>

            {isMe && (
              <div className="flex-shrink-0 ml-2">
                <img
                  src={avatars[m.avatarIndex]}
                  alt={`Avatar de ${m.sender}`}
                  className="w-12 h-12 rounded-full object-cover border border-borderColor"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Conversation;
