import Header from "@/app/ui/Header";
import Tree from "@/app/ui/Tree";
import Line from "@/app/ui/neovim/Line";
import { NVIM_CONTENT, NVIM_TEXT_CONTENT } from "@/app/ui/utils/Cursor"

export default function Terminal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 bg-zinc-800 text-white overflow-hidden snap-align-none">
      <Header />
      <main className="flex flex-1 overflow-hidden snap-align-none font-mono text-lg">
        <Tree />
        <section className="flex flex-1 overflow-auto no-scrollbar snap-align-none text-white gap-6 break-words break-normal" id={NVIM_CONTENT}>
          <Line />
          <div id={NVIM_TEXT_CONTENT}>
            {children}
          </div>

        </section>
      </main>
    </div >
  );
}
