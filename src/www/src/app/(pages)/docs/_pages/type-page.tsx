import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { readFileAsString } from "@/utils/readFiles";
import { capitalCase } from "change-case";
import registry from "@/configs/registry.json";
import Link from "next/link";

const TypePage = async ({ type }: { type: string }) => {
  const typeInfo = readFileAsString(`src/registry/${type}/info.txt`);
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
          {typeInfo &&
            typeInfo.split("\n").map((item: string, index: number) => (
              <p
                key={index}
                className="text-sm sm:text-base md:text-lg text-muted-foreground"
              >
                {item}
              </p>
            ))}
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="initial-setup"
          >
            <span>1. Available Methods</span>
            <hr />
          </h3>
          <div className="flex flex-col gap-5">
            {arrayOfAllCategoriesWithMethods.map((category, index) => (
              <div key={index} className="flex flex-col gap-3 mt-4">
                <div className="flex flex-col gap-1">
                  <h4 className="text-lg sm:text-xl">
                    {capitalCase(category.category)}
                  </h4>
                </div>
                <ul className="flex flex-col pl-4 list-inside list-decimal">
                  {category.methods.map((method, index) => (
                    <li
                      key={index}
                      className="text-lg sm:text-xl text-muted-foreground hover:text-foreground"
                    >
                      <Link
                        className="underline"
                        href={`/docs/${type}/${category.category}/${method.name}`}
                      >
                        {method.name}
                      </Link>
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
