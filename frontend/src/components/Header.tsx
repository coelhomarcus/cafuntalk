import { useRoomName } from "../hooks/useRoomName";
import ThemeSwitcher from "./ThemeSwitcher";
import { useState } from "react";

import { FaHashtag } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";

interface HeaderProps {
  online: number;
}

const Header = ({ online = 0 }: HeaderProps) => {
  const room = useRoomName();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          <span className="text-user font-logo font-semibold">CafunTalk</span>
        </button>

        {/* Versão desktop: design minimalista */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center text-textInput/80">
            <div className="flex items-center mr-4">
              <FaHashtag className="text-user text-sm mr-1.5" />
              <span className="text-sm">{room}</span>
            </div>

            <div className="flex items-center">
              <BsPeopleFill className="text-user text-sm mr-1.5" />
              <span className="text-sm">{online}</span>
            </div>
          </div>

          <ThemeSwitcher />
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

      {/* Menu expandido no mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-borderColor pt-2 pb-3 px-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="flex items-center gap-1 text-textInput/70 text-sm">
                <FaHashtag className="text-user" />
                <span>{room}</span>
              </p>
              <p className="flex items-center gap-1 text-textInput/70 text-sm">
                <BsPeopleFill className="text-user" />
                <span>{online} online</span>
              </p>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;