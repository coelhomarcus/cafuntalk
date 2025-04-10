import { useRoomName } from "../hooks/useRoomName";

const Welcome = ({
  inputName,
  setInputName,
  setUserName,
  avatarUrl,
  setAvatarUrl,
}: TWelcome) => {
  const room = useRoomName();

  return (
    <div className="h-screen flex items-center justify-center bg-dock">
      <div className="bg-bgColor p-6 rounded-xl shadow-xl w-full max-w-sm border border-WelcomeBorder">
        <h1 className="text-3xl font-medium text-title mb-4 text-center">
          <span className="text-user font-logo">Cafun</span>
          <span className="text-user font-logo">Talk</span>
        </h1>
        <p className="text-desc mb-1 text-sm">A clean and simple chat space.</p>
        <p className="text-desc mb-1 text-sm">
          This chat doesn’t keep history — once you leave, messages are gone.
        </p>
        <p className="text-desc mb-1 text-sm">
          Current room: <span className="text-user">{room}</span>
        </p>
        <p className="text-desc mb-4 text-sm">
          To switch rooms, just add{" "}
          <span className="text-user">/?roomname</span> to the URL.
        </p>

        <p className="text-textInput mb-2 text-sm">What's your username?</p>
        <div className="space-y-4">
          <input
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setUserName(inputName);
              }
            }}
            className="w-full bg-bgColor border border-WelcomeBorder px-4 py-2 rounded-lg focus:outline-none 1 text-textInput placeholder-placeholder/50"
            placeholder="username"
          />
          <p className="text-textInput mb-2 text-sm">
            Add a profile photo? (optional)
          </p>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setAvatarUrl(avatarUrl);
              }
            }}
            className="w-full bg-bgColor border border-WelcomeBorder px-4 py-2 rounded-lg focus:outline-none 1 text-textInput placeholder-placeholder/50"
            placeholder="image url"
          />
          <button
            onClick={() => setUserName(inputName)}
            className="w-full bg-user
              text-WelcomeTextButton hover:font-medium px-4 py-2 rounded-lg 
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
