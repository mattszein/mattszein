import ReactIcon from "@/app/ui/icons/ReactIcon";
import IgnoreIcon from "@/app/ui/icons/IgnoreIcon";
import MdIcon from "@/app/ui/icons/MdIcon";
import FolderIcon from "@/app/ui/icons/FolderIcon";

export type LinkTree = Array<{
  title: string;
  href: string;
  icon: typeof ReactIcon | typeof IgnoreIcon | typeof MdIcon;
  level: number;
}>;

export const LinkList = [
  { href: "", title: "/me", icon: FolderIcon, level: 0 },
  { href: "/about", title: "about.tsx", icon: ReactIcon, level: 1 },
  { href: "/nutrition", title: "nutrition.tsx", icon: ReactIcon, level: 1 },
  { href: "/tech_stack", title: "tech_stack.tsx", icon: ReactIcon, level: 1 },
  { href: "/training", title: "training.tsx", icon: ReactIcon, level: 1 },
  { href: "/gitignore", title: ".gitignore", icon: IgnoreIcon, level: 0 },
  { href: "/", title: "Readme.md", icon: MdIcon, level: 0 },
];
