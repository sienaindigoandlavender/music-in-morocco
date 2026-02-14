import type { APIRoute } from 'astro';
import { getForms, splitSemicolon } from '../../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = async () => {
  const forms = await getForms();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Moroccan Performance Traditions",
    "numberOfItems": forms.length,
    "itemListElement": forms.map((f, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "@type": "PerformingGroup",
        "name": f.name,
        "alternateName": f.name_ar || undefined,
        "description": f.description,
        "genre": f.category,
        "foundingLocation": f.origin_region,
        "instruments": splitSemicolon(f.instruments),
        "unescoStatus": f.unesco_status || undefined,
        "url": `https://musicinmorocco.com/forms/${f.slug}`,
      }
    }))
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
