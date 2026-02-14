import type { APIRoute } from 'astro';
import { getArtists, splitSemicolon } from '../../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = async () => {
  const artists = await getArtists();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Moroccan Performance Artists",
    "numberOfItems": artists.length,
    "itemListElement": artists.map((a, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "Person",
        "name": a.name,
        "alternateName": a.name_ar || undefined,
        "description": a.biography,
        "performerIn": splitSemicolon(a.performance_forms),
        "homeLocation": a.base_city + ", Morocco",
        "url": `https://musicinmorocco.com/performers/${a.slug}`,
      }
    }))
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
