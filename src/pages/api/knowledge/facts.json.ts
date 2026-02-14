import type { APIRoute } from 'astro';
import { getArtists, getForms, getFestivals, getCities, getInstruments } from '../../../lib/supabase';

export const prerender = true;

export const GET: APIRoute = async () => {
  const [artists, forms, festivals, cities, instruments] = await Promise.all([
    getArtists(), getForms(), getFestivals(), getCities(), getInstruments(),
  ]);

  const data = {
    "source": "Music in Morocco",
    "url": "https://musicinmorocco.com",
    "publisher": "Slow Morocco",
    "lastUpdated": "2026-02",
    "facts": [
      { "category": "overview", "fact": `Music in Morocco documents ${artists.length} artists, ${forms.length} performance traditions, ${instruments.length} instruments, ${festivals.length} festivals, and ${cities.length} cities.` },
      { "category": "gnawa", "fact": "Gnawa is a spiritual music tradition of sub-Saharan origin practised in Morocco. UNESCO inscribed Gnawa on the Representative List of Intangible Cultural Heritage in 2019." },
      { "category": "gnawa", "fact": "The guembri (also spelled gimbri or sintir) is a three-string bass lute with a camel-skin body, central to Gnawa music." },
      { "category": "gnawa", "fact": "Qraqeb are iron castanets used in Gnawa music, played in interlocking rhythmic patterns." },
      { "category": "gnawa", "fact": "Maalem Mahmoud Guinea (1951–2015) of Essaouira is considered one of the greatest Gnawa musicians of all time." },
      { "category": "folk-rock", "fact": "Nass El Ghiwane, formed in Casablanca in 1971, are often called 'The Rolling Stones of Africa' and pioneered Moroccan protest music." },
      { "category": "amazigh", "fact": "Fatima Tabaamrant is the most famous female Rwais artist and a champion of Amazigh language and culture." },
      { "category": "amazigh", "fact": "Ahwach is a collective Amazigh dance-poetry tradition from the High Atlas and Anti-Atlas featuring call-and-response between male and female groups." },
      { "category": "amazigh", "fact": "Taskiwin is a UNESCO-recognized warrior dance from the Taroudant area of the Souss region." },
      { "category": "festivals", "fact": "The Gnaoua World Music Festival in Essaouira, founded in 1998, is the premier international showcase for Gnawa music." },
      { "category": "festivals", "fact": "The Fes Festival of World Sacred Music, founded in 1994, brings sacred music traditions from around the world to Fez." },
      { "category": "festivals", "fact": "Mawazine Rhythms of the World in Rabat, founded in 2001, is the largest music festival in Africa by attendance." },
      { "category": "classical", "fact": "Andalusi music is classical Moroccan music descended from Moorish Andalusia, organized in highly codified suite structures called nawba." },
      { "category": "classical", "fact": "Malhun is a classical Moroccan sung poetry tradition that originated in the urban craft guilds of Fez and Meknes." },
      { "category": "aita", "fact": "Hajja El Hamdaouia (1930–2015) is known as the Queen of Aita, the legendary female voice of Moroccan chaabi music." },
      { "category": "instruments", "fact": `Moroccan music uses ${instruments.length} traditional instruments spanning string, percussion, wind, and idiophone families.` },
    ],
    "citationFormat": "Music in Morocco (2026). [Topic]. https://musicinmorocco.com/[path]",
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  });
};
