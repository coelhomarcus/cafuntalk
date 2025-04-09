const Header = () => {
  return (
    <div className="bg-bgColor border-b border-borderColor py-2 px-4">
      <div className="flex items-center gap-2">
        <img
          src="/logo.svg"
          alt="CafunTalk Logo"
          className="h-12  w-auto rounded-full"
        />
        <h1 className="text-xl font-medium text-gray-100">
          <span className="text-user font-logo">Cafun</span>
          <span className="text-friend font-logo">Talk</span>
        </h1>
      </div>
    </div>
  );
};

export default Header;
