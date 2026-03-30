'use client'

import Clock from "@/app/ui/icons/nvim/Clock";
import Cube from "@/app/ui/icons/nvim/Cube";
import { useDateTime } from "@/app/ui/utils/useDateTime";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { LinkList } from "@/app/ui/link_list";

const BottomStatusLine = () => {
  const dateTime = useDateTime();
  const [neovimTreeLink] = useStore(
    useShallow((state) => [state.neovimTreeLink]),
  );
  const current = neovimTreeLink > 0 ? LinkList[neovimTreeLink].title : "mattszein";

  return (
    < div className="flex w-full h-6 bg-[#282828] text-sm font-mono select-none overflow-hidden text-[#d4be98]" >

      <div className="flex items-center bg-[#a89984] text-[#282828] font-bold px-4 h-full">
        NORMAL
      </div>

      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[12px] border-l-[#a89984] bg-[#504945]"></div>

      <div className="flex items-center bg-[#504945] px-3 h-full space-x-2">
        <span></span> {/* Ícono de Git Branch */}
        <span>main</span>
      </div>
      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[12px] border-l-[#504945] bg-[#3c3836]"></div>

      <div className="flex items-center bg-[#3c3836] text-[#a89984] px-3 h-full space-x-2">
        <span className="text-[#83a598]">⚛</span> {/* Ícono de React */}
        <span>{current}</span>
      </div>
      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[12px] border-l-[#3c3836] bg-[#282828]"></div>

      <div className="flex-1 bg-[#282828]"></div>

      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-r-[12px] border-r-[#3c3836] bg-[#282828]"></div>

      <div className="flex items-center bg-[#3c3836] px-3 h-full space-x-2 text-[#a89984]">
        <span className="text-[#504945]">⟨</span>
        <span className="text-[#fe8019] inline-flex"><Cube className="h-4 w-4" /></span>
        <span className="text-[#fe8019]">6</span>
      </div>

      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-r-[12px] border-r-[#504945] bg-[#3c3836]"></div>

      <div className="flex items-center bg-[#504945] px-3 h-full space-x-4">
        <span>Top</span>
        <span>1:1</span>
      </div>

      <div className="w-0 h-0 border-y-[12px] border-y-transparent border-r-[12px] border-r-[#a89984] bg-[#504945]"></div>

      <div className="flex items-center bg-[#a89984] text-[#282828] font-bold px-4 h-full space-x-1">
        <span><Clock /></span>
        <span>
          {dateTime
            ? `${String(dateTime.getHours()).padStart(2, "0")
            }:${String(dateTime.getMinutes()).padStart(2, "0")}`
            : ""}
        </span>
      </div>
    </div >
  );
};

export default BottomStatusLine;
