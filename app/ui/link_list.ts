import ReactIcon from "@/app/ui/icons/ReactIcon";
import IgnoreIcon from "@/app/ui/icons/IgnoreIcon";
import MdIcon from "@/app/ui/icons/MdIcon";
import FolderIcon from "@/app/ui/icons/FolderIcon";
import FolderOpen from "@/app/ui/icons/FolderOpen";

export type LinkTree = Array<{
  title: string;
  href: string;
  icon: typeof ReactIcon | typeof IgnoreIcon | typeof MdIcon;
  level: number;
  kind: "FOLDER" | "FILE";
}>;

export const LinkList = [
  { href: "", title: "me", icon: FolderOpen, level: 0, kind: "FOLDER" },
  { href: "/about", title: "About.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "/coding", title: "Coding.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "/nutrition", title: "Nutrition.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "/tech_stack", title: "TechStack.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "/training", title: "Training.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "", title: "nexaworld", icon: FolderOpen, level: 0, kind: "FOLDER" },
  { href: "/nexaworld", title: "Manifesto.tsx", icon: ReactIcon, level: 1, kind: "FILE" },
  { href: "", title: "projects", icon: FolderOpen, level: 0, kind: "FOLDER" },
  {
    href: "/projects/pro_rails",
    title: "ProRails.tsx",
    icon: ReactIcon,
    level: 1, kind: "FILE"
  },
  {
    href: "/projects/devaiflow",
    title: "DevAIFlow.tsx",
    icon: ReactIcon,
    level: 1, kind: "FILE"
  },
  {
    href: "/projects/audiplayer",
    title: "AudiPlayer.tsx",
    icon: ReactIcon,
    level: 1,
    kind: "FILE"
  },
  { href: "/gitignore", title: ".gitignore", icon: IgnoreIcon, level: 0, kind: "FILE" },
  { href: "/", title: "Readme.md", icon: MdIcon, level: 0, kind: "FILE" },
];
