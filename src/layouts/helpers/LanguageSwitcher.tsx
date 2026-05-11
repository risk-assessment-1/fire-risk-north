import config from "@/config/config.json";
import languages from "@/config/language.json";
import React from "react";

const LanguageSwitcher = ({
  lang,
  pathname,
}: {
  lang: string;
  pathname: string;
}) => {
  const { default_language, default_language_in_subdir } = config.settings;

  const stripTrailingSlash = (path: string) => path.replace(/\/$/, "");

  const sortedLanguages = languages
    .filter(
      (
        language, // @ts-ignore
      ) => !config.settings.disable_languages.includes(language.languageCode),
    )
    .sort((a, b) => a.weight - b.weight);

  return (
    <div className={`mr-5 ${sortedLanguages.length > 1 ? "block" : "hidden"}`}>
      <select
        className="text-text-dark dark:text-darkmode-text-dark bg-transparent cursor-pointer border-0 focus:ring-0 focus:border-dark"
        onChange={(e) => {
          const selectedLang = e.target.value;
          let newPath;
          const baseUrl = window.location.origin;

          if (selectedLang === default_language) {
            if (default_language_in_subdir) {
              newPath = `${baseUrl}/${default_language}${stripTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
            } else {
              newPath = `${baseUrl}${stripTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
            }
          } else {
            newPath = `/${selectedLang}${stripTrailingSlash(pathname.replace(`/${lang}`, ""))}`;
          }

          window.location.href = newPath;
        }}
        value={lang}
      >
        {sortedLanguages.map((language) => (
          <option
            className=""
            key={language.languageCode}
            value={language.languageCode}
          >
            {language.languageName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
