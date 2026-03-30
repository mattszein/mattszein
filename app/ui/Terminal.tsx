import Tree from "@/app/ui/Tree";
import Line from "@/app/ui/neovim/Line";
import BottomStatusLine from "@/app/ui/neovim/BottomStatusLine";
import { NVIM_CONTENT, NVIM_TEXT_CONTENT } from "@/app/ui/utils/types"

export default function Terminal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 bg-neutral-800 text-gruvbox-fg overflow-hidden snap-align-none rounded-lg m-1 border-2 border-sky-500">
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
    </div >
  );
}
