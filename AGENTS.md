# AGENTS.md

> **VERY IMPORTANT:** When checking the project, **do NOT use `pnpm run build`**. Only use `pnpm astro check` to verify types and correctness. Building is expensive and unnecessary for validation. Always presume dev server is running on `http://localhost:4321/`

## Project Overview

Astro 6 static site (Bexer theme) for Fire Assessment North — a UK fire safety company. English-only content, React interactive islands, Tailwind CSS v4, Cloudflare Workers deployment. Content managed via MD/MDX with Zod-validated collections.

## Build & Development Commands

```bash
pnpm dev              # Start dev server (runs jsonGenerator.js first)
pnpm build            # Production build (runs jsonGenerator.js first)
pnpm preview          # Preview production build locally
pnpm check            # TypeScript/astro type checking — run after changes
pnpm format           # Format source with Prettier (src/ only)
pnpm generate-json    # Regenerate JSON from config files
```

**No test framework is configured.** There are no test scripts or testing dependencies.

**Important:** `scripts/jsonGenerator.js` runs automatically before `dev` and `build`. Run it manually if you edit config JSON files outside those commands.

## Architecture

```
src/
├── pages/[...lang]/                # Dynamic i18n routes
│   ├── index.astro                 # Homepage
│   ├── [regular].astro             # Catch-all pages (testimonials, faq, get-a-quote, etc.)
│   ├── about.astro                 # About page
│   ├── contact.astro               # Contact page
│   ├── blog/                       # Blog listing + single posts + pagination
│   ├── services/                   # Service listing + single service
│   │   └── fire-risk-assessment/   # FRA sub-pages by building type
│   └── locations/                  # Location listing + single location
├── layouts/
│   ├── Base.astro                  # Root layout (meta, fonts, GTM, header/footer)
│   ├── components/                 # Reusable Astro components (BlogCard, ServiceCard, etc.)
│   ├── helpers/                    # React components (SearchModal, DynamicIcon)
│   ├── partials/                   # Page sections (Header, Footer, homepage sections)
│   └── shortcodes/                 # MDX shortcodes (Button, Accordion, Tabs, etc.)
├── lib/
│   ├── contentParser.astro         # Content collection query helpers
│   └── utils/                      # Pure utilities (textConverter, languageParser, etc.)
├── config/                         # JSON config files (config, theme, language, menu.en)
├── content/                        # MD/MDX content by collection, english/ only
│   ├── homepage/english/           # Homepage frontmatter (-index.md)
│   ├── about/english/              # About page
│   ├── services/english/           # 8 services + _index.md
│   ├── fire-risk-assessment/english/ # 11 building-type sub-pages
│   ├── locations/english/          # 7 location pages
│   ├── blog/english/               # Blog posts
│   ├── contact/english/            # Contact page
│   ├── pages/english/              # Static pages (testimonials, faq, get-a-quote, privacy, terms)
│   └── sections/english/          # Section data (testimonial, call-to-action)
├── i18n/en.json                    # UI translations
├── styles/                         # CSS (Tailwind v4, excluded from Prettier)
└── tailwind-plugin/                # Custom Tailwind plugins
```

## Path Aliases (tsconfig.json)

| Alias            | Resolves To                |
| ---------------- | -------------------------- |
| `@/components/*` | `src/layouts/components/*` |
| `@/shortcodes/*` | `src/layouts/shortcodes/*` |
| `@/helpers/*`    | `src/layouts/helpers/*`    |
| `@/partials/*`   | `src/layouts/partials/*`   |
| `@/*`            | `src/*`                    |

## Code Style

### Formatting

- **Indent:** 2 spaces, no tabs
- **Line endings:** LF (`\n`)
- **Prettier** with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`
- CSS in `src/styles/` is excluded from Prettier
- Run `pnpm format` after editing source files

### Astro Components (`.astro`)

- Use `---` frontmatter fence for server-side logic
- Import with `@/` path aliases — never use relative paths when an alias exists
- Destructure `Astro.props` at the top of the frontmatter
- Use `set:html` for rendering HTML strings from `markdownify()`
- Props interfaces defined inline via `export interface Props { ... }`

### React Components (`.tsx`)

- Located in `src/layouts/helpers/` or `src/layouts/shortcodes/`
- Use `React.FC` with explicit interface: `const Comp: FC<IComp> = (...) => {}`
- Interfaces named with `I` prefix (e.g., `IDynamicIcon`)
- Use `client:load` directive when embedding in Astro templates
- Keep React usage minimal — only for interactive elements that need JS

### TypeScript

- Strict mode (`astro/tsconfigs/strict`), target ES6, JSX react
- Use `type` imports: `import type { ... } from ...`
- Zod schemas for all content collection validation (`src/content.config.ts`)
- Avoid `any` — use `@ts-ignore` sparingly where Astro generics are awkward
- Use `as string` or `as CollectionKey` casts where Astro's generic inference is too narrow

### Naming Conventions

- **Files:** `PascalCase` for components, `camelCase` for utilities
- **Components:** `PascalCase` exports
- **Functions/variables:** `camelCase` (`slugify`, `getListPage`, `getTranslations`)
- **CSS classes:** Tailwind utilities; custom classes follow BEM-ish pattern (`card-title`, `nav-dropdown-list`)
- **JSON config keys:** `snake_case` (`meta_title`, `bg_image`, `default_language`)
- **Content file names:** `kebab-case` (`fire-risk-assessment.md`, `high-rise-buildings.md`)

### Imports Order (Astro frontmatter)

1. Path-aliased imports (`@/components/`, `@/partials/`, `@/helpers/`)
2. Relative imports (`./ImageMod.astro`)
3. External packages (`react-icons/fa6`, `date-fns`)
4. Astro built-ins (`astro:content`, `astro:transitions`, `astro:assets`)

### Error Handling

- Draft pages redirect to 404: `if (page.data.draft) { return Astro.redirect("/404"); }`
- Content collections validate via Zod at build time — invalid frontmatter causes build failure

## Content Collections

Defined in `src/content.config.ts` using Zod schemas with `glob` loaders.

**Active collections:** `homepage`, `blog`, `pages`, `contact`, `about`, `services`, `fire-risk-assessment`, `locations`, `testimonials`, `callToAction`

Content files live in `src/content/<collection>/english/` as `.md` or `.mdx`.

Query helpers in `src/lib/contentParser.astro`:

- `getListPage(collection, lang)` — get index/listing pages (sorted, `-index` files first)
- `getSinglePage(collection, lang, subCollection?)` — get individual content entries (drafts filtered out, `-index` files excluded)

## Routing Patterns

- **Service pages:** `/services/<slug>` — driven by `services` collection
- **FRA building types:** `/services/fire-risk-assessment/<slug>` — driven by `fire-risk-assessment` collection with dedicated nested routes
- **Locations:** `/locations/<slug>` — driven by `locations` collection
- **Static pages:** `/<slug>` — driven by `pages` collection via `[regular].astro` catch-all
- **Blog:** `/blog`, `/blog/<slug>`, `/blog/page/<n>` — with pagination

## Internationalization

- Only English is active (`src/config/language.json`)
- Menu: `src/config/menu.en.json`
- Translations: `src/i18n/en.json`
- Language parsed from URL via `getLangFromUrl(Astro.url)`
- URL construction: `slugSelector(url, lang)` handles locale prefixes and trailing slashes

## Auto-Imported Shortcodes

Available in MDX without explicit import: `Button`, `Accordion`, `Notice`, `Video`, `Youtube`, `Tabs`, `Tab` (configured in `astro.config.mjs`).

## Key Patterns

- **Static output only** — no SSR or API routes
- Deploy target: Cloudflare Workers (`wrangler.jsonc`)
- Draft entries (`draft: true`) excluded from production via `getSinglePage` filter
- Font loading via Astro 6 `fontProviders.google()` with CSS variables (`--font-primary`)
- Tailwind CSS v4 with `@import "tailwindcss"`, custom plugins, `@custom-variant dark`
- React Icons (`react-icons/fa6`) used for service icons — names stored in content frontmatter
- Images served from `/public/images/` — use `ImageMod.astro` component for optimized rendering

## After Making Changes

1. Run `pnpm check` to verify types
2. Run `pnpm format` to format code
3. Run `pnpm build` to verify the build succeeds
