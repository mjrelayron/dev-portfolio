import { StrictMode } from 'react';
import { prerenderToNodeStream } from 'react-dom/static';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './app/App';
import { SeoProvider, type SeoData } from './app/Seo';

/** Render one route to static HTML for the prerenderer (scripts/prerender.mjs). */
export async function render(url: string): Promise<{ html: string; seo: SeoData | null }> {
  let seo: SeoData | null = null;
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <SeoProvider collect={(d) => (seo = d)}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </SeoProvider>
    </StrictMode>,
  );
  const chunks: Buffer[] = [];
  for await (const c of prelude) chunks.push(Buffer.from(c));
  return { html: Buffer.concat(chunks).toString('utf8'), seo };
}

export { headTags } from './app/Seo';
export { prerenderPaths } from './app/prerenderPaths';
export { projects } from './data/portfolio';
export { profile } from './data/profile';
