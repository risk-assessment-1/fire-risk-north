import type { ImageMetadata } from "astro";
import config from "@/config/config.json";

// Brand naming is pending a decision (firerisknorth-issues.md).
// config.site.title ("Fire Assessment North") is the single source of truth;
// ALTERNATE_NAME is the only other place a brand name is declared, so the
// eventual swap is a one-line change here.
const BASE_URL = config.site.base_url;
const SITE_NAME = config.site.title;
const ALTERNATE_NAME = "Fire Risk North";
const ORG_ID = `${BASE_URL}/#organization`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Bartle House, 9 Oxford Court",
  addressLocality: "Manchester",
  addressRegion: "Greater Manchester",
  postalCode: "M2 3WQ",
  addressCountry: "GB",
};

const organizationRef = {
  "@id": ORG_ID,
  "@type": "Organization",
  name: SITE_NAME,
  url: BASE_URL,
};

const isoDate = (date: Date | string) => new Date(date).toISOString();

const imageUrl = (image: string | ImageMetadata | undefined) => {
  if (!image) return undefined;
  const src = typeof image === "object" ? image.src : image;
  return src.startsWith("http") ? src : `${BASE_URL}${src}`;
};

// "£325 – £700" → min/max, "From £249" → single price, "Price on Request" → null
const priceSpecification = (price: string) => {
  const amounts = (price.match(/£[\d,.]+/g) || [])
    .map((match) => Number(match.replace(/[£,]/g, "")))
    .filter((amount) => !Number.isNaN(amount) && amount > 0);
  if (amounts.length === 0) return null;
  if (amounts.length === 1) {
    return {
      "@type": "PriceSpecification",
      price: amounts[0],
      priceCurrency: "GBP",
    };
  }
  return {
    "@type": "PriceSpecification",
    minPrice: Math.min(...amounts),
    maxPrice: Math.max(...amounts),
    priceCurrency: "GBP",
  };
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: SITE_NAME,
  alternateName: ALTERNATE_NAME,
  description: config.params.footer_content,
  inLanguage: "en-GB",
  publisher: organizationRef,
};

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: ALTERNATE_NAME,
  url: BASE_URL,
  logo: `${BASE_URL}${config.site.logo}`,
  telephone: config.params.phone,
  email: config.params.email,
  address: postalAddress,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: config.params.phone,
    email: config.params.email,
    contactType: "customer service",
    availableLanguage: "en-GB",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "17:00",
      },
    ],
  },
  hasCertification: [
    { name: "UKAS Accredited", issuer: "UKAS" },
    { name: "PAS 79 Compliant", issuer: "BSI" },
    { name: "ISO Certified", issuer: "ISO" },
  ].map((cert) => ({
    "@type": "Certification",
    name: cert.name,
    issuedBy: { "@type": "Organization", name: cert.issuer },
    certificationStatus: "https://schema.org/CertificationActive",
  })),
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${BASE_URL}/#localbusiness`,
  name: SITE_NAME,
  alternateName: ALTERNATE_NAME,
  url: BASE_URL,
  telephone: config.params.phone,
  image: `${BASE_URL}${config.site.logo}`,
  priceRange: "££",
  address: postalAddress,
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 5,
    bestRating: 5,
    worstRating: 1,
    reviewCount: 3,
    ratingCount: 3,
  },
};

interface PricingRow {
  property_type: string;
  description: string;
  price: string;
}

export interface PriceData {
  hero_price?: string;
  costs?: { rows?: PricingRow[] };
}

export function buildServiceSchema(opts: {
  title: string;
  description?: string;
  image?: string | ImageMetadata;
  priceData?: PriceData | null;
}) {
  const image = imageUrl(opts.image);
  const rows = opts.priceData?.costs?.rows || [];
  const heroAmount = Number(
    (opts.priceData?.hero_price || "").replace(/[^0-9.]/g, ""),
  );

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.title,
    serviceType: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    ...(image ? { image } : {}),
    provider: organizationRef,
    areaServed: {
      "@type": "AdministrativeArea",
      name: "England, United Kingdom",
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${BASE_URL}/contact`,
      servicePhone: {
        "@type": "ContactPoint",
        telephone: config.params.phone,
        contactType: "sales",
        availableLanguage: "en-GB",
      },
    },
    ...(heroAmount > 0
      ? {
          offers: { "@type": "Offer", price: heroAmount, priceCurrency: "GBP" },
        }
      : {}),
    ...(rows.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${opts.title} pricing`,
            itemListElement: rows.map((row) => {
              const spec = priceSpecification(row.price);
              return {
                "@type": "Offer",
                name: row.property_type,
                description: row.description,
                ...(spec ? { priceSpecification: spec } : {}),
              };
            }),
          },
        }
      : {}),
  };
}

export function buildBlogPostingSchema(opts: {
  title: string;
  description?: string;
  image?: string | ImageMetadata;
  keywords?: string[];
  date?: Date | string;
  url: string;
  body: string;
}) {
  const image = imageUrl(opts.image);
  const headings = opts.body
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.slice(3).trim());
  const wordCount = opts.body.split(/\s+/).filter(Boolean).length;
  const published = opts.date ? isoDate(opts.date) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${opts.url}#blogposting`,
    mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
    headline: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    ...(image
      ? {
          image: {
            "@type": "ImageObject",
            url: image,
            width: 1200,
            height: 600,
          },
        }
      : {}),
    ...(opts.keywords?.length ? { keywords: opts.keywords.join(", ") } : {}),
    wordCount,
    inLanguage: "en-GB",
    ...(headings.length
      ? {
          hasPart: headings.map((name) => ({
            "@type": "WebPageElement",
            name,
          })),
        }
      : {}),
    potentialAction: { "@type": "ReadAction", target: opts.url },
    author: organizationRef,
    publisher: {
      ...organizationRef,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}${config.site.logo}`,
      },
    },
    ...(published
      ? {
          datePublished: published,
          dateModified: published,
          dateCreated: published,
        }
      : {}),
  };
}
