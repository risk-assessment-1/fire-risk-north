import React from "react";

const RawHTML = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);

export default RawHTML;
