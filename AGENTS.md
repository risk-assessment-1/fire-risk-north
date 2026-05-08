# AGENTS.md

## Project Overview

Astro 6 static site (Bexer theme) with multi-language support, React interactive islands, Tailwind CSS v4, and Cloudflare Workers deployment. Content is managed via MD/MDX files with Zod-validated collections.

## Build & Development Commands

```bash
pnpm dev              # Start dev server (runs jsonGenerator.js first)
pnpm build            # Production build (runs jsonGenerator.js first)
pnpm preview          # Preview production build locally
pnpm check            # TypeScript/astro type checking (run after changes)
pnpm format           # Format source with Prettier (src/ only)
pnpm generate-json    # Regenerate JSON from config files
```

**No test framework is configured.** There are no test scripts or testing dependencies.

**Important:** `scripts/jsonGenerator.js` runs automatically before `dev` and `build`. It processes config JSON files — run it manually if you edit config files outside of those commands.

## Architecture

```
src/
├── pages/[...lang]/       # Dynamic i18n routes (Astro file-based routing)
│   ├── index.astro        # Homepage
│   ├── [regular].astro    # Catch-all regular pages
│   ├── blog/              # Blog listing + single posts
│   ├── services/          # Service pages
│   ├── projects/          # Project/case-study pages
│   ├── about.astro        # About page
│   ├── contact.astro      # Contact page
│   ├── team/              # Team listing + single member
│   └── authors/           # Author pages
├── layouts/
│   ├── Base.astro         # Root layout (meta, fonts, GTM, header/footer)
│   ├── components/        # Reusable Astro components (BlogCard, Logo, etc.)
│   ├── helpers/           # React components (SearchModal, DynamicIcon, etc.)
│   ├── partials/          # Page sections (Header, Footer, homepage sections)
│   └── shortcodes/        # MDX shortcodes (Button, Accordion, Tabs, etc.)
├── lib/
│   ├── contentParser.astro  # Content collection query helpers
│   ├── taxonomyParser.astro # Taxonomy filtering helpers
│   └── utils/               # Pure utility functions (textConverter, dateFormat, etc.)
├── config/                # JSON configuration files (config, theme, language, menu)
├── content/               # MD/MDX content organized by collection and language
├── i18n/                  # Translation dictionaries (en.json, etc.)
├── styles/                # CSS files (Tailwind v4 with @import layers)
└── tailwind-plugin/       # Custom Tailwind plugins (theme, grid)
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
- **Trailing whitespace:** Trimmed (except in `.md` files)
- **Final newline:** Inserted
- **Prettier** with `prettier-plugin-astro` and `prettier-plugin-tailwindcss`
- **CSS in `src/styles/`** is excluded from Prettier (`.prettierignore`)
- Run `pnpm format` after editing source files

### Astro Components (`.astro`)

- Use `---` frontmatter fence for server-side logic (imports, props, data fetching)
- Import with `@/` path aliases — never use relative paths when an alias exists
- Destructure `Astro.props` at the top of the frontmatter
- Use `set:html` for rendering HTML strings from `markdownify()`
- Props interfaces defined inline via `export interface Props { ... }`

### React Components (`.tsx`)

- Located in `src/layouts/helpers/` or `src/layouts/shortcodes/`
- Use `React.FC` with explicit interface for props: `const Comp: FC<IComp> = (...) => {}`
- Interfaces named with `I` prefix (e.g., `IDynamicIcon`)
- Use `client:load` directive when embedding in Astro templates
- Keep React usage minimal — only for interactive elements that need JS

### TypeScript

- Strict mode enabled (`astro/tsconfigs/strict`)
- Target: ES6, JSX: react
- Use `type` imports for types: `import type { ... } from ...`
- Zod schemas for all content collection validation (`src/content.config.ts`)
- Avoid `any` — use `@ts-ignore` sparingly where Astro generics are awkward

### Naming Conventions

- **Files:** `PascalCase` for components (`BlogCard.astro`, `DynamicIcon.tsx`), `camelCase` for utilities (`textConverter.ts`, `dateFormat.ts`)
- **Components:** `PascalCase` exports
- **Functions/variables:** `camelCase` (`slugify`, `getListPage`, `getTranslations`)
- **CSS classes:** Use Tailwind utility classes; custom classes follow BEM-ish pattern (e.g., `card-title`, `nav-dropdown-list`)
- **JSON config keys:** `snake_case` (`meta_title`, `bg_image`, `default_language`)

### Imports Order (Astro frontmatter)

1. Path-aliased imports (`@/components/`, `@/partials/`, `@/helpers/`, etc.)
2. Relative imports (`./ImageMod.astro`)
3. External packages (`react-icons/io5`, `date-fns`, etc.)
4. Astro built-ins (`astro:content`, `astro:transitions`, `astro:assets`)

## Content Collections

Defined in `src/content.config.ts` using Zod schemas with `glob` loaders. Collections include: `homepage`, `blog`, `projects`, `authors`, `pages`, `team`, `contact`, `about`, `services`, `testimonials`, `callToAction`.

Content files live in `src/content/<collection>/<lang>/` as `.md` or `.mdx`.

Query helpers in `src/lib/contentParser.astro`:

- `getListPage(collection, lang)` — get index/listing pages (sorted, `-index` files first)
- `getSinglePage(collection, lang, subCollection?)` — get individual content entries (drafts filtered out)

## Internationalization (i18n)

- Languages configured in `src/config/language.json`
- Menu per language: `src/config/menu.<lang>.json`
- Translations: `src/i18n/<lang>.json`
- Language parsed from URL via `getLangFromUrl(Astro.url)`
- URL construction: `slugSelector(url, lang)` handles locale prefixes and trailing slashes
- Dynamic `getStaticPaths()` in `src/pages/[...lang]/` generates pages for all enabled languages

## Auto-Imported Shortcodes

Available in MDX without explicit import: `Button`, `Accordion`, `Notice`, `Video`, `Youtube`, `Tabs`, `Tab` (configured in `astro.config.mjs` via `astro-auto-import`).

## Key Patterns

- **Static output only** (`output: "static"` in astro config) — no server-side rendering or API routes
- Deploy target: Cloudflare Workers (configured in `wrangler.jsonc`)
- Content is filtered by `draft: true` frontmatter — draft entries are excluded from production
- Use `@digi4care/astro-google-tagmanager` for GTM integration (toggle in config)
- Font loading via Astro 6 built-in `fontProviders.google()` with CSS variables (`--font-primary`, etc.)
- Tailwind CSS v4 with `@import "tailwindcss"`, custom plugins, and `@custom-variant dark`

## After Making Changes

1. Run `pnpm check` to verify types
2. Run `pnpm format` to format code
3. Run `pnpm build` to verify the build succeeds
