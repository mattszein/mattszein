import ReactIcon from "@/app/ui/icons/ReactIcon";
import IgnoreIcon from "@/app/ui/icons/IgnoreIcon";
import MdIcon from "@/app/ui/icons/MdIcon";

export enum LinkKind {
  Folder = "FOLDER",
  File = "FILE",
}

export type FileType = "tsx" | "ts" | "md" | "gitignore" | "git";

export const FileIcons: Record<FileType, typeof ReactIcon | typeof IgnoreIcon | typeof MdIcon> = {
  tsx: ReactIcon,
  ts: ReactIcon, // Using ReactIcon for TS as well for now
  md: MdIcon,
  gitignore: IgnoreIcon,
  git: IgnoreIcon,
};

export interface LinkItem {
  title: string;
  href: string;
  level: number;
  kind: LinkKind;
  fileType?: FileType;
}

export const LinkList: LinkItem[] = [
  { href: "", title: "me", level: 0, kind: LinkKind.Folder },
  { href: "/about", title: "About.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "/coding", title: "Coding.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "/nutrition", title: "Nutrition.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "/tech_stack", title: "TechStack.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "/training", title: "Training.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "", title: "nexaworld", level: 0, kind: LinkKind.Folder },
  { href: "/nexaworld", title: "Manifesto.tsx", level: 1, kind: LinkKind.File, fileType: "tsx" },
  { href: "", title: "projects", level: 0, kind: LinkKind.Folder },
  {
    href: "/projects/pro_rails",
    title: "ProRails.tsx",
    level: 1,
    kind: LinkKind.File,
    fileType: "tsx"
  },
  {
    href: "/projects/devaiflow",
    title: "DevAIFlow.tsx",
    level: 1,
    kind: LinkKind.File,
    fileType: "tsx"
  },
  {
    href: "/projects/audiplayer",
    title: "AudiPlayer.tsx",
    level: 1,
    kind: LinkKind.File,
    fileType: "tsx"
  },
  { href: "/gitignore", title: ".gitignore", level: 0, kind: LinkKind.File, fileType: "gitignore" },
  { href: "/", title: "README.md", level: 0, kind: LinkKind.File, fileType: "md" },
];
