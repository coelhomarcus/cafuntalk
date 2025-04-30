import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeType, ThemeContextType } from '../types/themes';

// Valor padrão do contexto
const defaultValue: ThemeContextType = {
    theme: 'cafuntalk',
    setTheme: () => { },
};

// Criação do contexto
export const ThemeContext = createContext<ThemeContextType>(defaultValue);

// Props do provedor de tema
type ThemeProviderProps = {
    children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    // Tenta recuperar o tema salvo no localStorage ou usa o tema padrão (cafuntalk)
    const [theme, setTheme] = useState<ThemeType>(() => {
        const savedTheme = localStorage.getItem('cafuntalk-theme');

        // Verifica se o tema salvo é válido
        if (savedTheme === 'cafuntalk' || savedTheme === 'coffee' ||
            savedTheme === 'cyberpunk' || savedTheme === 'ocean' ||
            savedTheme === 'wumpus') {
            return savedTheme as ThemeType;
        }

        // Se o tema salvo for inválido, usa o padrão
        return 'cafuntalk';
    });

    // Atualiza o localStorage quando o tema muda
    useEffect(() => {
        localStorage.setItem('cafuntalk-theme', theme);

        // Adiciona a classe do tema atual ao elemento html
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook personalizado para usar o tema
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }

    return context;
};