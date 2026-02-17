'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    _paq?: unknown[];
  }
}

export default function CloudflareAnalytics() {
  useEffect(() => {
    // Cloudflare Web Analytics
    const script = document.createElement('script');
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.dataset.cfBeacon = '{"token": "YOUR_CLOUDFLARE_ANALYTICS_TOKEN"}';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
}
