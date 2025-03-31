export default function Header() {
  return (
    <header className=" bg-neutral-700 flex items-center justify-between px-4 py-2 border-b border-gray-800">
      <div className="text-sm font-mono">matt@pop-os</div>
      <h1 className="text-lg font-mono">nvim .</h1>
      <div className="flex items-center space-x-4">
        <div className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-zinc-500 hover:cursor-pointer ">
          <p className="mb-1 text-base font-extrabold underline decoration-2">
            _
          </p>
        </div>
        <div className="w-5 h-5 rounded-full bg-orange-400 text-white flex items-center justify-center hover:cursor-pointer hover:bg-zinc-500">
          <p className="text-md font-bold">x</p>
        </div>
      </div>
    </header>
  );
}
