import type { MetadataRoute } from 'next';
import { isIndexingAllowed } from '@/lib/site-access';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  if (!isIndexingAllowed()) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/toegang/', '/api/'],
    },
  };
}

