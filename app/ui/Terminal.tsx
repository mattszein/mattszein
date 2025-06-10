import Header from "@/app/ui/Header";
import Tree from "@/app/ui/Tree";
import Line from "@/app/ui/neovim/Line";

export default function Terminal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 bg-zinc-800 text-white overflow-hidden snap-align-none">
      <Header />
      <main className="flex flex-1 overflow-hidden snap-align-none font-mono text-lg text-white">
        <Tree />
        <Line />
        <section className="flex-1 overflow-auto no-scrollbar snap-align-none text-white px-4 break-words break-normal ">
          <div id="terminal-content">
            {children}
          </div>

        </section>
      </main>
    </div>
  );
}
