/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build to plain HTML/CSS/JS in `out/` so the site can be hosted anywhere
  // (Vercel, Netlify, GitHub Pages). All data comes from Supabase in the browser.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Set NEXT_PUBLIC_BASE_PATH=/repo-name when hosting on GitHub Pages project sites.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
