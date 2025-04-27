import { useRoomName } from "../hooks/useRoomName";

const Welcome = ({
  inputName,
  setInputName,
  setUserName,
  avatarUrl,
  setAvatarUrl,
}: TWelcome) => {
  const room = useRoomName();

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center bg-dock ">
      <div className="py-4 px-6 rounded-lg w-full max-w-sm sm:border sm:border-neutral-800">
        <div className="flex justify-center mb-3">
          <svg width="20" height="20" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_65_8)">
              <path d="M400 167.675C400 89.2 377.025 25.5 348.65 25C348.775 25 348.875 25 349 25H316.6C316.6 25 240.5 82.175 130.975 104.6C127.625 122.3 125.5 143.375 125.5 167.675C125.5 191.975 127.625 213.075 130.975 230.75C240.525 253.175 316.6 310.35 316.6 310.35H349C348.875 310.35 348.775 310.35 348.65 310.325C377.05 309.825 400 246.175 400 167.675ZM337.825 288.775C334.15 288.775 330.2 284.975 328.15 282.7C323.225 277.2 318.475 268.65 314.4 257.975C305.325 234.05 300.3 202 300.3 167.7C300.3 133.4 305.3 101.325 314.4 77.425C318.45 66.725 323.225 58.175 328.15 52.675C330.175 50.4 334.15 46.6 337.825 46.6C341.5 46.6 345.45 50.4 347.5 52.675C352.425 58.175 357.175 66.725 361.25 77.425C370.325 101.35 375.35 133.4 375.35 167.7C375.35 202 370.35 234.075 361.25 257.975C357.2 268.675 352.425 277.225 347.5 282.7C345.475 284.975 341.5 288.775 337.825 288.775ZM98.375 167.675C98.375 147.375 99.875 127.675 102.7 109.425C84.2 111.975 67.95 113.45 47.875 113.45C21.675 113.45 21.675 113.45 21.675 113.45L0 150.425V184.875L21.675 221.85C21.675 221.85 21.675 221.85 47.875 221.85C67.95 221.85 84.2 223.325 102.7 225.875C99.875 207.65 98.375 187.925 98.375 167.625V167.675ZM143.8 250.85L93.8 241.275L125.775 366.875C127.425 373.375 133.875 376.65 140.1 374.15L186.4 355.625C192.625 353.125 195.125 346.275 191.95 340.35L143.8 250.825V250.85Z" fill="#BBF451" />
            </g>
            <defs>
              <clipPath id="clip0_65_8">
                <rect width="400" height="400" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h1 className="text-3xl font-medium mb-4 text-center">
          <span className="text-user font-logo">Cafun</span>
          <span className="text-user font-logo">Talk</span>
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
          Qual seu nickname? <span className="text-red-400">*</span>
        </p>
        <div className="space-y-4">
          <input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="w-full bg-bgColor border border-WelcomeBorder px-4 py-2 rounded-lg focus:outline-none 1 text-textInput placeholder-placeholder/50"
            placeholder="nickname"
          />
          <p className="text-textInput mb-2 text-sm">
            Imagem de Perfil{" "}
            <span className="text-white/50 italic">(opcional)</span>
          </p>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            className="w-full bg-bgColor border border-WelcomeBorder px-4 py-2 rounded-lg focus:outline-none 1 text-textInput placeholder-placeholder/50"
            placeholder="url da imagem"
          />
          <button
            onClick={() => setUserName(inputName)}
            className="w-full bg-user
              text-black hover:font-medium px-4 py-2 rounded-lg 
              transition-all duration-300 cursor-pointer"
          >
            Entrar →
          </button>
        </div>
      </div>
      <div>
        <a href="https://coelhomarcus.com" target="_blank" className="text-xs text-neutral-400 underline">@coelhomarcus</a>
      </div>
    </div >
  );
};

export default Welcome;
