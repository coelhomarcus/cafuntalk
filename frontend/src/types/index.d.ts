type Message = {
  sender: string;
  text: string;
  room: string;
  avatarUrl: string;
  system: boolean;
};

type TWelcome = {
  inputName: string;
  setInputName: (value: string) => void;
  setUserName: (value: string) => void;
  avatarUrl: string;
  setAvatarUrl: (value: string) => void;
};

type TConversation = {
  messages: Message[];
  userName: string;
};

type TMsgInput = {
  localMsg: string;
  setLocalMsg: (value: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => void;
};
