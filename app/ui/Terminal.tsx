import Header from "@/app/ui/Header";

export default function Terminal({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen bg-zinc-800 text-white">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <section className="flex-1 p-4 text-sm">{children}</section>
      </main>
    </div>
  );
}
