const Header = () => {
  return (
    <div className="bg-[#131313] border-b border-[#303030] py-2 px-4">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="CafunTalk Logo"
          className="h-14  w-auto rounded-full"
        />
        <h1 className="text-xl font-medium text-gray-100">CafunTalk</h1>
      </div>
    </div>
  );
};

export default Header;
