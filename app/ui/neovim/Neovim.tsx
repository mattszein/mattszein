import Tree from "@/app/ui/neovim/Tree";
import Line from "@/app/ui/neovim/Line";
import BottomStatusLine from "@/app/ui/neovim/BottomStatusLine";
import { NVIM_CONTENT, NVIM_TEXT_CONTENT } from "@/app/lib/cursor-engine";

export default function Neovim({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full w-full bg-neutral-800 text-gruvbox-fg">
      <main className="flex flex-1 overflow-hidden snap-align-none font-mono text-md">
        <Tree />
        <section className="flex flex-1 overflow-auto no-scrollbar snap-align-none gap-6 break-words break-normal" id={NVIM_CONTENT}>
          <Line />
          <div id={NVIM_TEXT_CONTENT}>
            {children}
          </div>
        </section>
      </main>
      <BottomStatusLine />
    </div>
  );
}
