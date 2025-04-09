import React from "react";
import { useRoomName } from "../hooks/useRoomName";

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
  const room = useRoomName();

  return (
    <div className="h-screen flex items-center justify-center bg-bgColor">
      <div className="bg-transparent p-6 rounded-xl shadow-lg w-full max-w-sm border border-borderColor">
        <h1 className="text-3xl font-medium text-title mb-4 text-center">
          <span className="text-user font-logo">Cafun</span>
          <span className="text-friend font-logo">Talk</span>
        </h1>
        <p className="text-textInput mb-2 text-sm">
          Room: <span className="text-friend">{room}</span>
        </p>
        <p className="text-desc mb-3 text-sm">
          Welcome to CafunTalk, a minimal, distraction-free chat application.
        </p>
        <p className="text-desc mb-3 text-sm">
          Want to change channels?
          <br />- Just add <span className="text-user">/?roomname</span> to the
          end of the URL.
        </p>
        <p className="text-desc mb-6 text-sm">
          There are no channel lists, so a secret channel name can be used for
          private discussions.
        </p>
        <p className="text-textInput mb-2 text-sm">What's your username?</p>
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
            className="w-full bg-bgColor border border-borderColor px-4 py-2 rounded-lg focus:outline-none 1 text-textInput placeholder-placeholder"
            placeholder="username"
          />
          <button
            onClick={() => setUserName(inputName)}
            className="w-full bg-user
              text-bgColor hover:font-medium px-4 py-2 rounded-lg 
              transition-all duration-300 cursor-pointer"
          >
            Let’s go →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
