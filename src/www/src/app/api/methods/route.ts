import { NextRequest, NextResponse } from "next/server";
import registry from "@/.generated/registry";
import omit from "@/registry/functions/objects/omit";
import { extractImports } from "@/helpers/extract-imports";

export const GET = async (req: NextRequest) => {
  const getAll = req.nextUrl.searchParams.get("all");
  const names = (req.nextUrl.searchParams.get("name") ?? "")
    .split(",")
    .map((name) => name.trim());
  const lang =
    (req.nextUrl.searchParams.get("lang") || "ts") === "typescript"
      ? "ts"
      : "js";

  // Function to recursively gather an item and its dependencies
  const gatherItemWithDependencies = (
    itemName: string,
    collected = new Set()
  ) => {
    if (collected.has(itemName)) return []; // Avoid circular dependencies
    collected.add(itemName);

    const item = registry[itemName];
    if (!item) return [];

    const itemData = {
      ...omit(item, ["examples"]),
      code: item.code[lang],
      url: `https://lazykit.jrtilak.dev/docs/${item.type}/${item.category}/${item.name}`,
    };

    const extractedImports = extractImports(item.code[lang] ?? "").imports;
    const dependencies: any = extractedImports
      .filter((depName) => registry[depName])
      .flatMap((depName) => gatherItemWithDependencies(depName, collected));

    return [itemData, ...dependencies];
  };

  let responseData = [];

  if (getAll === "true") {
    responseData = Object.values(registry).map((item) => ({
      name: item.name,
      category: item.category,
      type: item.type,
    }));
  } else {
    const requestedItems = names.flatMap((name) =>
      gatherItemWithDependencies(name)
    );

    // Remove duplicates by converting to a Map and back to an array
    const uniqueItemsMap = new Map(
      requestedItems.map((item) => [item.name, item])
    );
    responseData = Array.from(uniqueItemsMap.values());
  }

  return NextResponse.json({ data: responseData }, { status: 200 });
};
