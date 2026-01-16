import fs from "fs";

const BASE_URL = "https://www.physio-dynamics.com";

const pages = [
  "/",
  "/about.html",
  "/service.html",
  "/contact.html",
  "/appointment.html",
  "/feature.html",
  "/team.html",
  "/testimonial.html"
];

const today = new Date().toISOString().split("T")[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `
  <url>
    <loc>${BASE_URL}${p}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p === "/" ? "daily" : "weekly"}</changefreq>
    <priority>${p === "/" ? "1.0" : "0.8"}</priority>
  </url>
`).join("")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", xml.trim());

console.log("sitemap.xml generated with date:", today);