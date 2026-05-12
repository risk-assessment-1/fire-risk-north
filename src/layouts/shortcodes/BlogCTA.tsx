import { FaArrowRight, FaShieldHalved } from "react-icons/fa6";
import React from "react";

const BlogCTA = ({ label, href }: { label: string; href: string }) => {
  return (
    <div className="not-prose my-8">
      <a
        href={href}
        className="btn btn-primary text-white inline-flex items-center gap-2 no-underline"
      >
        {label}
        <FaArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

export default BlogCTA;
