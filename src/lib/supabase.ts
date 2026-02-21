import { createClient } from '@supabase/supabase-js';

// =============================================================================
// HARD-CODED DATA (no longer fetched from Supabase)
// =============================================================================
import { mimArtists } from './data/artists';
import { mimCities } from './data/cities';
import { mimFestivals } from './data/festivals';
import { mimForms } from './data/forms';
import { mimInstruments } from './data/instruments';
import { mimRegions } from './data/regions';
import { mimSettings } from './data/settings';
import { mimThemes } from './data/themes';

// =============================================================================
// NEXUS SUPABASE CLIENT — Shared across all brands (STILL LIVE)
// =============================================================================

const SITE_ID = 'mim';

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

// ============ DATA FETCHERS (now hard-coded) ============

export async function getArtists(): Promise<Artist[]> {
  return mimArtists as unknown as Artist[];
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  return (mimArtists as unknown as Artist[]).find(a => a.slug === slug) || null;
}

export async function getForms(): Promise<PerformanceForm[]> {
  return mimForms as unknown as PerformanceForm[];
}

export async function getFormBySlug(slug: string): Promise<PerformanceForm | null> {
  return (mimForms as unknown as PerformanceForm[]).find(f => f.slug === slug) || null;
}

export async function getFestivals(): Promise<Festival[]> {
  return mimFestivals as unknown as Festival[];
}

export async function getFestivalBySlug(slug: string): Promise<Festival | null> {
  return (mimFestivals as unknown as Festival[]).find(f => f.slug === slug) || null;
}

export async function getCities(): Promise<City[]> {
  return mimCities as unknown as City[];
}

export async function getCityBySlug(slug: string): Promise<City | null> {
  return (mimCities as unknown as City[]).find(c => c.slug === slug) || null;
}

export async function getRegions(): Promise<Region[]> {
  return mimRegions as unknown as Region[];
}

export async function getInstruments(): Promise<Instrument[]> {
  return mimInstruments as unknown as Instrument[];
}

export async function getInstrumentBySlug(slug: string): Promise<Instrument | null> {
  return (mimInstruments as unknown as Instrument[]).find(i => i.slug === slug) || null;
}

export async function getThemes(): Promise<Theme[]> {
  return mimThemes as unknown as Theme[];
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  return (mimThemes as unknown as Theme[]).find(t => t.slug === slug) || null;
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  return mimSettings;
}

// ============ RELATIONAL HELPERS (unchanged) ============

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

// ============ NEXUS (STILL USES SUPABASE — UNCHANGED) ============

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
