import { Button } from "@/components/ui/button";
import Link from "next/link";
import githubIcon from "@/assets/icons/github-142-svgrepo-com.svg";
import { CREATOR_INFO, GITHUB_INFO, PACKAGE_INFO } from "@/data/info";
import Image from "next/image";
import { Announcement } from "@/components/globals/announce";
import { ANNOUNCEMENT_DATA } from "@/data/announcement";
import { Separator } from "@/components/ui/separator";
import registry from "@/.generated/registry";
import InitCommand from "./_components/init-command";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Fragment } from "react";
export default async function Home() {
  const getGithubStars = async () => {
    const res = await fetch(GITHUB_INFO.api, {
      next: {
        revalidate: 60 * 60, // 1 hour
      },
    });
    const data = await res.json();
    return data.stargazers_count;
  };

  const getWeeklyDownloads = async () => {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/last-week/${PACKAGE_INFO.name}`,
      {
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      }
    );
    const data = await res.json();
    return data.downloads;
  };

  const stars = await getGithubStars();
  const weeklyDownloads = await getWeeklyDownloads();

  return (
    <>
      <main className="flex flex-col gap-8 md:gap-16 xl:gap-24 pt-[10vh] md:pt-[15vh] lg:pt-[20vh] items-center justify-center text-center px-2 min-h-[calc(100vh-180px)]">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex flex-col gap-2 items-center justify-center max-w-4xl">
            <Announcement {...ANNOUNCEMENT_DATA} />
            <div className="flex flex-col gap-3 sm:gap-5 items-center justify-center">
              <h1 className="text-3xl sm:text-5xl !font-semibold">
                Drop the Excess,
                <br className="md:hidden" /> Keep the Impact!
              </h1>
              <p className="max-w-lg text-muted-foreground text-base sm:text-xl">
                Refine your JavaScript, React, and TypeScript workflows with LazyKit.
                A concentrated toolkit of powerful snippets—no excess, all essence.
              </p>
              <div className="flex gap-4">
                <Link href="/docs">
                  <Button className="px-6">Get Started</Button>
                </Link>
                <Link href={GITHUB_INFO.url} target="_blank">
                  <Button
                    variant="secondary"
                    className="border border-gray-300 dark:border-gray-600 px-4 flex gap-3 items-center justify-center"
                  >
                    <Image
                      src={githubIcon}
                      alt="Github"
                      height={18}
                      width={18}
                      className="dark:invert"
                    />
                    <span>GitHub</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <InitCommand />
        </div>
        <div className="flex gap-3 sm:gap-6 items-center justify-center">
          <Card>
            <CardContent className="grid grid-cols-[1fr_10px_1fr] sm:flex items-center gap-y-4 gap-x-9 justify-center p-6 text-center">
              {[
                {
                  title: Object.values(registry).filter((method) => method.type === "functions").length,
                  description: "Utility Functions",
                },
                {
                  title: Object.values(registry).filter((method) => method.type === "react-hooks").length,
                  description: "React Hooks",
                },
                {
                  title: `${weeklyDownloads || 0}+`,
                  description: "Weekly Downloads",
                },
                {
                  title: stars || "0",
                  description: "GitHub Stars",
                },
              ].map((stats, i) => (
                <Fragment key={i}>
                  {i !== 0 && (
                    <Separator
                      orientation="vertical"
                      className="h-14 w-px hidden max-sm:[&:nth-child(2)]:block max-sm:[&:nth-child(7)]:block sm:block"
                    />
                  )}
                  {i === 2 && (
                    <Separator
                      orientation="horizontal"
                      className="h-px w-full sm:hidden col-span-3"
                    />
                  )}
                  <div className="flex flex-col items-center justify-center">
                    <h3 className="text-xl md:text-2xl xl:text-3xl font-medium">
                      {stats.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {stats.description}
                    </p>
                  </div>
                </Fragment>
              ))}
            </CardContent>
          </Card>

        </div>
      </main>
      <footer className="w-full px-4 sm:px-12 pt-3 pb-6 border-t border-muted dark:border-gray-900 mt-8 text-center lg:text-start">
        <p>
          Created by{" "}
          <Link
            href={CREATOR_INFO.website}
            target="_blank"
            className="text-primary dark:text-primary-foreground underline"
          >
            @{CREATOR_INFO.username}
          </Link>{" "}
          and with ❤️ from the{" "}
          <Link
            href={GITHUB_INFO.url + "/graphs/contributors"}
            target="_blank"
            className="text-primary dark:text-primary-foreground underline"
          >
            community.
          </Link>
        </p>
      </footer>
    </>
  );
}

export const metadata: Metadata = {
  title: PACKAGE_INFO.name,
  description: PACKAGE_INFO.description,
};
