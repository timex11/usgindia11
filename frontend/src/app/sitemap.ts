import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'; // Ensure this matches backend port

async function fetchIds(endpoint: string): Promise<string[]> {
  try {
    // Revalidate every hour
    const res = await fetch(`${API_URL}/${endpoint}?limit=1000`, { next: { revalidate: 3600 } });
    if (!res.ok) {
        console.error(`Sitemap fetch failed for ${endpoint}: ${res.status}`);
        return [];
    }
    const data = await res.json();
    // Check if data is array or object with data property (NestJS standard pagination)
    const items = Array.isArray(data) ? data : (data.data || []);
    return items.map((item: { id: string }) => item.id);
  } catch (error) {
    console.error(`Failed to fetch ${endpoint} for sitemap`, error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://usgindia.in';

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/about',
    '/explore',
    '/join',
    '/login',
    '/register',
    '/universities',
    '/courses',
    '/careers',
    '/exams',
    '/scholarships',
    '/community',
    '/alumni',
    '/tools/scholarship-finder',
    '/tools/resume-builder',
    '/tools/photo-resizer',
    '/dashboard',
    '/resources',
  ];

  const routes = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // 2. Dynamic Routes
  // Only fetching scholarships for now as I confirmed the endpoint is public
  const scholarshipIds = await fetchIds('scholarships');

  const scholarshipRoutes = scholarshipIds.map((id) => ({
    url: `${baseUrl}/scholarships/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Add more dynamic fetches here (jobs, exams) if/when they become public
  
  return [...routes, ...scholarshipRoutes];
}
