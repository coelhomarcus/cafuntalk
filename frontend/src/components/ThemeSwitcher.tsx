import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeType } from '../types/themes';
import { IoColorPaletteSharp } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { id: ThemeType; name: string }[] = [
        { id: 'cafuntalk', name: 'CafunTalk' },
        { id: 'coffee', name: 'Café' },
        { id: 'nature', name: 'Natureza' }
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
            default:
                return 'var(--color-user)';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center gap-1 text-sm p-1.5 rounded-md hover:bg-bgColor/30 transition-colors cursor-pointer"
                title="Mudar tema"
                aria-label="Selecionar tema"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <IoColorPaletteSharp className="text-user" size={18} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-1 w-48 bg-bgColor border border-borderColor rounded-md shadow-lg z-50 overflow-hidden"
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
                                      hover:bg-user/5 focus:bg-user/5 focus:outline-none`}
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