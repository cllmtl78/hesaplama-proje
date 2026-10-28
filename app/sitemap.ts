import { MetadataRoute } from "next";
import sektorlerData from "@/data/sektorler.json";

interface Sektor {
  slug: string;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kosgeb-sorgulama.vercel.app";
  const data = sektorlerData as Sektor[];

  const sektorUrls: MetadataRoute.Sitemap = data.map((item) => ({
    url: `${baseUrl}/kosgeb-destekleri/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...sektorUrls,
  ];
}
