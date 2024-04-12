import { capitalCase } from "change-case";
import registry from "@/configs/registry.json";
import Link from "next/link";

const TypePage = async ({ type }: { type: string }) => {
  const allMethodsOfThisType = registry.filter((item) => item.type === type);

  const categories = allMethodsOfThisType.reduce((acc, item) => {
    if (!acc.includes(item.category)) {
      acc.push(item.category);
    }
    return acc;
  }, [] as string[]);

  const arrayOfAllCategoriesWithMethods = categories.map((category) => {
    return {
      category,
      methods: allMethodsOfThisType.filter(
        (item) => item.category === category
      ),
    };
  });

  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
            {capitalCase(type)}
          </h1>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-5">
            {arrayOfAllCategoriesWithMethods.map((category, index) => (
              <div key={index} className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg sm:text-xl" id={index.toString()}>
                    {index + 1}. {capitalCase(category.category)}
                  </h3>
                </div>
                <ul className="flex flex-col pl-4 list-inside list-decimal">
                  {category.methods.map((method, index) => (
                    <li
                      key={index}
                      className="text-base sm:text-lg text-muted-foreground hover:text-foreground flex max-w-full gap-2"
                    >
                      <Link
                        className="underline"
                        href={`/docs/${type}/${category.category}/${method.name}`}
                      >
                        {method.name}
                      </Link>
                      {(async () => {
                        const { Info } = await import(
                          `@/registry/${type}/${category.category}/${method.name}/docs.tsx`
                        );
                        return (
                          <p className="text-sm sm:text-base truncate self-end">
                            : {Info.description}
                          </p>
                        );
                      })()}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default TypePage;
