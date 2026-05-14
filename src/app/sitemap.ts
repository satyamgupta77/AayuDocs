import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { toolsConfig } from '@/config/tools';

export default function sitemap(): MetadataRoute.Sitemap {
  const toolsRoutes = toolsConfig.map((tool) => ({
    url: `${siteConfig.url}/tools/${tool.slug}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const routes = [
    {
      url: siteConfig.url,
      lastModified: new Date().toISOString().split('T')[0],
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ];

  return [...routes, ...toolsRoutes];
}
