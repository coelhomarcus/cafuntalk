import { useState } from "react";

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
    <div className="bg-bgColor border-t border-borderColor p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-bgInput border border-borderColor rounded px-4 py-2">
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
          className="bg-user text-bgColor font-medium py-2 px-4 rounded-md border border-user shadow-sm hover:bg-bgColor hover:text-user hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MsgInput;
