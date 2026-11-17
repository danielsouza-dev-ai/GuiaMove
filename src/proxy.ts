import { NextResponse, type NextRequest } from 'next/server';
import {
  KNOWN_MARKDOWN_ROUTES,
  buildMarkdown404,
  wantsMarkdown,
} from '@/lib/agent/markdownNegotiation';

function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname || '/';
}

export function proxy(request: NextRequest) {
  const pathname = normalizePathname(request.nextUrl.pathname);

  if (wantsMarkdown(request.headers.get('accept'))) {
    const markdown = KNOWN_MARKDOWN_ROUTES[pathname];
    if (markdown) {
      return new NextResponse(markdown, {
        status: 200,
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          Vary: 'Accept',
        },
      });
    }

    return new NextResponse(buildMarkdown404(pathname), {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set(
    'Vary',
    'Accept, rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch',
  );
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|manifest\\.webmanifest|sw\\.js|og-image\\.png|icons/|arasaac/).*)',
  ],
};
