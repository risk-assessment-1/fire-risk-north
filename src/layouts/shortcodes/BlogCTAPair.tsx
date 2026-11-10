import { FaArrowRight, FaPhone } from "react-icons/fa6";
import React from "react";

interface IBlogCTAPair {
  quoteLabel?: string;
  quoteHref?: string;
  callLabel?: string;
  callHref?: string;
}

const BlogCTAPair: React.FC<IBlogCTAPair> = ({
  quoteLabel = "Get a Quote",
  quoteHref = "/contact",
  callLabel = "Call: +44 161 987 1020",
  callHref = "tel:+441619871020",
}) => {
  return (
    <div className="not-prose my-8 flex flex-col justify-start gap-4 sm:flex-row sm:items-center">
      <a
        href={quoteHref}
        className="btn rounded-full bg-linear-to-r from-[#f8714b] via-[#ef4444] to-[#e15b31] text-white inline-flex w-full items-center justify-center gap-2 whitespace-nowrap no-underline sm:w-72"
      >
        {quoteLabel}
        <FaArrowRight className="h-3.5 w-3.5" />
      </a>
      <a
        href={callHref}
        className="btn rounded-full border-2 border-[#ef4444] bg-transparent text-[#b91c1c] inline-flex w-full items-center justify-center gap-2 whitespace-nowrap no-underline transition-colors hover:bg-[#ef4444] hover:text-white sm:w-72"
      >
        <FaPhone className="h-3.5 w-3.5" />
        {callLabel}
      </a>
    </div>
  );
};

export default BlogCTAPair;
