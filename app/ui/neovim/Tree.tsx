"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { LinkList, LinkKind } from "@/app/ui/link_list";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { useHotkeys } from "react-hotkeys-hook";
import FolderOpen from "@/app/ui/icons/FolderOpen";
import ExplorerSearch from "@/app/ui/neovim/ExplorerSearch";
import { WINDOW_APPS } from '@/app/lib/stores/slices/Window';
import { useWindow } from '@/app/ui/utils/hooks/window'
import File from "./File";
import Folder from "./Folder";

export default function Tree() {
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isNeovimTree, neovimTreeLink] = useStore(
    useShallow((state) => [state.isNeovimTree, state.neovimTreeLink]),
  );
  const [windowFocus, setWindowFocus, checkFocus] = useWindow();
  const [selected, setSelected] = useState(neovimTreeLink);

  useHotkeys("j", () => changeLink(1), { enabled: checkFocus(WINDOW_APPS.NVIM) && isNeovimTree });
  useHotkeys("k", () => changeLink(-1), { enabled: checkFocus(WINDOW_APPS.NVIM) && isNeovimTree });

  const changeLink = (number: number) => {
    if (selected + number >= 0 && selected + number < LinkList.length) {
      // Focus if it's a file (A element)
      links.current[selected + number]?.focus();
      setSelected(selected + number);
    }
  };

  useEffect(() => setSelected(neovimTreeLink), [neovimTreeLink])

  return (
    <aside id="tree" className="overflow-y-auto border-r-1 border-stone-500 hidden">
      <nav className="w-72 text-gruvbox-fg text-sm">
        <ExplorerSearch />
        <div className="px-2 group flex items-center">
          <h2 className="group flex items-center space-x-2 hover:bg-gray-700 py-1"><FolderOpen className="h-4 text-gruvbox-blue" /><span className="text-gruvbox-green font-bold">mattszein</span></h2>
        </div>

        {LinkList.map((link, index) => (
          link.kind === LinkKind.Folder ? (
            <Folder
              key={index}
              link={link}
              isSelected={index === selected}
              onSelect={() => setSelected(index)}
            />
          ) : (
            <File
              key={index}
              link={link}
              isSelected={index === selected}
              onSelect={() => setSelected(index)}
              innerRef={(el) => { links.current[index] = el }}
            />
          )
        ))}
      </nav>
    </aside >
  );
}
