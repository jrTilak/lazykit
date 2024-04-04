import Link from "next/link";

const OnThisPage = () => {
  return (
    <div className="h-full shadow-lg w-full pt-12 px-4 flex flex-col gap-4">
      <h3 className="text-lg">On This Page</h3>
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
