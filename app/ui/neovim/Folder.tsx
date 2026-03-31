"use client";
import React, { useState } from "react";
import clsx from "clsx";
import FolderIcon from "@/app/ui/icons/FolderIcon";
import FolderOpen from "@/app/ui/icons/FolderOpen";
import { LinkItem } from "@/app/ui/link_list";

interface FolderProps {
  link: LinkItem;
  isSelected: boolean;
  onSelect: () => void;
}

const Folder: React.FC<FolderProps> = ({ link, isSelected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleFolder = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
    onSelect();
  };

  const Icon = isOpen ? FolderOpen : FolderIcon;

  return (
    <div
      className={clsx(
        "group flex items-center space-x-2 hover:bg-stone-700 py-1 px-4 cursor-pointer",
        { "bg-stone-700": isSelected },
      )}
      onClick={toggleFolder}
    >
      <span>|{link.level === 0 && "-"} {link.level === 1 && "|--"}</span>
      <Icon
        className={clsx("group-hover:text-stone-700 text-gruvbox-blue h-4", {
          "ml-12": link.level === 1,
        })}
      />
      <span className="font-bold text-gruvbox-green">{link.title}</span>
    </div>
  );
};

export default Folder;
