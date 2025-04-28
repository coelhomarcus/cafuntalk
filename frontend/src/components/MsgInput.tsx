"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { IoSend } from "react-icons/io5"
import { FaSpinner, FaLink, FaRegSmile } from "react-icons/fa"
import { IoCloseSharp } from "react-icons/io5"
import StickerPicker from "./StickerPicker"

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
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus()
  }, [])

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
    <div className="bg-transparent p-3">
      {/* Área de input com botões */}
      <div className="flex items-center gap-2">
        {/* Botão de figurinhas - agora separado do campo de texto */}
        <div ref={containerRef} className="relative">
          {/* Seletor de figurinhas */}
          <StickerPicker
            isOpen={isStickerPickerOpen}
            onClose={() => setIsStickerPickerOpen(false)}
            onStickerSelect={handleStickerSelect}
          />

          <button
            className="bg-bgColor text-placeholder hover:text-user font-medium py-4 px-4 rounded-lg border border-inputBorder transition-colors cursor-pointer hover:bg-inputBG"
            onClick={toggleStickerPicker}
            aria-label="Abrir seletor de figurinhas"
          >
            <FaRegSmile size={18} />
          </button>
        </div>

        {/* Campo de entrada de texto */}
        <div className="relative flex-1">
          {/* Preview de links como modal flutuante */}
          {previewUrl && (
            <LinkPreview url={previewUrl} onClose={closePreview} />
          )}

          <div className="flex items-center bg-bgColor border border-inputBorder rounded-lg">
            {/* Input de mensagem */}
            <div className="flex-1 py-2 px-3">
              <textarea
                ref={textareaRef}
                className="w-full resize-none bg-transparent outline-none text-textInput placeholder-placeholder scrollbar-thin scrollbar-thumb-user scrollbar-track-bgColor min-h-[24px] max-h-[150px] overflow-y-auto transition-height duration-100"
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
                placeholder="Digite"
                rows={1}
              />
            </div>
          </div>
        </div>

        {/* Botão de enviar */}
        <button
          className="bg-bgColor text-user font-medium py-4 px-4 rounded-lg border border-inputBorder transition-transform duration-200 cursor-pointer hover:*:scale-125"
          onClick={handleSendMessage}
        >
          <IoSend />
        </button>
      </div>
    </div>
  )
}

export default MsgInput
