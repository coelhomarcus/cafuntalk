import { useRoomName } from "../hooks/useRoomName";

import { FaHashtag } from "react-icons/fa";
import { BsPeopleFill } from "react-icons/bs";

const Header = ({ online }: { online: number }) => {
  const room = useRoomName();

  return (
    <div className="m-2 mb-0 flex justify-between items-center bg-dock border rounded-xl border-borderColor py-2 px-4">
      <div className="flex items-center gap-2">
        <svg
          width="500"
          height="500"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-12  w-auto rounded-full"
        >
          <circle
            cx="243.5"
            cy="254.5"
            r="142"
            fill="#5865f2"
            stroke="#131313"
            stroke-width="25"
          />
          <circle
            cx="344.5"
            cy="156.5"
            r="53"
            fill="#A0C878"
            stroke="#131313"
            stroke-width="25"
          />
        </svg>
        <a
          className="text-xl font-medium"
          href="https://github.com/coelhomarcus"
          target="_blank"
        >
          <span className="text-user font-logo">Cafun</span>
          <span className="text-user font-logo">Talk</span>
        </a>
      </div>
      <div className="mr-3">
        <p className="flex items-center justify-end gap-1 text-textInput/70">
          <FaHashtag className="text-user" />
          <span>{room}</span>
        </p>
        <p className="flex items-center justify-end gap-1 text-textInput/70">
          <BsPeopleFill className="text-user" />
          <span>{online}</span>
        </p>
      </div>
    </div>
  );
};

export default Header;
