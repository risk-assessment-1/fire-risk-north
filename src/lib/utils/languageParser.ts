import config from "../../config/config.json";
import languagesJSON from "../../config/language.json";
const { default_language } = config.settings;

const locales: { [key: string]: any } = {};

// Load menu and dictionary dynamically
languagesJSON.forEach((language) => {
  const { languageCode } = language;
  import(`../../config/menu.${languageCode}.json`).then((menu) => {
    import(`../../i18n/${languageCode}.json`).then((dictionary) => {
      locales[languageCode] = { ...menu, ...dictionary };
    });
  });
});

// Extract all languages from the locales object
const languages = Object.keys(locales);

// Export the locales and languages
export { languages, locales };

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split("/");
  if (locales.hasOwnProperty(lang)) {
    return lang;
  }
  return default_language;
}

export const getTranslations = async (lang: string) => {
  const {
    default_language,
    disable_languages,
  }: { default_language: string; disable_languages: string[] } =
    config.settings;

  if (disable_languages.includes(lang)) {
    lang = default_language;
  }

  let language = languagesJSON.find((l) => l.languageCode === lang);

  if (!language) {
    lang = default_language;
    language = languagesJSON.find((l) => l.languageCode === default_language);
  }

  if (!language) {
    throw new Error("Default language not found");
  }

  const contentDir = language.contentDir;

  let menu, dictionary;
  try {
    menu = await import(`../../config/menu.${lang}.json`);
    dictionary = await import(`../../i18n/${lang}.json`);
  } catch (error) {
    menu = await import(`../../config/menu.${default_language}.json`);
    dictionary = await import(`../../i18n/${default_language}.json`);
  }

  return { ...menu.default, ...dictionary.default, contentDir };
};

const disabledLanguages = config.settings.disable_languages as string[];
const activeLanguages = languagesJSON
  .map((lang) => lang.languageCode)
  .filter((lang) => !disabledLanguages.includes(lang));

const supportedLang = config.settings.default_language_in_subdir
  ? ["", ...activeLanguages]
  : ["", ...activeLanguages.filter((lang) => lang !== default_language)];

export { supportedLang };

// Build locale-relative URL without using astro:i18n (client-safe)
function buildLocaleUrl(lang: string, url: string): string {
  const { default_language } = config.settings;
  // Normalize url: ensure it starts with /
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  if (lang === default_language) {
    return normalizedUrl;
  }
  // Prepend lang prefix
  return `/${lang}${normalizedUrl === "/" ? "" : normalizedUrl}`;
}

export const stripHtmlExt = (pathname: string) =>
  pathname === "/" ? pathname : pathname.replace(/\.html$/, "");

export const slugSelector = (url: string, lang: string) => {
  const { default_language, default_language_in_subdir } = config.settings;

  let constructedUrl;

  if (url === "/") {
    constructedUrl = lang === default_language ? "/" : `/${lang}`;
  } else {
    constructedUrl = buildLocaleUrl(lang, url);
  }

  if (lang === default_language && default_language_in_subdir) {
    constructedUrl = `/${lang}${constructedUrl}`;
  }

  if (constructedUrl.endsWith("/") && constructedUrl !== "/") {
    constructedUrl = constructedUrl.slice(0, -1);
  }

  return constructedUrl;
};
