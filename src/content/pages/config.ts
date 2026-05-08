import { defineCollection } from "astro:content";
import { z } from "astro/zod";

const elementsCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    draft: z.boolean().optional(),
  }),
});

const privacyCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    description: z.string(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  elements: elementsCollection,
  privacy: privacyCollection,
};
