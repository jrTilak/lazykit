"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { GITHUB_INFO } from "@/data/info";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const OnThisPage = () => {
  const pathname = usePathname();
  const [isGettingH3, setIsGettingH3] = useState(true);
  const [links, setLinks] = useState<
    {
      title: string;
      id: string;
    }[]
  >([]);
  const scrollToTop = () => {
    const mainContent = document.querySelector("main#main-content");
    mainContent?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const getAllH3 = () => {
      console.log("getAllH3");
      const mainContent = document.querySelector("main#main-content");
      if (!mainContent) return;
      const h3s = mainContent.querySelectorAll("h3");
      const filteredLinks = Array.from(h3s).filter((h3) => {
        const num = h3.textContent?.split(".")[0];
        return !isNaN(parseInt(num || ""));
      });
      const links = filteredLinks.map((h3) => ({
        title: h3.textContent || "",
        id: h3.id,
      }));
      setLinks(links);
      setIsGettingH3(false);
    };

    getAllH3();
  }, [pathname]);

  return (
    <div className="h-full shadow-lg w-full pt-12 px-4 flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <button onClick={scrollToTop}>
          <h3 className="text-lg truncate">On This Page</h3>
        </button>
        <Link
          href={GITHUB_INFO.url + "/issues/"}
          className="hover:text-primary scale-105"
          title="Report an issue"
          target="_blank"
        >
          <TriangleAlert className="h-4 w-4" />
        </Link>
      </div>
      <div className="flex flex-col gap-1 ml-3 text-base text-muted-foreground ">
        {!isGettingH3 ? (
          links.map(({ id, title }, index) => (
            <Link
              key={index}
              href={`#${id}`}
              className="hover:text-foreground hover:underline truncate"
            >
              {title}
            </Link>
          ))
        ) : (
          <>
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <Skeleton key={index} className="h-6 w-[80%]" />
              ))}
          </>
        )}
      </div>
    </div>
  );
};
export default OnThisPage;
