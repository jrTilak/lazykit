import { GITHUB_INFO } from "@/data/info";
import { OctagonAlert, TriangleAlert } from "lucide-react";
import Link from "next/link";

const OnThisPage = () => {
  return (
    <div className="h-full shadow-lg w-full pt-12 px-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg">On This Page</h3>
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
        {["Code", "Installation", "Description", "Props", "Examples"].map(
          (item, index) => (
            <Link
              key={index}
              href={`#${item.toLowerCase()}`}
              className="hover:text-foreground hover:underline"
            >
              {index + 1}. {item}
            </Link>
          )
        )}
      </div>
    </div>
  );
};
export default OnThisPage;
