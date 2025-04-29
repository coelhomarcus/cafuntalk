"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { IoSend } from "react-icons/io5"
import { FaSpinner, FaLink } from "react-icons/fa"
import { IoCloseSharp } from "react-icons/io5"
import StickerPicker from "./StickerPicker"
import { PiStickerFill } from "react-icons/pi";
import { useRoomName } from "../hooks/useRoomName";

// Custom hook para placeholder responsivo
const useResponsivePlaceholder = (room: string) => {
  const [placeholder, setPlaceholder] = useState(`Conversar no #${room}`);

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 310) { // Breakpoint para dispositivos móveis
        setPlaceholder(`Mensagem`);
      } else {
        setPlaceholder(`Conversar no #${room}`);
      }
    };

    // Definir o placeholder inicial
    updatePlaceholder();

    // Atualizar o placeholder quando a tela for redimensionada
    window.addEventListener('resize', updatePlaceholder);

    // Cleanup
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, [room]);

  return placeholder;
};

// Tipos
interface TMsgInput {
  localMsg: string
  setLocalMsg: (msg: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  setIsComposing: (isComposing: boolean) => void
  sendMessage: (msg?: string) => void
}

interface LinkPreviewProps {
  url: string
  onClose: () => void
}

// Componente de Preview de Link
const LinkPreview = ({ url, onClose }: LinkPreviewProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Verificar se é uma URL de imagem ou GIF
  const isImageUrl = /\.(jpeg|jpg|gif|png|webp)$/i.test(url)

  useEffect(() => {
    if (isImageUrl) {
      const img = new Image()
      img.onload = () => setLoading(false)
      img.onerror = () => setError(true)
      img.src = url
    } else {
      setLoading(false)
    }
  }, [url, isImageUrl])

  if (error) {
    return null
  }

  if (loading) {
    return (
      <div className="absolute bottom-full mb-2 left-0 p-2 border rounded bg-bgColor border-inputBorder w-[32px] h-[32px] flex items-center justify-center z-20">
        <p className="text-user">
          <FaSpinner className="animate-spin" />
        </p>
      </div>
    )
  }

  return (
    <div className="absolute bottom-full mb-2 left-0 p-3 rounded-lg bg-bgColor border border-inputBorder max-w-[320px] shadow-lg z-20">
      <button
        className="absolute top-2 right-2 bg-bgColor text-textInput border border-user ring ring-user/50 cursor-pointer rounded w-6 h-6 flex items-center justify-center z-10"
        onClick={onClose}
      >
        <IoCloseSharp />
      </button>

      {isImageUrl ? (
        <div className="max-h-[250px] overflow-hidden">
          <img
            src={url || "/placeholder.svg"}
            alt="Preview"
            className="w-auto max-h-[250px] max-w-full rounded-lg object-contain"
          />
        </div>
      ) : (
        <div className="flex items-center max-w-full">
          <div className="bg-bgColor p-2 rounded mr-2 flex-shrink-0">
            <FaLink className="text-textInput" size={18} />
          </div>
          <p className="text-sm text-textInput break-all">{url}</p>
        </div>
      )}
    </div>
  )
}

const MsgInput = ({ localMsg, setLocalMsg, handleKeyDown, setIsComposing, sendMessage }: TMsgInput) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isStickerPickerOpen, setIsStickerPickerOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const room = useRoomName();
  const placeholder = useResponsivePlaceholder(room);

  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const matches = text.match(urlRegex)
    return matches ? matches[0] : null
  }

  useEffect(() => {
    const url = extractUrl(localMsg)
    if (url) {
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }, [localMsg])

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalMsg(e.target.value)
    setTimeout(adjustTextareaHeight, 0)
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [localMsg])

  const closePreview = () => {
    setPreviewUrl(null)
  }

  const handleSendMessage = () => {
    sendMessage()
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
    setPreviewUrl(null)
  }

  const toggleStickerPicker = () => {
    setIsStickerPickerOpen(!isStickerPickerOpen)
  }

  const handleStickerSelect = (stickerUrl: string) => {
    // Enviar a figurinha diretamente sem atualizar o campo de texto primeiro
    // Isso evita o problema de timing com o setState seguido de sendMessage
    sendMessage(stickerUrl)
    setIsStickerPickerOpen(false)
  }

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Fechar sticker picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsStickerPickerOpen(false)
      }
    }

    if (isStickerPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isStickerPickerOpen])

  return (
    <div className="bg-transparent p-3 pb-4">
      {/* Área de input com botões */}
      <div className="flex items-center">
        <div ref={containerRef} className="relative flex-1">
          {/* Seletor de figurinhas */}
          <StickerPicker
            isOpen={isStickerPickerOpen}
            onClose={() => setIsStickerPickerOpen(false)}
            onStickerSelect={handleStickerSelect}
          />

          {/* Preview de links como modal flutuante */}
          {previewUrl && (
            <LinkPreview url={previewUrl} onClose={closePreview} />
          )}

          <div className={`flex items-center bg-bgColor border rounded-lg py-1 ${isFocused ? 'border-user/30' : 'border-inputBorder'} transition-colors`}>
            {/* Botão de figurinhas dentro do input */}
            <div className="px-3">
              <button
                className="text-placeholder hover:text-user font-medium p-1 transition-colors cursor-pointer"
                onClick={toggleStickerPicker}
                aria-label="Abrir seletor de figurinhas"
              >
                <PiStickerFill className="text-xl" />
              </button>
            </div>

            {/* Input de mensagem */}
            <div className="flex-1 py-1 px-2">
              <textarea
                ref={textareaRef}
                className="w-full resize-none bg-transparent outline-none text-textInput placeholder-placeholder/50 scrollbar-thin scrollbar-thumb-user scrollbar-track-bgColor min-h-[24px] max-h-[150px] overflow-y-auto transition-height duration-100 py-1"
                value={localMsg}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    handleKeyDown(e)
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto"
                    }
                    setPreviewUrl(null)
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                rows={1}
              />
            </div>

            {/* Botão de enviar dentro do input */}
            <div className="pr-3">
              <button
                className="text-user font-medium p-1 transition-colors cursor-pointer hover:scale-110"
                onClick={handleSendMessage}
              >
                <IoSend className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MsgInput
