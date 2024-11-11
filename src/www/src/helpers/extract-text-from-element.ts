import React from "react";

export function extractTextFromElement(
  element: React.ReactNode | React.ReactElement
) {
  let text = "";

  React.Children.forEach(element, (child) => {
    // If the child is a string, append it to the text
    if (typeof child === "string") {
      text += child;
    }
    // If it's a React element, recurse into its children
    else if (React.isValidElement(child) && child.props.children) {
      text += extractTextFromElement(child.props.children);
    }
  });

  return text;
}
