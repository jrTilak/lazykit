import { NextRequest, NextResponse } from "next/server";
import registry from "@/configs/registry.json";
import omit from "@/registry/functions/objects/omit";

export const GET = async (req: NextRequest) => {
  const getAll = req.nextUrl.searchParams.get("all");
  const names = (req.nextUrl.searchParams.get("name") ?? "")
    .split(",")
    .map((name) => name.trim());
  const lang =
    (req.nextUrl.searchParams.get("lang") || "ts") === "typescript"
      ? "ts"
      : "js";

  if (getAll === "true") {
    return NextResponse.json(
      registry.map((item) => ({
        name: item.name,
        category: item.category,
        type: item.type,
      })),
      {
        status: 200,
      }
    );
  }

  const res = registry.filter((item) => names.includes(item.name));

  return NextResponse.json(
    {
      data: res.map((item) => ({
        ...omit(item, ["props"]),
        code: item.code[lang],
      })),
    },
    {
      status: 200,
    }
  );
};
