import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { LinkItem, FileIcons } from "@/app/ui/linkList";

interface FileProps {
  link: LinkItem;
  isSelected: boolean;
  onSelect: () => void;
  innerRef: (el: HTMLAnchorElement | null) => void;
}

const File: React.FC<FileProps> = ({ link, isSelected, onSelect, innerRef }) => {
  const Icon = link.fileType ? FileIcons[link.fileType] : null;

  return (
    <Link
      ref={innerRef}
      className={clsx(
        "group flex items-center space-x-2 hover:bg-stone-700 py-1 px-4",
        { "bg-stone-700": isSelected },
      )}
      href={link.href}
      onClick={onSelect}
    >
      <span>|{link.level === 0 && "-"} {link.level === 1 && "|--"}</span>
      {Icon && (
        <Icon
          className={clsx("group-hover:text-stone-700 text-gruvbox-blue h-4", {
            "ml-12": link.level === 1,
          })}
        />
      )}
      <span className="font-bold">{link.title}</span>
    </Link>
  );
};

export default File;
