import Sidebar from "@/app/(pages)/docs/_components/sidebar";
import OnThisPage from "./_components/on-this-page";
import PrevNext from "./_components/prev-next";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid grid-cols-12 h-full gap-12">
      <div className="col-span-3 h-full">
        <Sidebar />
      </div>
      <main className="col-span-7 flex flex-col h-full pt-12 gap-6">
        {children}
        <PrevNext />
      </main>
      <div className="col-span-2 h-full">
        <OnThisPage />
      </div>
    </section>
  );
}
