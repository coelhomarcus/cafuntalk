// Tipos de tema e contexto
export type ThemeType = 'cafuntalk' | 'coffee' | 'nature';

export type ThemeContextType = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
};

// Definição das cores para cada tema
export const themes = {
    cafuntalk: {
        userColor: 'oklch(89.7% 0.196 126.665)', // Verde brilhante
        friendColor: '#2f3136',
        messageUserColor: 'oklch(27.4% 0.072 132.109)', // Verde escuro
        messageFriendColor: 'white',
        bgColor: '#0a0a0a',
        borderColor: '#202020',
        welcomeBorder: '#303030',
        welcomeTextButton: 'white',
        textInput: '#e5e7eb',
        placeholder: '#99a1af',
        title: '#f3f4f6',
        desc: '#99a1af',
        inputBG: '#0f0f12',
        inputBorder: '#2f3136',
        sendInput: '#f2efe7',
        sendInputBG: 'oklch(89.7% 0.196 126.665)', // Verde limão
        dock: '#0a0a0a',
    },
    coffee: {
        userColor: '#d2a679', // Marrom claro
        friendColor: '#533e2d',
        messageUserColor: '#f5e6d5', // Bege claro
        messageFriendColor: '#f5e6d5',
        bgColor: '#352315',
        borderColor: '#4a3626',
        welcomeBorder: '#5f4835',
        welcomeTextButton: '#f5e6d5',
        textInput: '#f5e6d5',
        placeholder: '#b69f84',
        title: '#f5e6d5',
        desc: '#b69f84',
        inputBG: '#2c1e12',
        inputBorder: '#5f4835',
        sendInput: '#f5e6d5',
        sendInputBG: '#6b503d',
        dock: '#2a1c10',
    },
    nature: {
        userColor: '#4caf50', // Verde vibrante
        friendColor: '#2c5a2e',
        messageUserColor: '#f1f8e9', // Verde claro pálido
        messageFriendColor: '#f9fbe7',
        bgColor: '#1b3c1e',
        borderColor: '#33691e',
        welcomeBorder: '#558b2f',
        welcomeTextButton: '#e8f5e9',
        textInput: '#dcedc8',
        placeholder: '#aed581',
        title: '#f1f8e9',
        desc: '#c5e1a5',
        inputBG: '#1b3c1e',
        inputBorder: '#388e3c',
        sendInput: '#ffffff',
        sendInputBG: '#43a047',
        dock: '#1b3c1e',
    }
};