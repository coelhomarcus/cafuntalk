// Tipos de tema e contexto
export type ThemeType = 'cafuntalk' | 'coffee' | 'cyberpunk' | 'ocean' | 'wumpus';

export type ThemeContextType = {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
};

// Definição das cores para cada tema
export const themes = {
    cafuntalk: {
        userColor: 'oklch(89.7% 0.196 126.665)',
        friendColor: '#2f3136',
        messageUserColor: 'oklch(27.4% 0.072 132.109)',
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
        sendInputBG: 'oklch(89.7% 0.196 126.665)',
        dock: '#0a0a0a',
    },
    coffee: {
        userColor: '#d2a679',
        friendColor: '#533e2d',
        messageUserColor: '#f5e6d5',
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
    cyberpunk: {
        userColor: '#00f3ff',
        friendColor: '#1e1832',
        messageUserColor: '#000912',
        messageFriendColor: '#e9f1ff',
        bgColor: '#0f0e17',
        borderColor: '#220070',
        welcomeBorder: '#3300aa',
        welcomeTextButton: '#d1f7ff',
        textInput: '#e2fcff',
        placeholder: '#7c8df7',
        title: '#e2fcff',
        desc: '#7c8df7',
        inputBG: '#0a0e20',
        inputBorder: '#3c2e91',
        sendInput: '#000000',
        sendInputBG: '#ff007c',
        dock: '#0a0e20',
    },
    ocean: {
        userColor: '#00bcd4', // Azul turquesa
        friendColor: '#01579b', // Azul escuro
        messageUserColor: '#003366', // Azul marinho
        messageFriendColor: '#e3f2fd', // Azul muito claro
        bgColor: '#002244', // Azul profundo
        borderColor: '#01579b', // Azul escuro
        welcomeBorder: '#0277bd', // Azul médio escuro
        welcomeTextButton: '#e3f2fd', // Azul muito claro
        textInput: '#e3f2fd', // Azul muito claro
        placeholder: '#81d4fa', // Azul claro
        title: '#e3f2fd', // Azul muito claro
        desc: '#90caf9', // Azul claro médio
        inputBG: '#001b36', // Azul profundo mais escuro
        inputBorder: '#0277bd', // Azul médio escuro
        sendInput: '#e3f2fd', // Azul muito claro
        sendInputBG: '#00bcd4', // Azul turquesa
        dock: '#001b36', // Azul profundo mais escuro
    },
    wumpus: {
        userColor: '#5865F2', // Azul Discord principal
        friendColor: '#36393f', // Cinza escuro Discord
        messageUserColor: '#292b2f', // Cinza muito escuro Discord
        messageFriendColor: '#f2f3f5', // Branco acinzentado Discord
        bgColor: '#36393f', // Cinza escuro Discord (fundo principal)
        borderColor: '#40444b', // Cinza médio Discord (bordas)
        welcomeBorder: '#4f545c', // Cinza médio mais claro Discord
        welcomeTextButton: '#ffffff', // Branco Discord
        textInput: '#dcddde', // Cinza muito claro Discord
        placeholder: '#72767d', // Cinza médio Discord (texto secundário)
        title: '#ffffff', // Branco Discord
        desc: '#b9bbbe', // Cinza claro Discord (texto terciário)
        inputBG: '#40444b', // Cinza médio Discord (input)
        inputBorder: '#4f545c', // Cinza médio mais claro Discord
        sendInput: '#ffffff', // Branco Discord
        sendInputBG: '#5865F2', // Azul Discord principal
        dock: '#2f3136', // Cinza escuro Discord (sidebars)
    }
};