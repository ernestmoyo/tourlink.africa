import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// One codebase, two deployments. APP_MODE decides what a deployment exposes:
//   APP_MODE=crm  → TourRelay desk. Root opens /ops; marketing pages redirect to
//                   the desk. The full CRM + bot API + traveller portal work.
//   (unset)       → public website (tourlink.africa). Marketing site only — the
//                   internal CRM (/ops) and bot/doc APIs are hidden, so the desk
//                   is never exposed on the public domain. (The traveller portal
//                   /trip and enquiry capture still work, feeding the shared DB.)
const MODE = process.env.APP_MODE

// What the CRM deployment serves (everything else redirects to the desk).
const CRM_ALLOWED = ['/ops', '/trip', '/api']
// Internal endpoints hidden on the public website.
const CRM_ONLY = ['/ops', '/api/whatsapp', '/api/documents']

function startsWithAny(pathname: string, prefixes: string[]): boolean {
  return prefixes.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (MODE === 'crm') {
    if (startsWithAny(pathname, CRM_ALLOWED)) return NextResponse.next()
    // Any marketing route on the CRM domain → land on the desk.
    const url = req.nextUrl.clone()
    url.pathname = '/ops'
    return NextResponse.redirect(url)
  }

  // Public website: keep the internal CRM out of sight.
  if (startsWithAny(pathname, CRM_ONLY)) {
    if (pathname.startsWith('/api/')) return new NextResponse('Not found', { status: 404 })
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  // Run on app routes, skip Next static assets + public images.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)'],
}
