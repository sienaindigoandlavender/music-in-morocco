import type { APIRoute } from 'astro';
import { getInstruments, splitSemicolon } from '../../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = async () => {
  const instruments = await getInstruments();
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Traditional Moroccan Instruments",
    "numberOfItems": instruments.length,
    "itemListElement": instruments.map((inst, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "item": {
        "name": inst.name,
        "alternateName": inst.name_ar || undefined,
        "description": inst.description,
        "instrumentType": inst.type,
        "family": inst.family,
        "usedIn": splitSemicolon(inst.associated_forms),
        "url": `https://musicinmorocco.com/instruments/${inst.slug}`,
      }
    }))
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
