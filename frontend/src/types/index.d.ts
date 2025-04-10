type Message = {
  sender: string;
  text: string;
  room: string;
  avatarIndex: number;
  system: boolean;
};

type TWelcome = {
  inputRef: React.RefObject<HTMLInputElement> | null;
  inputName: string;
  setInputName: (value: string) => void;
  setUserName: (value: string) => void;
};

type TConversation = {
  messages: Message[];
  userName: string;
  avatars: string[];
};

type TMsgInput = {
  localMsg: string;
  setLocalMsg: (value: string) => void;
  handleKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>;
  sendMessage: () => void;
};
