import { useRoomName } from "../hooks/useRoomName";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { FaRandom, FaImage } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import isImageUrl from "../utils/isImageUrl";

const Welcome = ({
  inputName,
  setInputName,
  setUserName,
  avatarUrl,
  setAvatarUrl,
  onlineUsers = []
}: TWelcome) => {
  const room = useRoomName();
  const [showModal, setShowModal] = useState(false);
  const [tempAvatarUrl, setTempAvatarUrl] = useState(avatarUrl);
  const [imageError, setImageError] = useState(false);
  const [validatedUrl, setValidatedUrl] = useState<string | null>(null);
  const [isDuplicateName, setIsDuplicateName] = useState(false);
  const [rememberUser, setRememberUser] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);

  // Lista de avatares disponíveis em useMemo para evitar recriação a cada renderização
  const availableAvatars = useMemo(() => [
    "/pfps/1.webp",
    "https://i.pinimg.com/736x/5a/96/db/5a96dbe94ea4c78bd65dc1017d74ebad.jpg",
    "https://i.pinimg.com/736x/ff/df/7d/ffdf7d08253c94624da3195e16580e17.jpg",
    "https://i.pinimg.com/736x/6f/43/42/6f43425273d9793b02486f39d3425068.jpg",
    "https://i.pinimg.com/736x/5d/e4/53/5de45337c873cdd1e69311bc2861a2b5.jpg",
    "https://i.pinimg.com/736x/24/43/94/2443943ec22d02e496e8ee41f7ab1ff5.jpg",
  ], []);

  // Imagem padrão quando nenhuma estiver selecionada
  const defaultAvatar = "/pfps/1.webp";

  // Carregar dados salvos do localStorage quando o componente é montado
  useEffect(() => {
    const savedRememberUser = localStorage.getItem('cafuntalk_remember_user');
    if (savedRememberUser === 'true') {
      setRememberUser(true);

      const savedName = localStorage.getItem('cafuntalk_username');
      const savedAvatar = localStorage.getItem('cafuntalk_avatar');

      if (savedName) {
        setInputName(savedName);
      }

      if (savedAvatar) {
        setAvatarUrl(savedAvatar);
        setTempAvatarUrl(savedAvatar);
      }
    }
  }, [setInputName, setAvatarUrl]);

  // Verifica se a URL é uma das imagens predefinidas
  const isPredefinedImage = useCallback((url: string) => {
    return availableAvatars.includes(url);
  }, [availableAvatars]);

  // Verificar duplicação de nome de usuário
  useEffect(() => {
    if (inputName.trim()) {
      const isDuplicate = onlineUsers.some(
        user => user.userName.toLowerCase() === inputName.trim().toLowerCase()
      );
      setIsDuplicateName(isDuplicate);
    } else {
      setIsDuplicateName(false);
    }
  }, [inputName, onlineUsers]);

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
    const nouns = [
      "Veloz", "Nobre", "Ágil", "Feroz", "Branco", "Sombrio"
    ]
    const adjectives = [
      "Grifo", "Lince", "Falcão", "Cervo",
      "Fênix", "Lobo", "Corvo", "Tigre", "Coelho"
    ];

    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomName = `${randomAdj} ${randomNoun}`;

    setInputName(randomName);
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

  // Salvar ou remover dados do usuário no localStorage quando entrar
  const handleEnterChat = useCallback(() => {
    if (inputName.trim() && !isDuplicateName) {
      // Se a opção de lembrar estiver ativada, salva os dados
      if (rememberUser) {
        localStorage.setItem('cafuntalk_remember_user', 'true');
        localStorage.setItem('cafuntalk_username', inputName);
        if (avatarUrl) {
          localStorage.setItem('cafuntalk_avatar', avatarUrl);
        }
      } else {
        // Se a opção estiver desativada, remove os dados
        localStorage.removeItem('cafuntalk_remember_user');
        localStorage.removeItem('cafuntalk_username');
        localStorage.removeItem('cafuntalk_avatar');
      }

      setUserName(inputName);
    }
  }, [inputName, isDuplicateName, rememberUser, avatarUrl, setUserName]);

  // Toggle para opção de lembrar dados
  const toggleRememberUser = useCallback(() => {
    setRememberUser(prev => !prev);
  }, []);

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
              className="text-desc hover:text-textInput cursor-pointer"
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
              className="bg-sendInputBG text-sendInput px-4 py-2 rounded-lg hover:font-medium transition-all cursor-pointer"
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
        <h1 className="text-3xl font-medium mb-4 text-center">
          <span className="text-user font-logo font-bold">CafunTalk</span>
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
          {isDuplicateName ? (
            <span className="text-red-500 flex items-center">
              <MdBlock className="mr-1" /> Este nome já está sendo usado
            </span>
          ) : inputName.trim() ? (
            <span className="text-[oklch(89.7%_0.196_126.665)] flex items-center">
              <FaCheck className="mr-1" /> Nome disponível
            </span>
          ) : (
            <>Escolha seu nome <span className="text-red-400">*</span></>
          )}
        </p>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="w-full relative">
              <input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className={`w-full bg-inputBG border ${isDuplicateName
                  ? 'border-red-500'
                  : inputName.trim()
                    ? 'border-[oklch(89.7%_0.196_126.665)]'
                    : 'border-inputBorder'
                  } px-4 py-2 rounded-lg focus:outline-none text-textInput placeholder-placeholder/50`}
                placeholder="Marcus"
              />
            </div>
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

          <div className="flex items-center mb-4">
            <div
              onClick={toggleRememberUser}
              className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors cursor-pointer mr-2 ${rememberUser ? 'bg-user' : 'bg-inputBorder'}`}
              role="checkbox"
              aria-checked={rememberUser}
              tabIndex={0}
            >
              <span
                className={`inline-block w-4 h-4 transform rounded-full bg-white transition-transform ${rememberUser ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </div>
            <label onClick={toggleRememberUser} className="text-textInput text-sm cursor-pointer">Lembrar nome e imagem</label>
          </div>

          <button
            onClick={handleEnterChat}
            className={`w-full ${inputName.trim() && !isDuplicateName
              ? "bg-sendInputBG text-sendInput hover:font-medium cursor-pointer"
              : "bg-sendInputBG/30 text-sendInput/40 cursor-not-allowed"} 
              px-4 py-2 rounded-lg 
              transition-all duration-300`}
            disabled={!inputName.trim() || isDuplicateName}
            title={isDuplicateName ? "Este nome já está sendo usado" : ""}
          >
            Entrar →
          </button>
        </div>
      </div>
      <div>
        <a href="https://coelhomarcus.com" target="_blank" className="text-xs text-desc underline hover:text-user">@coelhomarcus</a>
      </div>
    </div >
  );
};

export default Welcome;
