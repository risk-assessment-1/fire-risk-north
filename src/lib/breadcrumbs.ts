import {
  slugSelector,
  stripHtmlExt,
  supportedLang,
} from "@/lib/utils/languageParser";
import { humanize } from "@/lib/utils/textConverter";

export interface Crumb {
  label: string;
  href: string;
  "aria-label"?: string;
}

/**
 * Build breadcrumb parts for a pathname. Pure so the visible nav and the
 * BreadcrumbList schema always stay in sync.
 */
export function getBreadcrumbParts(pathname: string, lang: string): Crumb[] {
  const paths = stripHtmlExt(pathname)
    .split("/")
    .filter((x) => x);

  if (paths[0] && supportedLang.includes(paths[0])) {
    lang = paths.shift()!;
  }

  const current = stripHtmlExt(pathname);
  const baseHref = lang ? `/${lang}` : "/";

  const parts: Crumb[] = [
    {
      label: "Home",
      href: slugSelector("/", lang),
      "aria-label": current === baseHref ? "page" : undefined,
    },
  ];

  paths.forEach((label, i) => {
    if (label === "page") return;
    const href = slugSelector(`/${paths.slice(0, i + 1).join("/")}`, lang);
    parts.push({
      label: humanize(label.replace(/[-_]/g, " ")),
      href,
      "aria-label": current === href ? "page" : undefined,
    });
  });

  return parts;
}

export function buildBreadcrumbSchema(parts: Crumb[], baseUrl: string) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: parts.map((part, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: part.label,
      item: `${baseUrl}${part.href}`,
    })),
  };
}
