import Header from "@/app/ui/Header";
import Tree from "@/app/ui/Tree";

export default function Terminal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col flex-1 bg-zinc-800 text-white overflow-hidden snap-align-none">
      <Header />
      <main className="flex flex-1 overflow-hidden snap-align-none">
        <Tree />
        <section className="flex-1 p-4 text-sm overflow-auto no-scrollbar snap-align-none">
          {children}
        </section>
      </main>
    </div>
  );
}
