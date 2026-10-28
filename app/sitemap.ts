import { MetadataRoute } from "next";
import sektorlerData from "@/data/sektorler.json";
import { TOOLS_REGISTRY } from "@/data/toolsRegistry";

interface Sektor {
  slug: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pratikhesap.co";
  const data = sektorlerData as Sektor[];

  const toolUrls: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
    url: `${baseUrl}/${tool.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  const sektorUrls: MetadataRoute.Sitemap = data.map((item) => ({
    url: `${baseUrl}/kosgeb-destekleri/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...toolUrls,
    ...sektorUrls,
  ];
}
