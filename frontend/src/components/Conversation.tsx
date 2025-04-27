import React, { useEffect, useRef } from "react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import isImageUrl from "../utils/isImageUrl";
import isCode from "../utils/isCode";
import renderMessage from "../utils/renderMessage";

const Conversation = ({ messages, userName }: TConversation) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor py-4 px-2 pr-0.5 space-y-3">
      {messages.map((m, i) => {
        if (m.system) {
          return (
            <div
              key={i}
              className="text-center text-[13px] text-gray-500 italic"
            >
              {m.text}
            </div>
          );
        }

        const avatar = m.avatarUrl;

        const isMe = m.sender === userName;
        const isImage = isImageUrl(m.text);
        const [lang, code] = isCode(m.text) ?? ["", ""];

        return (
          <React.Fragment key={i}>
            <div
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <div className="flex-shrink-0 mr-2">
                  <img
                    src={avatar}
                    alt={`Avatar de ${m.sender}`}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-friend"
                  />
                </div>
              )}
              <div className={`flex flex-col max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                <p
                  className={`font-medium mb-1 text-sm text-gray-400 font-name ${isMe ? "text-end" : "text-start"
                    }`}
                >
                  {m.sender}
                </p>
                <div className={`text-[15px] font-normal text-message font-message text-wrap break-all whitespace-pre-wrap`}>
                  <div
                    className={`p-1.5 rounded h-full flex items-center ${isMe
                      ? "bg-user text-messageUser"
                      : "bg-friend text-messageFriend"
                      }`}
                  >
                    {isImage ? (
                      <img
                        src={m.text}
                        alt="img"
                        className="rounded-lg w-full max-w-[200px] md:max-w-[300px] h-auto object-contain"
                        onLoad={() =>
                          bottomRef.current?.scrollIntoView({ behavior: "smooth" })
                        }
                      />
                    ) : code ? (
                      <SyntaxHighlighter
                        language={lang}
                        style={coldarkDark}
                        customStyle={{ margin: "0", fontSize: "0.9rem" }}
                        className="rounded"
                        wrapLines={true}
                      >
                        {code}
                      </SyntaxHighlighter>
                    ) : (
                      <p className="text-[15px] font-normal text-message font-message text-wrap break-words whitespace-pre-wrap">
                        {renderMessage(m.text, isMe)}
                      </p>
                    )}
                    <div ref={bottomRef} />
                  </div>
                </div>
              </div>


              {isMe && (
                <div className="flex-shrink-0 ml-2">
                  <img
                    src={avatar}
                    alt={`Avatar de ${m.sender}`}
                    className="w-10 h-10 rounded-lg object-cover border-2 border-user"
                  />
                </div>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Conversation;
