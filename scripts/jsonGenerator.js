import matter from "gray-matter";
import fs from "node:fs";
import path from "node:path";

const languagesPath = new URL("../src/config/language.json", import.meta.url);
const languages = JSON.parse(fs.readFileSync(languagesPath, "utf8"));

const JSON_FOLDER = "./.json";
const CONTENT_ROOT = "src/content";
const CONTENT_DEPTH = 3;
const BLOG_FOLDER = "blog";

const getData = (folder, groupDepth, langIndex = 0) => {
  const getPaths = languages
    .map((lang, index) => {
      const langFolder = lang.contentDir ? lang.contentDir : lang.languageCode;
      const dir = path.join(CONTENT_ROOT, folder, langFolder);
      return fs
        .readdirSync(dir)
        .filter(
          (filename) =>
            !filename.startsWith("-") &&
            (filename.endsWith(".md") || filename.endsWith(".mdx")),
        )
        .flatMap((filename) => {
          const filepath = path.join(dir, filename);
          const stats = fs.statSync(filepath);
          const isFolder = stats.isDirectory();

          if (isFolder) {
            return getData(filepath, groupDepth, index);
          } else {
            const file = fs.readFileSync(filepath, "utf-8");
            const { data, content } = matter(file);
            const pathParts = filepath.split(path.sep);

            let slug;
            if (data.slug) {
              const slugParts = data.slug.split("/");
              slugParts[0] = BLOG_FOLDER;
              slug = slugParts.join("/");
            } else {
              slug = pathParts
                .slice(CONTENT_DEPTH)
                .join("/")
                .replace(/\.[^/.]+$/, "");
              slug = `${BLOG_FOLDER}/${slug.split("/").slice(1).join("/")}`;
            }
            data.slug = slug;
            const group = "blog";

            return {
              lang: languages[index].languageCode,
              group: group,
              slug: data.slug,
              frontmatter: data,
              content: content,
            };
          }
        });
    })
    .flat();

  return getPaths.filter((page) => !page.frontmatter?.draft && page);
};

const getCollectionData = (folder, group, slugPrefix) => {
  const items = languages
    .map((lang, index) => {
      const langFolder = lang.contentDir ? lang.contentDir : lang.languageCode;
      const dir = path.join(CONTENT_ROOT, folder, langFolder);

      if (!fs.existsSync(dir)) return [];

      return fs
        .readdirSync(dir)
        .filter(
          (filename) =>
            !filename.startsWith("-") &&
            (filename.endsWith(".md") || filename.endsWith(".mdx")),
        )
        .map((filename) => {
          const filepath = path.join(dir, filename);
          const file = fs.readFileSync(filepath, "utf-8");
          const { data, content } = matter(file);
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
          const slug = `${slugPrefix}/${nameWithoutExt}`;

          return {
            lang: languages[index].languageCode,
            group: group,
            slug: slug,
            frontmatter: data,
            content: content,
          };
        });
    })
    .flat();

  return items.filter((page) => !page.frontmatter?.draft && page);
};

try {
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }

  const posts = getData(BLOG_FOLDER, 3);
  fs.writeFileSync(`${JSON_FOLDER}/posts.json`, JSON.stringify(posts));

  const services = getCollectionData("services", "services", "services");
  const fraTypes = getCollectionData(
    "fire-risk-assessment",
    "fire-risk-assessment",
    "services/fire-risk-assessment",
  );
  const locations = getCollectionData("locations", "locations", "locations");

  const search = [...posts, ...services, ...fraTypes, ...locations];
  fs.writeFileSync(`${JSON_FOLDER}/search.json`, JSON.stringify(search));

  console.log(
    `Search index: ${posts.length} posts, ${services.length} services, ${fraTypes.length} FRA types, ${locations.length} locations`,
  );
} catch (err) {
  console.error(err);
}
