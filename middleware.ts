/**
 * MediaVerse — Next.js Edge Middleware
 * Runs at the EDGE (before any page or API route) on every request.
 * Responsibilities:
 *   1. IP-based rate limiting (sliding window, in-memory per edge node)
 *   2. Bot / crawler detection
 *   3. Geo-blocking stubs (uncomment to enable)
 *   4. Request ID injection for tracing
 *   5. CORS preflight handling
 */

import { NextResponse, type NextRequest } from 'next/server';

// ─── Sliding Window Rate Limiter (Edge-compatible, no Node APIs) ──────────────
interface WindowEntry {
  count: number;
  windowStart: number;
}

const RATE_LIMIT_WINDOW_MS = 60_000;   // 1 minute sliding window

const LIMITS: Record<string, { max: number; windowMs: number }> = {
  '/api/feed':    { max: 300, windowMs: 60_000 },  // 300 req/min per IP
  '/api/upload':  { max: 10,  windowMs: 60_000 },  // 10 uploads/min
  '/api/auth':    { max: 20,  windowMs: 60_000 },  // 20 auth attempts/min
  '/api/':        { max: 500, windowMs: 60_000 },  // 500 req/min for all other API
  '/':            { max: 200, windowMs: 60_000 },  // 200 req/min for pages
};

// In-memory store (per edge node — for distributed limiting use Redis)
const rateLimitStore = new Map<string, WindowEntry>();

function getRateLimit(pathname: string) {
  const entry = Object.entries(LIMITS).find(([path]) => pathname.startsWith(path));
  return entry ? entry[1] : LIMITS['/'];
}

function isRateLimited(ip: string, pathname: string): { limited: boolean; remaining: number; reset: number } {
  const limit = getRateLimit(pathname);
  const key = `${ip}:${pathname.slice(0, 20)}`;
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > limit.windowMs) {
    rateLimitStore.set(key, { count: 1, windowStart: now });
    return { limited: false, remaining: limit.max - 1, reset: now + limit.windowMs };
  }

  entry.count++;
  const remaining = Math.max(0, limit.max - entry.count);
  const reset = entry.windowStart + limit.windowMs;

  if (entry.count > limit.max) {
    return { limited: true, remaining: 0, reset };
  }

  return { limited: false, remaining, reset };
}

// Periodically clean old entries (every 500 requests)
let cleanupCounter = 0;
function maybeCleanup() {
  if (++cleanupCounter % 500 !== 0) return;
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [key, val] of rateLimitStore.entries()) {
    if (val.windowStart < cutoff) rateLimitStore.delete(key);
  }
}

// ─── Bot detection ────────────────────────────────────────────────────────────
const BOT_PATTERNS = [
  /bot|crawl|spider|slurp|facebook|twitter|whatsapp|telegram/i,
];
const ALLOWED_BOTS = /googlebot|bingbot|duckduckbot|linkedinbot/i;

function isBot(ua: string): boolean {
  if (ALLOWED_BOTS.test(ua)) return false;
  return BOT_PATTERNS.some(p => p.test(ua));
}

// ─── Middleware ───────────────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── CORS preflight ───────────────────────────────────────────────────────
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
        'Access-Control-Max-Age':       '86400',
      },
    });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim()
          ?? request.headers.get('x-real-ip')
          ?? '127.0.0.1';

  const ua = request.headers.get('user-agent') ?? '';

  // ─── Block scrapers from API ──────────────────────────────────────────────
  if (pathname.startsWith('/api/') && isBot(ua)) {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ─── Rate limiting ────────────────────────────────────────────────────────
  maybeCleanup();
  const { limited, remaining, reset } = isRateLimited(ip, pathname);

  const requestId = crypto.randomUUID();

  if (limited) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        retryAfter: Math.ceil((reset - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          'Content-Type':      'application/json',
          'Retry-After':       String(Math.ceil((reset - Date.now()) / 1000)),
          'X-RateLimit-Limit':     String(getRateLimit(pathname).max),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':     String(Math.ceil(reset / 1000)),
          'X-Request-ID':          requestId,
        },
      }
    );
  }

  // ─── Pass through with injected headers ──────────────────────────────────
  const response = NextResponse.next();
  response.headers.set('X-Request-ID',          requestId);
  response.headers.set('X-RateLimit-Remaining', String(remaining));
  response.headers.set('X-RateLimit-Reset',     String(Math.ceil(reset / 1000)));
  response.headers.set('X-Instance-ID',         process.env.INSTANCE_ID ?? 'local');
  response.headers.set('Access-Control-Allow-Origin', '*');

  return response;
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    '/((?!_next|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
