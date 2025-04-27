import { useState, useEffect, useRef } from "react";
import { IoSend } from "react-icons/io5";
import { FaSpinner, FaLink } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";


// Tipos
interface TMsgInput {
  localMsg: string;
  setLocalMsg: (msg: string) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  setIsComposing: (isComposing: boolean) => void;
  sendMessage: () => void;
}

interface LinkPreviewProps {
  url: string;
  onClose: () => void;
}

// Componente de Preview de Link
const LinkPreview = ({ url, onClose }: LinkPreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Verificar se é uma URL de imagem ou GIF
  const isImageUrl = /\.(jpeg|jpg|gif|png|webp)$/i.test(url);

  useEffect(() => {
    if (isImageUrl) {
      const img = new Image();
      img.onload = () => setLoading(false);
      img.onerror = () => setError(true);
      img.src = url;
    } else {
      setLoading(false);
    }
  }, [url, isImageUrl]);

  if (error) {
    return null;
  }

  if (loading) {
    return (
      <div className="p-2 border rounded mb-2 bg-bgColor border-inputBorder max-w-[32px] max-h-[32px]">
        <p className="text-xs text-lime-500"><FaSpinner className="animate-spin" /></p>
      </div>
    );
  }

  return (
    <div className="p-2 rounded-lg mb-2 bg-bgColor border border-inputBorder relative max-w-fit">
      < button
        className="absolute top-1 right-1 bg-bgColor text-white border border-lime-500 ring ring-lime-700 cursor-pointer rounded w-5 h-5 flex items-center justify-center text-sm"
        onClick={onClose}
      >
        <IoCloseSharp />
      </button >

      {
        isImageUrl ? (
          <div className="h-[100px] md:h-[200px] overflow-hidden" >
            <img src={url} alt="Preview" className="w-auto h-full rounded-lg" />
          </div>
        ) : (
          <div className="flex items-center">
            <div className="bg-bgColor p-2 rounded mr-2">
              <span className="text-xs"><FaLink className="text-white" /></span>
            </div>
            <p className="text-xs text-white truncate">{url}</p>
          </div>
        )}
    </div >
  );
};

const MsgInput = ({
  localMsg,
  setLocalMsg,
  handleKeyDown,
  setIsComposing,
  sendMessage,
}: TMsgInput) => {
  const [rows, setRows] = useState(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Função para extrair URLs do texto
  const extractUrl = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches ? matches[0] : null;
  };

  // Monitora mudanças no input para detectar URLs
  useEffect(() => {
    const url = extractUrl(localMsg);
    if (url) {
      setPreviewUrl(url);
    } else {
      // Se não houver URL no texto, remove o preview
      setPreviewUrl(null);
    }
  }, [localMsg]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalMsg(e.target.value);
    const value = e.target.value;
    const lineCount = value.split("\n").length;
    setRows(Math.min(lineCount, 4));
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const closePreview = () => {
    setPreviewUrl(null);
  };

  // Função de envio modificada para limpar o preview
  const handleSendMessage = () => {
    sendMessage();
    setRows(1);
    setPreviewUrl(null);
  };

  return (
    <div className="bg-bgColor p-3">
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
            className="w-full resize-none max-h-20 bg-transparent outline-none text-textInput placeholder-placeholder scrollbar-thin scrollbar-thumb-user scrollbar-track-bgColor"
            value={localMsg}
            rows={rows}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleKeyDown(e);
                setRows(1);
                setPreviewUrl(null); // Limpa o preview ao enviar com Enter
              }
            }}
            ref={inputRef}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Digite"
          />
        </div>
        <button
          className="bg-bgColor text-user font-medium py-4 px-4 rounded-lg border border-inputBorder hover:bg-bgColor hover:text-user hover:border-user transition-all duration-200 cursor-pointer hover:*:scale-130"
          onClick={handleSendMessage}
        >
          <IoSend className="duration-300 transition-all" />
        </button>
      </div>
    </div>
  );
};

export default MsgInput;