export default {
    theme: {
        extend: {
            colors: {
                user: 'var(--color-user)',
                friend: 'var(--color-friend)',
                messageUser: 'var(--color-messageUser)',
                messageFriend: 'var(--color-messageFriend)',
                bgColor: 'var(--color-bgColor)',
                borderColor: 'var(--color-borderColor)',
                welcomeBorder: 'var(--color-WelcomeBorder)',
                welcomeTextButton: 'var(--color-WelcomeTextButton)',
                textInput: 'var(--color-textInput)',
                placeholder: 'var(--color-placeholder)',
                title: 'var(--color-title)',
                desc: 'var(--color-desc)',
                inputBG: 'var(--color-inputBG)',
                inputBorder: 'var(--color-inputBorder)',
                sendInput: 'var(--color-sendInput)',
                sendInputBG: 'var(--color-sendInputBG)',
                dock: 'var(--color-dock)',
            },
            fontFamily: {
                logo: 'var(--font-logo)',
                name: 'var(--font-name)',
                message: 'var(--font-message)',
            },
        },
    },
    plugins: [
        require('tailwind-scrollbar'),
    ],
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
}