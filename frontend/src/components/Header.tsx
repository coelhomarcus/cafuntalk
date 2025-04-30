import { useRoomName } from "../hooks/useRoomName";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState, useRef, useEffect } from "react";

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
  const headerRef = useRef<HTMLDivElement>(null);

  // Fechar menus quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowUserList(false);
        setShowThemeMenu(false);
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div ref={headerRef} className="m-2 mb-0 flex flex-col bg-dock border rounded-lg border-borderColor relative">
      {/* Header principal sempre visível */}
      <div className="py-2 px-4 md:px-6 flex items-center justify-between">
        <button
          className="text-xl font-medium cursor-pointer flex items-center gap-2 md:gap-3"
          onClick={() => window.location.reload()}
          aria-label="Reload CafunTalk"
        >
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
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-bgColor border border-borderColor rounded text-xs text-textInput shadow-lg z-100 w-full">
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

      {/* Lista de usuários online */}
      {showUserList && (
        <div className="absolute z-50 right-0 top-full md:top-12 mt-2 w-full md:w-64 max-h-80 overflow-y-auto bg-dock border border-borderColor rounded-lg shadow-lg scrollbar-thin scrollbar-thumb-borderColor scrollbar-track-bgColor">
          <div className="p-3 border-b border-borderColor flex justify-between items-center">
            <h3 className="text-textInput text-sm font-medium">Usuários Online ({online})</h3>
            <button
              onClick={toggleUserList}
              className="text-placeholder hover:text-user transition-colors"
            >
              <HiX size={16} />
            </button>
          </div>
          <div>
            {onlineUsers.length > 0 ? (
              <ul>
                {onlineUsers.map((user, index) => (
                  <li key={index} className="px-3 py-2 hover:bg-borderColor/30 flex items-center gap-2">
                    <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={user.avatarUrl || "/pfps/1.webp"}
                        alt={`Avatar de ${user.userName}`}
                        className="w-full h-full object-cover rounded"
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
          <div className="flex flex-col gap-3">
            {/* Item para copiar URL da sala */}
            <div className="relative">
              <button
                onClick={copyRoomUrl}
                className="flex items-center gap-2 text-textInput/70 text-sm hover:bg-bgColor/30 p-2 rounded-md transition-colors w-full"
              >
                <FaHashtag className="text-user text-base" />
                <span className="flex-1 text-left">{room}</span>
              </button>
              {showCopiedTooltip && (
                <div className="absolute right-0 top-0 mt-1 px-2 py-1 bg-bgColor border border-borderColor rounded text-xs text-textInput shadow-lg z-100">
                  URL copiado!
                </div>
              )}
            </div>

            {/* Item para ver usuários online */}
            <button
              onClick={toggleUserList}
              className="flex items-center gap-2 text-textInput/70 text-sm hover:bg-bgColor/30 p-2 rounded-md transition-colors w-full"
            >
              <BsPeopleFill className="text-user text-base" />
              <span className="flex-1 text-left">{online} online</span>
            </button>

            {/* Item para troca de tema */}
            <div className="block w-full">
              <ThemeSwitcher
                isOpen={showThemeMenu}
                setIsOpen={handleThemeMenuToggle}
                mobileLayout={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;