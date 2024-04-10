import { PACKAGE_INFO } from "@/data/info";
import { Metadata } from "next";

const Introduction = () => {
  return (
    <>
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-12">
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="what-is-lazykit"
          >
            <span>1. What is lazykit?</span>
            <hr />
          </h3>
          <p>
            Welcome to LazyKit – the ultimate toolkit for simplifying JavaScript
            and TypeScript development. In an ever-evolving landscape of web
            technologies, developers often find themselves{" "}
            <em> reinventing the wheel </em>
            when it comes to writing utility functions for common tasks. LazyKit
            was born out of a simple yet powerful idea: to provide developers
            with a comprehensive collection of utility functions that can be
            easily added to the projects and customized to suit their needs.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="the-idea-behind-it"
          >
            <span>2. The idea behind it.</span>
            <hr />
          </h3>
          <p>
            LazyKit is built on the principle of efficiency and ease of use. The
            idea stemmed from the recognition that developers spend a
            significant amount of time writing boilerplate code for routine
            tasks such as array manipulation, string manipulation, etc. By
            centralizing these common functionalities into a place, LazyKit
            empowers developers to focus their time and energy on solving unique
            challenges and building innovative solutions.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="why-lazykit"
          >
            <span>3. Why Lazykit?</span>
            <hr />
          </h3>
          <ul className="list-decimal list-inside">
            {[
              "No need to install the entire library; simply copy and paste individual utility functions directly into your codebase.",
              "Enjoy seamless integration with direct CLI support, allowing quick addition of utility functions to your projects.",
              "Customize the utility functions to suit your needs by modifying the source code.",
            ].map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="merits"
          >
            <span>4. Merits</span>
            <hr />
          </h3>
          <ul className="list-decimal list-inside">
            {[
              "Effortless Integration with copy-paste functionality.",
              "Direct CLI support for quick addition of utility functions to your projects.",
              "No need to install the entire library like other utility libraries.",
            ].map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="demerits"
          >
            <span>5. Demerits</span>
            <hr />
          </h3>
          <ul className="list-decimal list-inside">
            {[
              "LazyKit may lack the extensive functionality provided by other alternatives, potentially limiting its suitability for projects with specific or advanced requirements.",
              "Copying and pasting each utility function individually may be time-consuming for larger projects.",
              "Might not be as efficient as other well-established utility libraries.",
            ].map((item, i) => (
              <li key={i} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-semibold flex gap-2"
            id="conclusion"
          >
            <span>6. Conclusion</span>
            <hr />
          </h3>
          <p>
            In conclusion, while other maturity and large community utility
            library are undeniable assets, LazyKit offers a fresh perspective on
            utility function libraries, prioritizing simplicity, direct
            integration, and customization. By recognizing the strengths of
            established libraries like Lodash and embracing a complementary
            approach, developers can make informed decisions that best suit
            their project requirements and development workflows.
          </p>
        </div>
      </div>
    </>
  );
};
export default Introduction;

export const introductionMetaData: Metadata = {
  title: "Introduction | " + PACKAGE_INFO.name,
};
