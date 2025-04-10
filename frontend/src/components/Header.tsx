import { useRoomName } from "../hooks/useRoomName";

const Header = ({ online }: { online: number }) => {
  const room = useRoomName();

  return (
    <div className="flex justify-between items-center bg-bgColor border-b border-borderColor py-2 px-4">
      <div className="flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="CafunTalk Logo"
          className="h-12  w-auto rounded-full"
        />
        <a
          className="text-xl font-medium"
          href="https://github.com/coelhomarcus"
          target="_blank"
        >
          <span className="text-user font-logo">Cafun</span>
          <span className="text-friend font-logo">Talk</span>
        </a>
      </div>
      <div>
        <p className="text-textInput">
          Room: <span className="text-friend">{room}</span>
        </p>
        <p className="text-textInput">
          Online: <span className="text-friend">{online}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
