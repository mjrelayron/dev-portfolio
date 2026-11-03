import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { profile } from '../data/profile';

export interface SeoData {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

/** On the server the prerenderer passes `collect`; the last <Seo> rendered wins. */
const SeoContext = createContext<{ collect?: (data: SeoData) => void }>({});

export function SeoProvider({ collect, children }: { collect?: (data: SeoData) => void; children: ReactNode }) {
  return <SeoContext.Provider value={{ collect }}>{children}</SeoContext.Provider>;
}

export const SITE_NAME = 'DEVELOPERVERSE';
export const fullTitle = (t: string) => (t.includes(profile.name) ? t : `${t} · ${profile.name}`);
export const absUrl = (p: string) => (p.startsWith('http') ? p : `${profile.siteUrl}${p}`);

export function headTags(d: SeoData): string {
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const title = esc(fullTitle(d.title));
  const desc = esc(d.description);
  const url = absUrl(d.path);
  const img = absUrl(d.image ?? '/og/default.png');
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<link rel="canonical" href="${url}" />`,
    d.noindex ? `<meta name="robots" content="noindex" />` : '',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${d.type ?? 'website'}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${img}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
    `<meta name="twitter:image" content="${img}" />`,
  ];
  if (d.jsonLd) tags.push(`<script type="application/ld+json" data-seo-jsonld>${JSON.stringify(d.jsonLd).replace(/</g, '\u003c')}</script>`);
  return tags.filter(Boolean).join('\n    ');
}

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}

export function Seo(props: SeoData) {
  const ctx = useContext(SeoContext);
  if (ctx.collect) ctx.collect(props);

  const { title, description, path, image, type, jsonLd } = props;
  useEffect(() => {
    const t = fullTitle(title);
    document.title = t;
    const url = absUrl(path);
    const img = absUrl(image ?? '/og/default.png');
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', t);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', img);
    setMeta('property', 'og:type', type ?? 'website');
    setMeta('name', 'twitter:title', t);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', img);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.dataset.seoJsonld = '';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, image, type, jsonLd]);
  return null;
}

export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.fullName,
  alternateName: profile.name,
  jobTitle: profile.headline,
  email: `mailto:${profile.email}`,
  url: profile.siteUrl,
  sameAs: Object.values(profile.links),
};
