import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { NextRequest } from 'next/server';
import HomePage from '@/app/page';
import AboutPage from '@/app/about/page';
import ContactPage from '@/app/contact/page';
import PrivacyPage from '@/app/privacy/page';
import NotFound from '@/app/not-found';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { proxy } from '@/proxy';

describe('Is Agentic readiness & machine-readable endpoints', () => {
  it('renders >500 chars on homepage with sequential headings, JSON-LD Organization + SoftwareApplication, and trust links', () => {
    const { container } = render(<HomePage />);
    const mainText = (container.querySelector('main')?.textContent ?? '').trim();
    expect(mainText.length).toBeGreaterThan(500);

    // Sequential headings: single h1, h2s, h3s
    expect(container.querySelectorAll('h1').length).toBe(1);
    expect(container.querySelectorAll('h2').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('h3').length).toBeGreaterThan(0);

    // JSON-LD structured data
    const jsonLdEl = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(jsonLdEl).toBeTruthy();
    const parsed = JSON.parse(jsonLdEl!.textContent || '{}') as {
      '@graph': Array<Record<string, unknown>>;
    };
    const org = parsed['@graph'].find((n) => n['@type'] === 'Organization');
    const app = parsed['@graph'].find(
      (n) => n['@type'] === 'SoftwareApplication',
    );
    expect(org).toBeTruthy();
    expect(org?.contactPoint).toBeTruthy();
    expect((org?.address as Record<string, unknown>)?.['@type']).toBe(
      'PostalAddress',
    );
    expect(app).toBeTruthy();
    expect(app?.offers).toBeTruthy();

    // Trust and agent links in footer
    expect(container.querySelector('a[href="/about"]')).toBeTruthy();
    expect(container.querySelector('a[href="/contact"]')).toBeTruthy();
    expect(container.querySelector('a[href="/privacy"]')).toBeTruthy();
    expect(container.querySelector('a[href="/llms.txt"]')).toBeTruthy();
  });

  it('renders >500 chars on /about, /contact, and /privacy trust anchor pages', () => {
    for (const Component of [AboutPage, ContactPage, PrivacyPage]) {
      const { container, unmount } = render(<Component />);
      const text = (container.querySelector('main')?.textContent ?? '').trim();
      expect(text.length).toBeGreaterThan(500);
      expect(container.querySelectorAll('h1').length).toBe(1);
      unmount();
    }
  });

  it('negotiates Markdown on / and returns agent-friendly Markdown 404 on nonexistent routes', async () => {
    const mdReq = new NextRequest('https://guiamove.vercel.app/', {
      headers: { accept: 'text/markdown' },
    });
    const mdRes = proxy(mdReq);
    expect(mdRes.status).toBe(200);
    expect(mdRes.headers.get('content-type')).toContain('text/markdown');
    expect(mdRes.headers.get('vary')).toContain('Accept');
    const mdBody = await mdRes.text();
    expect(mdBody).toContain('# GuiaMove');
    expect(mdBody.length).toBeGreaterThan(500);

    const htmlReq = new NextRequest('https://guiamove.vercel.app/', {
      headers: { accept: 'text/html' },
    });
    const htmlRes = proxy(htmlReq);
    expect(htmlRes.headers.get('vary')).toContain('Accept');

    const notFoundReq = new NextRequest(
      'https://guiamove.vercel.app/__ora-404-probe-5fjrhd26',
      { headers: { accept: 'text/markdown' } },
    );
    const notFoundRes = proxy(notFoundReq);
    expect(notFoundRes.status).toBe(404);
    expect(notFoundRes.headers.get('content-type')).toContain('text/markdown');
    expect(notFoundRes.headers.get('vary')).toContain('Accept');
    const errBody = await notFoundRes.text();
    expect(errBody.length).toBeGreaterThan(20);
    expect(errBody).toContain('llms.txt');
    expect(errBody).toContain('sitemap.xml');
  });

  it('renders HTML 404 page with documentation and sitemap links', () => {
    const { container } = render(<NotFound />);
    expect(container.querySelector('a[href="/llms.txt"]')).toBeTruthy();
    expect(container.querySelector('a[href="/sitemap.xml"]')).toBeTruthy();
  });

  it('exposes complete sitemap.xml and robots.txt', () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain('https://guiamove.vercel.app');
    expect(urls).toContain('https://guiamove.vercel.app/temporizador');
    expect(urls).toContain('https://guiamove.vercel.app/termometro');
    expect(urls).toContain('https://guiamove.vercel.app/rotinas');
    expect(urls).toContain('https://guiamove.vercel.app/sequenciamento');
    expect(urls).toContain('https://guiamove.vercel.app/about');
    expect(urls).toContain('https://guiamove.vercel.app/contact');
    expect(urls).toContain('https://guiamove.vercel.app/privacy');
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }

    const robotsConfig = robots();
    expect(robotsConfig.sitemap).toBe('https://guiamove.vercel.app/sitemap.xml');
  });
});
