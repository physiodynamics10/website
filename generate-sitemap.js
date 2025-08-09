// generate-sitemap.js
const fs = require("fs/promises");
const path = require("path");
const { SitemapStream, streamToPromise } = require("sitemap");

const HOSTNAME = "https://www.physio-dynamics.com";

// Adjust this if your HTML files live in a subfolder (e.g., "public")
const PUBLIC_DIR =
  process.env.PUBLISH_DIR ||
  process.env.NETLIFY_PUBLISH_PATH ||
  path.resolve(__dirname);

// Files to exclude from sitemap
const IGNORE = new Set(["404.html", "robots.txt", "sitemap.xml"]);

// Folders you don't want to crawl
const SKIP_DIRS = new Set(["node_modules", ".git", ".netlify", "dist", "build"]);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name.startsWith(".") || SKIP_DIRS.has(e.name)) continue;
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

function toUrlPath(root, filePath) {
  const rel = path.relative(root, filePath).replace(/\\/g, "/");
  let urlPath = "/" + rel;
  if (urlPath.endsWith("index.html")) {
    urlPath = urlPath.slice(0, -"index.html".length) || "/";
  }
  return urlPath;
}

function guessMeta(urlPath) {
  if (urlPath === "/") return { changefreq: "daily", priority: 1.0 };
  if (urlPath.includes("about") || urlPath.includes("service"))
    return { changefreq: "weekly", priority: 0.9 };
  if (urlPath.includes("contact"))
    return { changefreq: "monthly", priority: 0.8 };
  return { changefreq: "monthly", priority: 0.6 };
}

(async () => {
  const htmlFiles = [];
  for await (const file of walk(PUBLIC_DIR)) {
    if (!file.endsWith(".html")) continue;
    const base = path.basename(file);
    if (IGNORE.has(base)) continue;
    htmlFiles.push(file);
  }

  const sm = new SitemapStream({ hostname: HOSTNAME });
  const promise = streamToPromise(sm); // attach before end()

  if (htmlFiles.length === 0) {
    sm.write({ url: "/", ...guessMeta("/") }); // fallback, avoids EmptyStream
  } else {
    for (const file of htmlFiles) {
      const url = toUrlPath(PUBLIC_DIR, file);
      const stat = await fs.stat(file);
      const lastmod = stat.mtime.toISOString().slice(0, 10);
      sm.write({ url, lastmod, ...guessMeta(url) });
    }
  }

  sm.end();
  const xml = await promise.then((d) => d.toString());

  await fs.writeFile(path.join(PUBLIC_DIR, "sitemap.xml"), xml, "utf8");
  console.log("✅ sitemap.xml generated");
})().catch((err) => {
  console.error("❌ Failed to generate sitemap:", err);
  process.exit(1);
});