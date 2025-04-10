import { useState } from "react";

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

  return (
    <div className="bg-bgColor p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-inputBG border border-inputBorder rounded-xl px-4 py-2">
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
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            placeholder="Type your message..."
          />
        </div>
        <button
          className="bg-sendInputBG text-sendInput font-medium py-4 px-4 rounded-xl border border-inputBorder shadow-sm hover:bg-bgColor hover:text-sendInputBG hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => {
            sendMessage();
            setRows(1);
          }}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default MsgInput;
