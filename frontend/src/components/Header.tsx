import { useRoomName } from "../hooks/useRoomName";

import { FaHashtag } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";
import { ImBullhorn } from "react-icons/im";

const Header = ({ online }: { online: number }) => {
  const room = useRoomName();

  return (
    <div className="m-2 mb-0 flex flex-col gap-3 sm:gap-0 sm:flex-row justify-between sm:items-center bg-dock border rounded-lg border-borderColor py-3 px-6 shadow-inner shadow-neutral-800">
      <div className="flex items-center gap-3">
        <ImBullhorn className="text-user text-xl" />
        <a
          className="text-xl font-medium"
          href="https://github.com/coelhomarcus"
          target="_blank"
        >
          <span className="text-user font-logo font-semibold">Cafun</span>
          <span className="text-user font-logo font-semibold">Talk</span>
        </a>
      </div>
      <div className="mr-3 flex justify-between sm:block">
        <p className="flex items-center sm:justify-end gap-1 text-textInput/70 text-sm">
          <FaHashtag className="text-user" />
          <span>{room}</span>
        </p>
        <p className="flex items-center sm:justify-end gap-1 text-textInput/70 text-sm">
          <BsPeopleFill className="text-user" />
          <span>{online}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
