import { useState, useEffect, useRef } from "react";

import { IoSend } from "react-icons/io5";

const MsgInput = ({
  localMsg,
  setLocalMsg,
  handleKeyDown,
  setIsComposing,
  sendMessage,
}: TMsgInput) => {
  const [rows, setRows] = useState(1);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setLocalMsg(e.target.value);
    const value = e.target.value;

    const lineCount = value.split("\n").length;
    setRows(Math.min(lineCount, 4));
  }

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="bg-bgColor p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-bgColor border border-inputBorder rounded-lg px-4 py-2">
          <textarea
            className="w-full resize-none max-h-20 bg-transparent outline-none text-textInput placeholder-placeholder scrollbar-thin scrollbar-thumb-user scrollbar-track-bgColor"
            value={localMsg}
            rows={rows}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                handleKeyDown(e);
                setRows(1);
              }
            }}
            ref={inputRef}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Digite"
          />
        </div>
        <button
          className="bg-bgColor text-user font-medium py-4 px-4 rounded-lg border border-inputBorder hover:bg-bgColor hover:text-user hover:border-user transition-all duration-200 cursor-pointer hover:*:scale-130"
          onClick={() => {
            sendMessage();
            setRows(1);
          }}
        >
          <IoSend className="duration-300 transition-all" />
        </button>
      </div>
    </div>
  );
};

export default MsgInput;
