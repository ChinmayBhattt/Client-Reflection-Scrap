import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const now = new Date();

  const routes = [
    "",
    "/services",
    "/rates",
    "/what-we-accept",
    "/book",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "/rates" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/rates" || route === "/book" ? 0.9 : 0.7,
  }));
}

