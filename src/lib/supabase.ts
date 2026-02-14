import { createClient } from '@supabase/supabase-js';

const SITE_ID = 'mim';

// ============ SUPABASE CLIENT ============

let supabaseInstance: ReturnType<typeof createClient> | null = null;

function getSupabase() {
  if (!supabaseInstance) {
    const url = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL || '';
    const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || '';
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
}

let nexusInstance: ReturnType<typeof createClient> | null = null;

function getNexus() {
  if (!nexusInstance) {
    const url = import.meta.env.NEXUS_SUPABASE_URL || process.env.NEXUS_SUPABASE_URL || '';
    const key = import.meta.env.NEXUS_SUPABASE_ANON_KEY || process.env.NEXUS_SUPABASE_ANON_KEY || '';
    nexusInstance = createClient(url, key);
  }
  return nexusInstance;
}

// ============ TYPES ============

export interface Artist {
  id: string; slug: string; name: string; name_ar: string;
  type: string; base_city: string; region: string;
  active_since: number | null; performance_forms: string;
  biography: string; status: string;
}

export interface PerformanceForm {
  id: string; slug: string; name: string; name_ar: string;
  category: string; origin_region: string; description: string;
  instruments: string; context: string; season: string;
  unesco_status: string; related_forms: string;
}

export interface Festival {
  id: string; slug: string; name: string; name_ar: string;
  city: string; region: string; frequency: string;
  start_month: number | null; founded_year: number | null;
  performance_forms: string; description: string; status: string;
}

export interface City {
  id: string; slug: string; name: string; name_ar: string;
  region: string; description: string;
  latitude: number | null; longitude: number | null;
}

export interface Region {
  id: string; slug: string; name: string; name_ar: string;
  description: string;
}

export interface Instrument {
  id: string; slug: string; name: string; name_ar: string;
  type: string; family: string; description: string;
  associated_forms: string;
}

export interface Theme {
  id: string; slug: string; name: string; name_ar: string;
  category: string; description: string;
}

export interface NexusFooterLink {
  brand_id: string; column_number: number; column_title: string;
  link_order: number; link_label: string; link_url: string;
}

// ============ DATA FETCHERS ============

export async function getArtists(): Promise<Artist[]> {
  const { data } = await getSupabase().from('mim_artists').select('*').order('name');
  return data || [];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const { data } = await getSupabase().from('mim_artists').select('*').eq('slug', slug).single();
  return data;
}

export async function getForms(): Promise<PerformanceForm[]> {
  const { data } = await getSupabase().from('mim_forms').select('*').order('name');
  return data || [];
}

export async function getFormBySlug(slug: string): Promise<PerformanceForm | null> {
  const { data } = await getSupabase().from('mim_forms').select('*').eq('slug', slug).single();
  return data;
}

export async function getFestivals(): Promise<Festival[]> {
  const { data } = await getSupabase().from('mim_festivals').select('*').order('name');
  return data || [];
}

export async function getFestivalBySlug(slug: string): Promise<Festival | null> {
  const { data } = await getSupabase().from('mim_festivals').select('*').eq('slug', slug).single();
  return data;
}

export async function getCities(): Promise<City[]> {
  const { data } = await getSupabase().from('mim_cities').select('*').order('name');
  return data || [];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  const { data } = await getSupabase().from('mim_cities').select('*').eq('slug', slug).single();
  return data;
}

export async function getRegions(): Promise<Region[]> {
  const { data } = await getSupabase().from('mim_regions').select('*').order('name');
  return data || [];
}

export async function getInstruments(): Promise<Instrument[]> {
  const { data } = await getSupabase().from('mim_instruments').select('*').order('name');
  return data || [];
}

export async function getInstrumentBySlug(slug: string): Promise<Instrument | null> {
  const { data } = await getSupabase().from('mim_instruments').select('*').eq('slug', slug).single();
  return data;
}

export async function getThemes(): Promise<Theme[]> {
  const { data } = await getSupabase().from('mim_themes').select('*').order('name');
  return data || [];
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  const { data } = await getSupabase().from('mim_themes').select('*').eq('slug', slug).single();
  return data;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const { data } = await getSupabase().from('mim_settings').select('*');
  const map: Record<string, string> = {};
  (data || []).forEach((r: any) => { map[r.key] = r.value; });
  return map;
}

// ============ RELATIONAL HELPERS ============

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim();
}

export function splitSemicolon(text: string): string[] {
  return text ? text.split(';').map(s => s.trim()).filter(Boolean) : [];
}

export async function getArtistsByForm(formName: string): Promise<Artist[]> {
  const artists = await getArtists();
  const fn = formName.toLowerCase();
  return artists.filter(a =>
    splitSemicolon(a.performance_forms).some(f => f.toLowerCase() === fn || slugify(f) === slugify(formName))
  );
}

export async function getArtistsByCity(cityName: string): Promise<Artist[]> {
  const artists = await getArtists();
  return artists.filter(a => a.base_city.toLowerCase() === cityName.toLowerCase());
}

export async function getFestivalsByCity(cityName: string): Promise<Festival[]> {
  const festivals = await getFestivals();
  return festivals.filter(f => f.city.toLowerCase() === cityName.toLowerCase());
}

export async function getFestivalsByForm(formName: string): Promise<Festival[]> {
  const festivals = await getFestivals();
  const fn = formName.toLowerCase();
  return festivals.filter(f =>
    splitSemicolon(f.performance_forms).some(pf => pf.toLowerCase() === fn || slugify(pf) === slugify(formName))
  );
}

export function isActive(artist: Artist): boolean {
  const s = artist.status.toLowerCase();
  return !s.includes('deceased') && !s.includes('inactive');
}

// ============ NEXUS ============

export async function getNexusFooterLinks(): Promise<NexusFooterLink[]> {
  const { data } = await getNexus().from('nexus_footer_links').select('*').eq('brand_id', SITE_ID).order('column_number').order('link_order');
  return data || [];
}

export async function getNexusLegalPages(): Promise<{ page_id: string; page_title: string }[]> {
  const { data } = await getNexus().from('nexus_legal_pages').select('page_id, page_title').order('page_id');
  return data || [];
}

export async function getNexusPoweredBy(): Promise<{ label: string; url: string } | null> {
  const { data } = await getNexus().from('nexus_powered_by').select('*').eq('site_id', SITE_ID).single();
  return data;
}
