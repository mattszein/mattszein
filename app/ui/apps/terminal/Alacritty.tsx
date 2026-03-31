const Alacritty = () => {
  return (
    <div className="flex flex-col h-full w-full bg-[#111111]/80 backdrop-blur-md text-gray-300 font-mono text-sm p-2 overflow-auto">
      <div className="flex justify-between w-full items-start">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[#83a598]">~/work/projects/mattszein/app</span>
          <span className="text-[#b8bb26]">main</span>
          <span className="text-[#b8bb26] font-bold">❯</span>
          <span className="animate-pulse w-2.5 h-4 bg-gray-300 inline-block align-middle"></span>
        </div>
        <div className="text-gray-500 whitespace-nowrap pl-4">00:08:44</div>
      </div>
    </div>
  );
}

export default Alacritty;
