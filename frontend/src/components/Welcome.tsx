import { useRoomName } from "../hooks/useRoomName";
import { ImBullhorn } from "react-icons/im";

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
      <div className="py-4 px-6 rounded-lg w-full max-w-sm border sm:border-neutral-800">
        <div className="flex justify-center text-xl mb-3">
          <ImBullhorn className="text-user" />
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
