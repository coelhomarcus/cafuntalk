import React from "react";

type TWelcome = {
  inputRef: React.RefObject<HTMLInputElement> | null;
  inputName: string;
  setInputName: (value: string) => void;
  setUserName: (value: string) => void;
};

const Welcome = ({
  inputRef,
  inputName,
  setInputName,
  setUserName,
}: TWelcome) => {
  return (
    <div className="h-screen flex items-center justify-center bg-[#131313]">
      <div className="bg-transparent p-6 rounded-xl shadow-lg w-full max-w-sm border border-[#404040]">
        <h1 className="text-2xl font-medium text-gray-100 mb-4">Bem-vindo</h1>
        <p className="text-gray-400 mb-6 text-sm">Como podemos te chamar?</p>
        <div className="space-y-4">
          <input
            ref={inputRef}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setUserName(inputName);
              }
            }}
            className="w-full bg-[#131313] border border-[#404040] px-4 py-2 rounded-lg focus:outline-none 1 text-gray-200 placeholder-gray-500"
            placeholder="Seu nome"
          />
          <button
            onClick={() => setUserName(inputName)}
            className="w-full bg-blue-600 hover:bg-blue-800 
              text-gray-100 px-4 py-2 rounded-lg 
              transition duration-300 cursor-pointer"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
