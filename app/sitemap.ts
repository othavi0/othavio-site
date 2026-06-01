import type { MetadataRoute } from "next"

import { siteUrl } from "@/lib/site-metadata"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ]
}
