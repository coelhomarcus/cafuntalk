"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { IoSend } from "react-icons/io5"
import { FaSpinner, FaLink } from "react-icons/fa"
import { IoCloseSharp } from "react-icons/io5"

// Tipos
interface TMsgInput {
  localMsg: string
  setLocalMsg: (msg: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  setIsComposing: (isComposing: boolean) => void
  sendMessage: () => void
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
      <div className="p-2 border rounded mb-2 bg-bgColor border-inputBorder max-w-[32px] max-h-[32px]">
        <p className="text-xs text-user">
          <FaSpinner className="animate-spin" />
        </p>
      </div>
    )
  }

  return (
    <div className="p-2 rounded-lg mb-2 bg-bgColor border border-inputBorder relative max-w-fit">
      <button
        className="absolute top-1 right-1 bg-bgColor text-textInput border border-user ring ring-user/50 cursor-pointer rounded w-5 h-5 flex items-center justify-center text-sm"
        onClick={onClose}
      >
        <IoCloseSharp />
      </button>

      {isImageUrl ? (
        <div className="h-[100px] md:h-[200px] overflow-hidden">
          <img src={url || "/placeholder.svg"} alt="Preview" className="w-auto h-full rounded-lg" />
        </div>
      ) : (
        <div className="flex items-center">
          <div className="bg-bgColor p-2 rounded mr-2">
            <span className="text-xs">
              <FaLink className="text-textInput" />
            </span>
          </div>
          <p className="text-xs text-textInput truncate">{url}</p>
        </div>
      )}
    </div>
  )
}

const MsgInput = ({ localMsg, setLocalMsg, handleKeyDown, setIsComposing, sendMessage }: TMsgInput) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  return (
    <div className="bg-transparent p-3">
      {/* Preview aparece ACIMA do input */}
      {previewUrl && (
        <div className="mb-2">
          <LinkPreview url={previewUrl} onClose={closePreview} />
        </div>
      )}

      {/* Mantendo a estrutura original do input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-bgColor border border-inputBorder rounded-lg px-4 py-2">
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
        <button
          className="bg-bgColor text-user font-medium py-4 px-4 rounded-lg border border-inputBorder transition-transform duration-200 cursor-pointer hover:*:scale-130"
          onClick={handleSendMessage}
        >
          <IoSend />
        </button>
      </div>
    </div>
  )
}

export default MsgInput
