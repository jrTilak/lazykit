import Sidebar from "@/app/(pages)/docs/_components/sidebar";
import OnThisPage from "./_components/on-this-page";
import PrevNext from "./_components/prev-next";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="grid grid-cols-8">
      <div className="col-span-2">
        <Sidebar />
      </div>
      <main className="col-span-5 flex flex-col ">
        {children}
        <PrevNext />
      </main>
      <OnThisPage />
    </section>
  );
}
