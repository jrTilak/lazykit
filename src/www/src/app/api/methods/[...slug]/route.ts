import { NextRequest, NextResponse } from "next/server";
import registry from "@/configs/registry.json";
import omit from "@/registry/functions/objects/omit";
interface Context {
  params: {
    slug: string[];
  };
}

export const GET = async (req: NextRequest, context: Context) => {
  const [name] = context.params.slug;
  const lang = (req.nextUrl.searchParams.get("lang") || "ts") as "ts" | "js";

  const res = registry.find((item) => item.name === name);

  if (!res || !res.code[lang]) {
    return NextResponse.json(
      {
        status: 404,
        message: "Not found",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json(
    {
      ...omit(res, ["props"]),
      code: res.code[lang],
    },
    {
      status: 200,
    }
  );
};
