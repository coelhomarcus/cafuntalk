const MsgInput = ({
  localMsg,
  setLocalMsg,
  handleKeyDown,
  setIsComposing,
  sendMessage,
}: TMsgInput) => {
  return (
    <div className="bg-bgColor border-t border-borderColor p-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-bgInput border border-borderColor rounded px-4 py-2">
          <input
            className="w-full bg-transparent outline-none text-textInput placeholder-placeholder"
            value={localMsg}
            onChange={(e) => setLocalMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleKeyDown(e);
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
