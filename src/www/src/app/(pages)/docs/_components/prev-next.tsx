"use client";
import { Button } from "@/components/ui/button";
import prevNextButtonLinks from "@/configs/prev-next-button-links.json";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
const PrevNext = () => {
  const pathname = usePathname();
  const router = useRouter();
  const indexOfCurrentPage = prevNextButtonLinks.findIndex(
    (link) => link.url === pathname
  );
  return (
    <div className="w-full flex justify-between items-center gap-4">
      {indexOfCurrentPage > 0 ? (
        <Button
          variant="secondary"
          className="flex items-center justify-center gap-2"
          onClick={() =>
            router.push(prevNextButtonLinks[indexOfCurrentPage - 1]?.url)
          }
        >
          <ChevronLeft className="w-5 h-5" />
          <span>{prevNextButtonLinks[indexOfCurrentPage - 1]?.label}</span>
        </Button>
      ) : (
        <span></span>
      )}
      {indexOfCurrentPage < prevNextButtonLinks.length - 1 ? (
        <Button
          variant="default"
          className="flex items-center justify-center gap-2"
          onClick={() =>
            router.push(prevNextButtonLinks[indexOfCurrentPage + 1]?.url)
          }
        >
          {prevNextButtonLinks[indexOfCurrentPage + 1]?.label}
          <ChevronRight className="w-5 h-5" />
        </Button>
      ) : (
        <span></span>
      )}
    </div>
  );
};
export default PrevNext;
