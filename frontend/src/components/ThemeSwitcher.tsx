import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeType } from '../types/themes';
import { IoColorPaletteSharp } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';

interface ThemeSwitcherProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
    mobileLayout?: boolean;
}

const ThemeSwitcher = ({ isOpen: propIsOpen, setIsOpen: propSetIsOpen, mobileLayout = false }: ThemeSwitcherProps) => {
    const { theme, setTheme } = useTheme();
    // Estado local usado apenas se não for controlado externamente
    const [localIsOpen, setLocalIsOpen] = useState(false);

    // Usar estado controlado ou local
    const isOpen = propIsOpen !== undefined ? propIsOpen : localIsOpen;
    const setIsOpen = propSetIsOpen || setLocalIsOpen;

    const themes: { id: ThemeType; name: string }[] = [
        { id: 'cafuntalk', name: 'CafunTalk' },
        { id: 'coffee', name: 'Café' },
        { id: 'nature', name: 'Natureza' },
        { id: 'cyberpunk', name: 'Cyberpunk' }
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleThemeChange = (newTheme: ThemeType) => {
        setTheme(newTheme);
        setIsOpen(false);
    };

    // Função auxiliar para obter a cor correta do tema
    const getThemeColor = (themeId: ThemeType) => {
        switch (themeId) {
            case 'cafuntalk':
                return 'oklch(89.7% 0.196 126.665)'; // Verde brilhante
            case 'coffee':
                return '#d2a679'; // Marrom claro
            case 'nature':
                return '#4caf50'; // Verde vibrante
            case 'cyberpunk':
                return '#00f3ff'; // Azul neon
            default:
                return 'var(--color-user)';
        }
    };

    return (
        <div className={`relative ${mobileLayout ? 'w-full' : ''}`}>
            <button
                onClick={toggleDropdown}
                className={`flex items-center gap-2 text-sm rounded-md hover:bg-bgColor/30 transition-colors cursor-pointer select-none
                  ${mobileLayout
                        ? 'p-2 w-full text-textInput/70 justify-between'
                        : 'p-1.5 gap-1'}`}
                title="Mudar tema"
                aria-label="Selecionar tema"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <span className={`flex items-center ${mobileLayout ? 'gap-2' : 'gap-1'}`}>
                    <IoColorPaletteSharp className="text-user" size={mobileLayout ? 20 : 18} />
                    {mobileLayout && <span className="flex-1 text-left">Mudar tema</span>}
                </span>
                {mobileLayout && (
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: getThemeColor(theme) }}
                        aria-hidden="true"
                    ></span>
                )}
            </button>

            {isOpen && (
                <div
                    className={`bg-bgColor border border-borderColor rounded-md shadow-lg z-50 overflow-hidden
                      ${mobileLayout
                            ? 'w-full mt-1'
                            : 'absolute right-0 top-full mt-1 w-48'}`}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="theme-menu"
                >
                    <div className="py-1">
                        {themes.map((themeOption) => {
                            const isSelected = theme === themeOption.id;
                            return (
                                <button
                                    key={themeOption.id}
                                    onClick={() => handleThemeChange(themeOption.id)}
                                    className={`w-full text-left px-4 py-2.5 text-textInput transition-all duration-150 cursor-pointer
                                      flex items-center justify-between
                                      ${isSelected ? 'bg-user/10 font-medium' : ''}
                                      hover:bg-user/5 focus:bg-user/5 focus:outline-none select-none`}
                                    role="menuitem"
                                    aria-current={isSelected ? "true" : "false"}
                                >
                                    <span className="flex items-center">
                                        <span
                                            className="inline-block w-2 h-2 rounded-full mr-2"
                                            style={{
                                                backgroundColor: getThemeColor(themeOption.id)
                                            }}
                                            aria-hidden="true"
                                        ></span>
                                        {themeOption.name}
                                    </span>
                                    {isSelected && (
                                        <MdCheck className="text-user" size={16} aria-hidden="true" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSwitcher;