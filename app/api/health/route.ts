import { NextResponse } from 'next/server';
import { cache, CacheKeys } from '@/lib/cache';

// ─── Health check (used by Docker + Nginx health checks) ─────────────────────
export async function GET() {
  const uptime = process.uptime();
  const mem = process.memoryUsage();
  const cacheStats = cache.stats();

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    instance: process.env.INSTANCE_ID ?? 'local',
    version: process.env.npm_package_version ?? '1.0.0',
    uptime: Math.floor(uptime),
    memory: {
      rss:       Math.round(mem.rss / 1024 / 1024) + 'MB',
      heapUsed:  Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
    },
    cache: cacheStats,
    node: process.version,
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type':  'application/json',
    },
  });
}
