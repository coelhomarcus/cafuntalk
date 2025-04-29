import { useRoomName } from "../hooks/useRoomName";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";

import { FaHashtag } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";

type OnlineUser = {
  userName: string;
  avatarUrl: string | null;
};

interface HeaderProps {
  online: number;
  onlineUsers?: OnlineUser[];
  onRequestUserList?: () => void;
}

const Header = ({ online = 0, onlineUsers = [], onRequestUserList }: HeaderProps) => {
  const room = useRoomName();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleUserList = () => {
    // Se já estiver aberto, fecha; se estiver fechado, abre e fecha o menu de tema
    if (showUserList) {
      setShowUserList(false);
    } else {
      // Solicita lista atualizada e fecha o menu de tema se estiver aberto
      if (onRequestUserList) {
        onRequestUserList();
      }
      setShowUserList(true);
      setShowThemeMenu(false);
    }
  };

  // Manipulador para o estado do menu de temas
  const handleThemeMenuToggle = (isOpen: boolean) => {
    // Se estiver abrindo, fecha a lista de usuários
    if (isOpen && showUserList) {
      setShowUserList(false);
    }
    setShowThemeMenu(isOpen);
  };

  // Função para copiar o URL da sala para a área de transferência
  const copyRoomUrl = () => {
    const url = `${window.location.origin}${window.location.pathname}?${room}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setShowCopiedTooltip(true);
        setTimeout(() => {
          setShowCopiedTooltip(false);
        }, 750);
      })
      .catch(err => {
        console.error('Erro ao copiar URL:', err);
      });
  };

  return (
    <div className="m-2 mb-0 flex flex-col bg-dock border rounded-lg border-borderColor">
      {/* Header principal sempre visível */}
      <div className="py-2 px-4 md:px-6 flex items-center justify-between">
        <button
          className="text-xl font-medium cursor-pointer flex items-center gap-2 md:gap-3"
          onClick={() => window.location.reload()}
          aria-label="Reload CafunTalk"
        >
          <svg width="18" height="18" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_65_8)">
              <path d="M400 167.675C400 89.2 377.025 25.5 348.65 25C348.775 25 348.875 25 349 25H316.6C316.6 25 240.5 82.175 130.975 104.6C127.625 122.3 125.5 143.375 125.5 167.675C125.5 191.975 127.625 213.075 130.975 230.75C240.525 253.175 316.6 310.35 316.6 310.35H349C348.875 310.35 348.775 310.35 348.65 310.325C377.05 309.825 400 246.175 400 167.675ZM337.825 288.775C334.15 288.775 330.2 284.975 328.15 282.7C323.225 277.2 318.475 268.65 314.4 257.975C305.325 234.05 300.3 202 300.3 167.7C300.3 133.4 305.3 101.325 314.4 77.425C318.45 66.725 323.225 58.175 328.15 52.675C330.175 50.4 334.15 46.6 337.825 46.6C341.5 46.6 345.45 50.4 347.5 52.675C352.425 58.175 357.175 66.725 361.25 77.425C370.325 101.35 375.35 133.4 375.35 167.7C375.35 202 370.35 234.075 361.25 257.975C357.2 268.675 352.425 277.225 347.5 282.7C345.475 284.975 341.5 288.775 337.825 288.775ZM98.375 167.675C98.375 147.375 99.875 127.675 102.7 109.425C84.2 111.975 67.95 113.45 47.875 113.45C21.675 113.45 21.675 113.45 21.675 113.45L0 150.425V184.875L21.675 221.85C21.675 221.85 21.675 221.85 47.875 221.85C67.95 221.85 84.2 223.325 102.7 225.875C99.875 207.65 98.375 187.925 98.375 167.625V167.675ZM143.8 250.85L93.8 241.275L125.775 366.875C127.425 373.375 133.875 376.65 140.1 374.15L186.4 355.625C192.625 353.125 195.125 346.275 191.95 340.35L143.8 250.825V250.85Z" className="fill-user" />
            </g>
            <defs>
              <clipPath id="clip0_65_8">
                <rect width="400" height="400" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-user font-logo font-semibold select-none">CafunTalk</span>
        </button>

        {/* Versão desktop: design minimalista */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center text-textInput/80">
            <div className="relative flex items-center mr-4">
              <button
                onClick={copyRoomUrl}
                className="flex items-center hover:bg-bgColor/30 p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Copiar URL da sala para área de transferência"
              >
                <FaHashtag className="text-user text-sm mr-1.5" />
                <span className="text-sm">{room}</span>
              </button>
              {showCopiedTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-bgColor border border-borderColor rounded text-xs text-textInput shadow-lg z-50 w-full">
                  URL copiado!
                </div>
              )}
            </div>

            <div className="flex items-center">
              <button
                onClick={toggleUserList}
                className="flex items-center hover:bg-bgColor/30 p-1 rounded-md transition-colors cursor-pointer select-none"
              >
                <BsPeopleFill className="text-user text-sm mr-1.5" />
                <span className="text-sm">{online}</span>
              </button>
            </div>
          </div>

          <ThemeSwitcher
            isOpen={showThemeMenu}
            setIsOpen={handleThemeMenuToggle}
          />
        </div>

        {/* Botão do menu mobile */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-user p-1 rounded-md hover:bg-gray-700/30 transition-colors"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Lista de usuários online (aparece ao clicar no contador) */}
      {showUserList && (
        <div className="absolute right-4 top-14 w-64 max-h-80 overflow-y-auto bg-bgColor border border-borderColor rounded-lg shadow-lg z-50 scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor">
          <div className="p-3 border-b border-borderColor flex justify-between items-center">
            <h3 className="text-textInput text-sm font-medium">Usuários Online ({online})</h3>
            <button
              onClick={toggleUserList}
              className="text-placeholder hover:text-user transition-colors"
            >
              <HiX size={16} />
            </button>
          </div>
          <div className="py-2">
            {onlineUsers.length > 0 ? (
              <ul>
                {onlineUsers.map((user, index) => (
                  <li key={index} className="px-3 py-2 hover:bg-borderColor/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={user.avatarUrl || "/pfps/1.webp"}
                        alt={`Avatar de ${user.userName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-textInput text-sm truncate">{user.userName}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-3 py-2 text-placeholder text-sm">Nenhum usuário online</p>
            )}
          </div>
        </div>
      )}

      {/* Menu expandido no mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-borderColor pt-2 pb-3 px-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="relative mb-2">
                <button
                  onClick={copyRoomUrl}
                  className="flex items-center gap-1 text-textInput/70 text-sm hover:bg-bgColor/30 p-1 rounded-md transition-colors"
                >
                  <FaHashtag className="text-user" />
                  <span>{room}</span>
                </button>
                {showCopiedTooltip && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-bgColor border border-borderColor rounded text-xs text-textInput shadow-lg z-50">
                    URL copiado!
                  </div>
                )}
              </div>
              <button
                onClick={toggleUserList}
                className="flex items-center gap-1 text-textInput/70 text-sm hover:bg-bgColor/30 p-1 rounded-md transition-colors"
              >
                <BsPeopleFill className="text-user" />
                <span>{online} online</span>
              </button>
            </div>
            <ThemeSwitcher
              isOpen={showThemeMenu}
              setIsOpen={handleThemeMenuToggle}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;