import { Metadata } from "next";
import { GITHUB_INFO, PACKAGE_INFO } from "@/data/info";
import Link from "next/link";
import { marked } from "marked";
import { Fragment } from "react";

const ChangeLog = async () => {
  const getReleasePRs = async () => {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_INFO.user}/${GITHUB_INFO.repo}/pulls?&state=closed`,
      {
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      }
    );
    const data = await res.json();
    if (res.status !== 200) return [];
    const filteredData = data.filter(
      (pr: any) =>
        pr.labels.some((label: any) => label.name === "release") &&
        pr.state === "closed"
    );
    return filteredData as {
      title: string;
      body: string;
      html_url: string;
    }[];
  };
  const data = await getReleasePRs();
  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <div className="flex flex-col gap-2">
          <h1 className=" text-2xl sm:text-3xl lg:text-4xl font-bold">
            ChangeLog
          </h1>
        </div>
        {data?.map((pr, i) => (
          <Fragment key={i}>
            <div className="flex flex-col gap-3">
              <h3
                className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
                id={pr.title.replace(/ /g, "-")}
              >
                <Link target="_blank" href={pr.html_url} className="min-w-max">
                  <span className="hover:underline">
                    {i + 1}. {pr.title.substring(0, 50)}
                    {pr.title.length > 50 ? "..." : ""}
                  </span>
                </Link>
              </h3>
              <div className="prose overflow-x-hidden ml-3 lg:ml-6">
                {(() => {
                  return (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: marked.parse(pr.body || ""),
                      }}
                    />
                  );
                })()}
              </div>
            </div>
            <hr />
          </Fragment>
        ))}
      </div>
    </>
  );
};
export default ChangeLog;

export const changeLogMetaData: Metadata = {
  title: "Changelog | " + PACKAGE_INFO.name,
};
