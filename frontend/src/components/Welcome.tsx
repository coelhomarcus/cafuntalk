import { useRoomName } from "../hooks/useRoomName";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FaRandom } from "react-icons/fa";
import { FaImage } from "react-icons/fa";
import isImageUrl from "../utils/isImageUrl";

const Welcome = ({
  inputName,
  setInputName,
  setUserName,
  avatarUrl,
  setAvatarUrl,
}: TWelcome) => {
  const room = useRoomName();
  const [showModal, setShowModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(avatarUrl);
  const [imageError, setImageError] = useState(false);
  const [validatedUrl, setValidatedUrl] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Lista de avatares disponíveis em useMemo para evitar recriação a cada renderização
  const availableAvatars = useMemo(() => [
    "/pfps/1.webp",
    "https://avatars.githubusercontent.com/u/106438089?v=4",
    "https://i.pinimg.com/736x/90/43/58/904358a14809a275f0fe94c1f7efe69a.jpg",
    "https://i.pinimg.com/736x/42/4a/cc/424acce14cb9b9c3b479609aae3ca75d.jpg",
    "https://i.pinimg.com/736x/25/4c/7d/254c7d3e4737995ddd5292a3450f70ca.jpg",
    "https://i.pinimg.com/736x/14/8d/bc/148dbc3f26f601cdc13995ba435d8531.jpg",
  ], []);

  // Imagem padrão quando nenhuma estiver selecionada
  const defaultAvatar = "/pfps/1.webp";

  // Verifica se a URL é uma das imagens predefinidas
  const isPredefinedImage = useCallback((url: string) => {
    return availableAvatars.includes(url);
  }, [availableAvatars]);

  // Função para verificar se uma URL é uma imagem válida
  const validateImageUrl = useCallback((url: string) => {
    // Se for uma das imagens predefinidas, é válida
    if (isPredefinedImage(url)) {
      setImageError(false);
      setValidatedUrl(url);
      return;
    }

    // Verifica primeiro se parece uma URL de imagem válida
    if (!url.trim() || !isImageUrl(url)) {
      setImageError(true);
      setValidatedUrl(null);
      return;
    }

    // Tenta carregar a imagem para verificar se é válida
    const img = new Image();

    img.onload = () => {
      setImageError(false);
      setValidatedUrl(url);
    };

    img.onerror = () => {
      setImageError(true);
      setValidatedUrl(null);
    };

    img.src = url;
  }, [isPredefinedImage]);

  const generateRandomName = useCallback(() => {
    const adjectives = [
      "Radiante", "Astuto", "Veloz", "Místico", "Magnífico", "Vibrante",
      "Nobre", "Sereno", "Ágil", "Feroz"
    ]
    const nouns = [
      "Grifo", "Lince", "Falcão", "Dragão", "Pantera", "Cervo",
      "Fênix", "Lobo", "Corvo", "Tigre", "Coelho"
    ];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];

    setInputName(`${randomAdj}${randomNoun}`);
  }, [setInputName]);

  const handleAvatarClick = useCallback((avatar: string) => {
    setTempAvatarUrl(avatar);
    setImageError(false);
  }, []);

  const openAvatarModal = useCallback(() => {
    setTempAvatarUrl(avatarUrl || defaultAvatar);
    setImageError(false);
    setShowModal(true);
  }, [avatarUrl, defaultAvatar]);

  const saveAvatar = useCallback(() => {
    setAvatarUrl(tempAvatarUrl);
    setShowModal(false);
  }, [tempAvatarUrl, setAvatarUrl]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setTempAvatarUrl(newUrl);

    // Limpa o timer de debounce anterior, se existir
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    // Só valida se o usuário digitou algo e depois de um pequeno delay
    if (newUrl.trim()) {
      // Configura um novo timer para validar a URL após 500ms de inatividade
      debounceTimerRef.current = window.setTimeout(() => {
        validateImageUrl(newUrl);
      }, 500);
    } else {
      setImageError(false);
      setValidatedUrl(null);
    }
  }, [validateImageUrl]);

  // Limpa o timer de debounce quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Quando o modal é aberto, valida a URL atual se não for uma predefinida
  useEffect(() => {
    if (showModal && tempAvatarUrl) {
      // Verificamos se é uma URL predefinida
      if (isPredefinedImage(tempAvatarUrl)) {
        setImageError(false);
        setValidatedUrl(tempAvatarUrl);
      }
      // Se não for uma URL predefinida e for uma URL válida, tentamos validar
      else if (isImageUrl(tempAvatarUrl)) {
        validateImageUrl(tempAvatarUrl);
      }
    }
  }, [showModal, tempAvatarUrl, isPredefinedImage, validateImageUrl]);

  // Memo para o conteúdo do modal para evitar recriação a cada renderização
  const modalContent = useMemo(() => {
    if (!showModal) return null;

    // A URL da imagem a ser exibida é a validada ou a padrão
    const displayImageUrl = validatedUrl || defaultAvatar;

    return (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-bgColor border border-WelcomeBorder rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-textInput text-lg font-medium">Selecione uma imagem de perfil</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-desc hover:text-textInput"
            >
              ✕
            </button>
          </div>

          {/* Preview da imagem dentro do modal - sempre visível */}
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-WelcomeBorder relative">
              <img
                src={displayImageUrl}
                alt="Preview da imagem"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Mensagem de erro para URL inválida */}
          {imageError && (
            <p className="text-red-400 text-sm text-center mb-4">
              URL de imagem inválida. Escolha outra URL ou selecione uma das opções abaixo.
            </p>
          )}

          {/* Input de URL dentro do modal */}
          <div className="mb-4">
            <p className="text-textInput mb-2 text-sm">
              URL da imagem de perfil{" "}
              <span className="text-textInput/50 text-xs">(opcional)</span>
            </p>
            <input
              value={tempAvatarUrl}
              onChange={handleInputChange}
              className="w-full bg-inputBG border border-inputBorder px-4 py-2 rounded-lg focus:outline-none text-textInput placeholder-placeholder/50 mb-2"
              placeholder="cole a url da imagem aqui"
            />
          </div>

          <p className="text-textInput mb-2 text-sm">
            Ou escolha uma das opções abaixo:
          </p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {availableAvatars.map((avatar, index) => (
              <div
                key={index}
                onClick={() => handleAvatarClick(avatar)}
                className={`cursor-pointer p-2 rounded-lg border ${tempAvatarUrl === avatar ? 'border-user' : 'border-WelcomeBorder'
                  } hover:border-user transition-all`}
              >
                <div className="aspect-square w-full overflow-hidden rounded-lg">
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveAvatar}
              className="bg-sendInputBG text-sendInput px-4 py-2 rounded-lg hover:font-medium transition-all"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }, [showModal, imageError, validatedUrl, tempAvatarUrl, defaultAvatar, handleInputChange, availableAvatars, handleAvatarClick, saveAvatar]);

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center bg-dock">
      {/* Modal para seleção de avatar */}
      {modalContent}

      <div className="py-4 px-6 rounded-lg w-full max-w-sm sm:border sm:border-WelcomeBorder">
        <div className="flex justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_65_8)">
              <path d="M400 167.675C400 89.2 377.025 25.5 348.65 25C348.775 25 348.875 25 349 25H316.6C316.6 25 240.5 82.175 130.975 104.6C127.625 122.3 125.5 143.375 125.5 167.675C125.5 191.975 127.625 213.075 130.975 230.75C240.525 253.175 316.6 310.35 316.6 310.35H349C348.875 310.35 348.775 310.35 348.65 310.325C377.05 309.825 400 246.175 400 167.675ZM337.825 288.775C334.15 288.775 330.2 284.975 328.15 282.7C323.225 277.2 318.475 268.65 314.4 257.975C305.325 234.05 300.3 202 300.3 167.7C300.3 133.4 305.3 101.325 314.4 77.425C318.45 66.725 323.225 58.175 328.15 52.675C330.175 50.4 334.15 46.6 337.825 46.6C341.5 46.6 345.45 50.4 347.5 52.675C352.425 58.175 357.175 66.725 361.25 77.425C370.325 101.35 375.35 133.4 375.35 167.7C375.35 202 370.35 234.075 361.25 257.975C357.2 268.675 352.425 277.225 347.5 282.7C345.475 284.975 341.5 288.775 337.825 288.775ZM98.375 167.675C98.375 147.375 99.875 127.675 102.7 109.425C84.2 111.975 67.95 113.45 47.875 113.45C21.675 113.45 21.675 113.45 21.675 113.45L0 150.425V184.875L21.675 221.85C21.675 221.85 21.675 221.85 47.875 221.85C67.95 221.85 84.2 223.325 102.7 225.875C99.875 207.65 98.375 187.925 98.375 167.625V167.675ZM143.8 250.85L93.8 241.275L125.775 366.875C127.425 373.375 133.875 376.65 140.1 374.15L186.4 355.625C192.625 353.125 195.125 346.275 191.95 340.35L143.8 250.825V250.85Z" className="fill-user" />
            </g>
            <defs>
              <clipPath id="clip0_65_8">
                <rect width="400" height="400" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h1 className="text-3xl font-medium mb-4 text-center">
          <span className="text-user font-logo">Cafun</span>
          <span className="text-user font-logo">Talk</span>
        </h1>
        <p className="text-desc mb-1 text-sm">
          Espaço de bate-papo simples e direto
        </p>
        <p className="text-desc mb-1 text-sm">
          Este chat não mantém histórico — ao sair, as mensagens desaparecem.
        </p>
        <p className="text-desc mb-1 text-sm">
          Sala Atual: <span className="text-user">{room}</span>
        </p>
        <p className="text-desc mb-4 text-sm">
          Para trocar de sala, adicione{" "}
          <span className="text-user">/?nomesala</span> à URL.
        </p>

        <p className="text-textInput mb-2 text-sm">
          Escolha seu nome <span className="text-red-400">*</span>
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="w-full bg-inputBG border border-inputBorder px-4 py-2 rounded-lg focus:outline-none text-textInput placeholder-placeholder/50"
              placeholder="Light Yagami"
            />
            <button
              onClick={generateRandomName}
              className="bg-inputBG border border-inputBorder px-2 py-2 rounded-lg text-textInput hover:bg-inputBG/80 transition-all cursor-pointer"
              title="Gerar nome aleatório"
            >
              <FaRandom className="text-user" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-textInput mb-2 text-sm">
              Imagem de Perfil{" "}
              <span className="text-textInput/50 text-xs">(opcional)</span>
            </p>

            {/* Mostra miniatura da imagem escolhida */}
            {avatarUrl && (
              <div className="flex justify-center mb-2">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-WelcomeBorder">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <button
              onClick={openAvatarModal}
              className="w-full bg-inputBG border border-inputBorder px-4 py-2 rounded-lg text-textInput hover:bg-inputBG/80 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <span className="text-lg"><FaImage /></span> {avatarUrl ? "Alterar imagem de perfil" : "Escolher imagem de perfil"}
            </button>
          </div>

          <button
            onClick={() => inputName.trim() ? setUserName(inputName) : null}
            className={`w-full ${inputName.trim()
              ? "bg-sendInputBG text-sendInput hover:font-medium cursor-pointer"
              : "bg-sendInputBG/30 text-sendInput/40 cursor-not-allowed"} 
              px-4 py-2 rounded-lg 
              transition-all duration-300`}
            disabled={!inputName.trim()}
          >
            Entrar →
          </button>
        </div>
      </div>
      <div>
        <a href="https://coelhomarcus.com" target="_blank" className="text-xs text-desc underline">@coelhomarcus</a>
      </div>
    </div >
  );
};

export default Welcome;
