import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const commonFields = {
  title: z.string(),
  description: z.string(),
  meta_title: z.string().optional(),
  date: z.coerce.date().optional(),
  image: z.string().optional(),
  draft: z.boolean().optional(),
};

const heroSchema = z
  .object({
    enable: z.boolean().default(false),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    price: z.string().optional(),
    badges: z.array(z.object({ label: z.string() })).optional(),
  })
  .optional();

const whoNeedsFraSchema = z
  .object({
    enable: z.boolean().default(false),
    intro: z.string(),
    categories: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        links: z
          .array(
            z.object({
              label: z.string(),
              slug: z.string(),
            }),
          )
          .optional(),
      }),
    ),
    exemptions: z.string(),
  })
  .optional();

const fiveStepsFraSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    steps: z.array(
      z.object({
        number: z.number(),
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      }),
    ),
  })
  .optional();

const fraCostsSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    rows: z.array(
      z.object({
        property_type: z.string(),
        description: z.string(),
        price: z.string(),
        slug: z.string().optional(),
      }),
    ),
    factors_note: z.string().optional(),
  })
  .optional();

const legislationTimelineSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    items: z.array(
      z.object({
        year: z.string(),
        title: z.string(),
        description: z.string(),
      }),
    ),
  })
  .optional();

const faqSectionSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    items: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ),
  })
  .optional();

const hazardCardsSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    cards: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        assessment: z.string().optional(),
        image: z.string().optional(),
        icon: z.string().optional(),
      }),
    ),
  })
  .optional();

const complianceHighlightSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    heading_accent: z.string().optional(),
    subtitle: z.string().optional(),
    highlights: z.array(
      z.object({
        title: z.string().optional(),
        stat: z.string().optional(),
        description: z.string(),
      }),
    ),
    body: z.string(),
    cta: z
      .object({
        label: z.string(),
        href: z.string(),
      })
      .optional(),
  })
  .optional();

const areasCoveredSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    description: z.string().optional(),
    regions: z
      .array(
        z.object({
          title: z.string(),
          areas: z.string(),
        }),
      )
      .optional(),
    locations: z
      .array(
        z.object({
          name: z.string(),
        }),
      )
      .optional(),
  })
  .optional();

const featureCardsSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    subtitle: z.string().optional(),
    cards: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().optional(),
      }),
    ),
  })
  .optional();

const propertyTypesSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    subtitle: z.string().optional(),
    types: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        href: z.string(),
      }),
    ),
    cta_label: z.string().optional(),
    cta_href: z.string().optional(),
  })
  .optional();

const servicesGridSchema = z
  .object({
    enable: z.boolean().default(false),
    heading: z.string(),
    subtitle: z.string().optional(),
    services: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        href: z.string(),
      }),
    ),
  })
  .optional();

const homepageCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/homepage" }),
  schema: z.object({
    hero_slider: z.object({
      enable: z.boolean().default(true),
      slider_item: z.array(
        z.object({
          subtitle: z.string(),
          title: z.string(),
          content: z.string(),
          bg_image: z.string(),
          button: z.object({
            enable: z.boolean().default(true),
            label: z.string(),
            link: z.string(),
          }),
        }),
      ),
    }),
    banner_feature: z.object({
      enable: z.boolean().default(true),
      feature_item: z.array(
        z.object({
          name: z.string(),
          icon: z.string(),
          content: z.string(),
        }),
      ),
    }),
    funfacts: z.object({
      enable: z.boolean().default(true),
      funfacts_item: z.array(
        z.object({
          name: z.string(),
          count: z.string(),
          icon: z.string(),
        }),
      ),
    }),
    feature: z.object({
      enable: z.boolean().default(true),
      subtitle: z.string(),
      title: z.string(),
      image: z.string(),
      content: z.string(),
      feature_item: z.array(
        z.object({
          name: z.string(),
          icon: z.string(),
          content: z.string(),
        }),
      ),
    }),
    latest_news: z.object({
      enable: z.boolean().default(true),
      show_item: z.number(),
      title: z.string(),
      sub_title: z.string(),
    }),
  }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/blog" }),
  schema: z.object({
    ...commonFields,
    author: z.string().default("Admin"),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().optional(),
  }),
});

const pagesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/pages" }),
  schema: z.object({
    ...commonFields,
  }),
});

const contactCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/contact" }),
  schema: z.object({
    ...commonFields,
  }),
});

const aboutCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/about" }),
  schema: z.object({
    ...commonFields,
    philosophy_section: z.object({
      enable: z.boolean(),
      items: z.array(
        z.object({
          title: z.string(),
          content: z.string(),
          list: z.array(z.string()),
        }),
      ),
    }),
    about_section: z.object({
      enable: z.boolean(),
      subtitle: z.string(),
      title: z.string(),
      content: z.string(),
      bg_image: z.string(),
      image: z.string(),
      button: z.object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      }),
    }),
  }),
});

const serviceCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/services" }),
  schema: z.object({
    ...commonFields,
    subtitle: z.string().optional(),
    bg_image: z.string().optional(),
    draft: z.boolean().optional(),
    icon: z.string().optional(),
    hero: heroSchema,
    who_needs_fra: whoNeedsFraSchema,
    five_steps_fra: fiveStepsFraSchema,
    fra_costs: fraCostsSchema,
    legislation_timeline: legislationTimelineSchema,
    faq_section: faqSectionSchema,
    hazard_cards: hazardCardsSchema,
    compliance_highlight: complianceHighlightSchema,
    pdf: z
      .object({
        enable: z.boolean(),
        title: z.string(),
        file: z.string(),
        size: z.string(),
      })
      .optional(),
  }),
});

const fireRiskAssessmentCollection = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "src/content/fire-risk-assessment",
  }),
  schema: z.object({
    ...commonFields,
    icon: z.string().optional(),
    hero: heroSchema,
    five_steps_fra: fiveStepsFraSchema,
    hazard_cards: hazardCardsSchema,
    fra_costs: fraCostsSchema,
    faq_section: faqSectionSchema,
    compliance_highlight: complianceHighlightSchema,
  }),
});

const locationsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/locations" }),
  schema: z.object({
    ...commonFields,
    hero: heroSchema,
    areas_covered: areasCoveredSchema,
    five_steps_fra: fiveStepsFraSchema,
    features: featureCardsSchema,
    property_types: propertyTypesSchema,
    services_grid: servicesGridSchema,
    faq_section: faqSectionSchema,
  }),
});

const testimonialCollection = defineCollection({
  loader: glob({
    pattern: "*/testimonial.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    subtitle: z.string().optional(),
    testimonials: z.array(
      z.object({
        name: z.string(),
        designation: z.string(),
        avatar: z.string(),
        content: z.string(),
      }),
    ),
  }),
});

const callToActionSchema = defineCollection({
  loader: glob({
    pattern: "*/call-to-action.{md,mdx}",
    base: "src/content/sections",
  }),
  schema: z.object({
    enable: z.boolean(),
    title: z.string(),
    image: z.string().optional(),
    description: z.string().optional(),
    button: z
      .object({
        enable: z.boolean(),
        label: z.string(),
        link: z.string(),
      })
      .optional(),
  }),
});

export const collections = {
  homepage: homepageCollection,
  blog: blogCollection,
  pages: pagesCollection,
  contact: contactCollection,
  about: aboutCollection,
  services: serviceCollection,
  "fire-risk-assessment": fireRiskAssessmentCollection,
  locations: locationsCollection,

  testimonials: testimonialCollection,
  callToAction: callToActionSchema,
};
