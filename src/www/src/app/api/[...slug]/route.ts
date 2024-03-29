import { NextRequest, NextResponse } from "next/server";
import registry from "../../../configs/registry.json";
interface Context {
  params: {
    slug: string[];
  };
}

export const GET = async (req: NextRequest, context: Context) => {
  if (context.params.slug.length !== 2) {
    return NextResponse.json(
      {
        status: 400,
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }

  const [type, name] = context.params.slug;
  const lang = (req.nextUrl.searchParams.get("lang") || "ts") as
    | "ts"
    | "js"
    | "cjs";

  const res = registry.find((item) => item.type === type && item.name === name);

  if (!res || !res.code[lang]) {
    return NextResponse.json(
      {
        status: 404,
        message: "Not found",
      },
      {
        status: 400,
      }
    );
  }

  return NextResponse.json(
    {
      ...res,
      code: res.code[lang],
    },
    {
      status: 200,
    }
  );
};
