export const ROOT_LOCATION_SLUGS = [
  "blackpool",
  "liverpool",
  "manchester",
  "preston",
  "lancashire",
  "bolton",
  "blackburn",
  "bury",
  "chorley",
  "lancaster",
  "leyland",
  "oldham",
  "rochdale",
  "salford",
  "wigan",
] as const;

export type RootLocationSlug = (typeof ROOT_LOCATION_SLUGS)[number];

export const isRootLocation = (slug: string): slug is RootLocationSlug =>
  (ROOT_LOCATION_SLUGS as readonly string[]).includes(slug);

export const locationPath = (slug: string) =>
  isRootLocation(slug)
    ? `/fire-risk-assessments-${slug}`
    : `/locations/${slug}`;
