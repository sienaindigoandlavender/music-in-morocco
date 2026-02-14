import type { APIRoute } from 'astro';
import { getFestivals, splitSemicolon } from '../../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = async () => {
  const festivals = await getFestivals();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Moroccan Music Festivals",
    "numberOfItems": festivals.length,
    "itemListElement": festivals.map((f, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "MusicFestival",
        "name": f.name,
        "alternateName": f.name_ar || undefined,
        "description": f.description,
        "location": f.city + ", Morocco",
        "frequency": f.frequency,
        "foundedYear": f.founded_year || undefined,
        "performanceForms": splitSemicolon(f.performance_forms),
        "status": f.status,
        "url": `https://musicinmorocco.com/festivals/${f.slug}`,
      }
    }))
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
