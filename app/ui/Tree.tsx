"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { LinkList } from "@/app/ui/link_list";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { useHotkeys } from "react-hotkeys-hook";
import FolderOpen from "@/app/ui/icons/FolderOpen";
import ExplorerSearch from "@/app/ui/neovim/ExplorerSearch";

export default function Tree() {
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const pathname = usePathname();
  const getIndexLink = useMemo(() => {
    return LinkList.findIndex((link) => {
      return link.href === pathname;
    });
  }, [pathname]);
  // const [hidden, setHidden] = useState(true);
  const [isNeovimTree, neovimTreeLink] = useStore(
    useShallow((state) => [state.isNeovimTree, state.neovimTreeLink]),
  );
  const [selected, setSelected] = useState(neovimTreeLink);

  useHotkeys("j", () => changeLink(1), { enabled: isNeovimTree });
  useHotkeys("k", () => changeLink(-1), { enabled: isNeovimTree });

  const changeLink = (number: number) => {
    if (selected + number >= 0 && selected + number < LinkList.length) {
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
          <h2 className="group flex items-center space-x-2 hover:bg-gray-700 py-1"><FolderOpen className="h-4 text-blue-300" /><span className="text-gruvbox-green font-bold">mattszein</span></h2>
        </div>

        {LinkList.map((link, index) => (
          <Link
            key={index}
            ref={(el) => { links.current[index] = el }}
            className={clsx(
              "group flex items-center space-x-2 hover:bg-stone-700 py-1 px-4",
              { "bg-stone-700": index === selected },
            )}
            href={link.href}
          > |{link.level === 0 && "-"} {link.level === 1 && "|--"}
            <link.icon
              className={clsx("group-hover:text-stone-700 text-gruvbox-blue h-4", {
                "ml-12": link.level === 1,
              })}
            />
            <span className={clsx("font-bold", { "text-gruvbox-green": link.kind === "FOLDER" })}>{link.title}</span>
          </Link>
        ))}
      </nav>
    </aside >
  );
}
