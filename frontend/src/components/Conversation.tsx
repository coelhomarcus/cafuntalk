import { useEffect, useRef } from "react";

import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/prism";

import ts from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import js from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import go from 'react-syntax-highlighter/dist/esm/languages/prism/go';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import py from 'react-syntax-highlighter/dist/esm/languages/prism/python';
import c from 'react-syntax-highlighter/dist/esm/languages/prism/c';
import csharp from 'react-syntax-highlighter/dist/esm/languages/prism/csharp';
import golang from 'react-syntax-highlighter/dist/esm/languages/prism/go';

SyntaxHighlighter.registerLanguage('ts', ts);
SyntaxHighlighter.registerLanguage('js', js);
SyntaxHighlighter.registerLanguage('go', go);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('py', py);
SyntaxHighlighter.registerLanguage('c', c);
SyntaxHighlighter.registerLanguage('csharp', csharp);
SyntaxHighlighter.registerLanguage('go', golang);

import isImageUrl from "../utils/isImageUrl";
import isCode from "../utils/isCode";
import renderMessage from "../utils/renderMessage";

const Conversation = ({ messages, userName }: TConversation) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Função para determinar se a mensagem inicia um novo grupo
  const isNewGroup = (currentIndex: number): boolean => {
    if (currentIndex === 0) return true;

    const currentMsg = messages[currentIndex];
    const prevMsg = messages[currentIndex - 1];

    // É um novo grupo se a mensagem anterior é do sistema ou de um remetente diferente
    return prevMsg.system || prevMsg.sender !== currentMsg.sender;
  };

  return (
    <div className="flex-1 overflow-y-scroll scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor py-4 px-2 pr-0.5">
      {messages.map((m, i) => {
        // Verificar se é uma mensagem do sistema
        if (m.system) {
          return (
            <div
              key={i}
              className="text-center text-[13px] text-desc italic my-3"
            >
              {m.text}
            </div>
          );
        }

        const avatar = m.avatarUrl;
        const isMe = m.sender === userName;
        const isImage = isImageUrl(m.text);
        const [lang, code] = isCode(m.text) ?? ["", ""];

        // Verificar se é uma nova mensagem de grupo
        const startsNewGroup = isNewGroup(i);

        // Verificar se a próxima mensagem é do mesmo remetente
        const nextMessage = i < messages.length - 1 ? messages[i + 1] : null;
        const endsGroup =
          !nextMessage ||
          nextMessage.system ||
          nextMessage.sender !== m.sender;

        // Espaçamento baseado na posição no grupo
        let spacingClass = "";
        if (startsNewGroup && endsGroup) {
          // Mensagem única (não faz parte de um grupo)
          spacingClass = "mb-3";
        } else if (startsNewGroup) {
          // Primeira mensagem de um grupo
          spacingClass = "mb-1";
        } else if (endsGroup) {
          // Última mensagem de um grupo
          spacingClass = "mb-3";
        } else {
          // Mensagem no meio de um grupo
          spacingClass = "mb-1";
        }

        // Se é uma mensagem consecutiva (não é a primeira do grupo)
        const isConsecutive = !startsNewGroup;

        return (
          <div
            key={i}
            className={`flex ${isMe ? "justify-end" : "justify-start"} ${spacingClass}`}
          >
            {/* Avatar à esquerda para mensagens de outros usuários (apenas se não for consecutiva) */}
            {!isMe && !isConsecutive && (
              <div className="flex-shrink-0 mr-2">
                <img
                  src={avatar}
                  alt={`Avatar de ${m.sender}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-friend"
                />
              </div>
            )}

            {/* Espaço reservado para manter o alinhamento quando o avatar está oculto */}
            {!isMe && isConsecutive && (
              <div className="flex-shrink-0 mr-2 w-10 sm:w-12"></div>
            )}

            <div className={`flex flex-col max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
              {/* Nome do usuário (apenas se não for consecutiva) */}
              {!isConsecutive && (
                <p
                  className={`font-medium mb-1 text-sm text-gray-400 font-name ${isMe ? "text-end" : "text-start"}`}
                >
                  {m.sender}
                </p>
              )}

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
                      style={nightOwl}
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
                </div>
              </div>
            </div>

            {/* Avatar à direita para minhas mensagens (apenas se não for consecutiva) */}
            {isMe && !isConsecutive && (
              <div className="flex-shrink-0 ml-2">
                <img
                  src={avatar}
                  alt={`Avatar de ${m.sender}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-user"
                />
              </div>
            )}

            {/* Espaço reservado para manter o alinhamento quando o avatar está oculto */}
            {isMe && isConsecutive && (
              <div className="flex-shrink-0 ml-2 w-10 sm:w-12"></div>
            )}
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default Conversation;