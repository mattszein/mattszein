"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { LinkList } from "@/app/ui/link_list";
import { useStore } from "@/app/ui/stores/AppStoreProvider";
import { useShallow } from "zustand/react/shallow";
import { useHotkeys } from "react-hotkeys-hook";

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
    <aside id="tree" className="overflow-y-auto border-r-2 border-zinc-600 hidden">
      <nav className="w-72 text-white text-lg">
        <div className="group flex items-center py-1">
          <h1 className="text-lg text-cyan-100 font-semibold ml-4">Neo-tree</h1>
        </div>
        <div className="group flex items-center">
          <h2 className="text-lg font-mono ml-4">~/work/projects/mattszein</h2>
        </div>

        {LinkList.map((link, index) => (
          <Link
            key={index}
            ref={(el) => { links.current[index] = el }}
            className={clsx(
              "group flex items-center space-x-2 hover:bg-gray-700 py-1",
              { "px-2": link.level == 1 },
              {
                "bg-gray-800": index === getIndexLink && index !== selected,
              },
              { "bg-gray-700": index === selected },
            )}
            href={link.href}
          >
            <link.icon
              className={clsx("group-hover:text-blue-400 ml-6", {
                "ml-8": link.level === 1,
              })}
            />
            <span>{link.title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
