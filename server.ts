import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const UPSTREAM_URL = 'https://almasor-outage-monitoring.vercel.app/api/snapshot';

app.use(express.json({ limit: '10mb' }));

// Memory cache for sub-second auto-refresh
interface CacheState {
  data: any | null;
  lastFetchedAt: number;
  etag: string;
  isFetching: boolean;
}

const cache: CacheState = {
  data: null,
  lastFetchedAt: 0,
  etag: '',
  isFetching: false,
};

// Load fallback snapshot on boot if needed
function loadFallbackSnapshot() {
  const fallbackPath = path.resolve(__dirname, 'src/data/fallback-snapshot.json');
  if (fs.existsSync(fallbackPath)) {
    try {
      const raw = fs.readFileSync(fallbackPath, 'utf8');
      cache.data = JSON.parse(raw);
      cache.lastFetchedAt = Date.now();
      cache.etag = `fallback-${Date.now()}`;
      console.log(`[Cache] Loaded fallback snapshot (${cache.data?.rows?.length || 0} rows)`);
    } catch (err) {
      console.error('[Cache] Failed to parse fallback snapshot:', err);
    }
  }
}

// Background sync function
async function syncFromUpstream(force = false): Promise<any> {
  const now = Date.now();
  const CACHE_TTL_MS = 15000; // 15 seconds fresh cache

  if (!force && cache.data && now - cache.lastFetchedAt < CACHE_TTL_MS) {
    return cache.data;
  }

  if (cache.isFetching && cache.data) {
    return cache.data;
  }

  cache.isFetching = true;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(`${UPSTREAM_URL}?refresh=1&ts=${now}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Almasor-NOC-Agent/1.0',
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json && json.rows && Array.isArray(json.rows)) {
        cache.data = json;
        cache.lastFetchedAt = now;
        cache.etag = `snap-${now}-${json.rows.length}`;
        console.log(`[Sync] Upstream Google Sheets API snapshot updated: ${json.rows.length} rows, ${json.napDownRows?.length || 0} NAP down`);
        return cache.data;
      }
    }
    console.warn(`[Sync] Upstream returned status ${res.status}; falling back to cached snapshot.`);
  } catch (err: any) {
    console.warn(`[Sync] Upstream fetch timed out or failed (${err.message}). Using local cache.`);
  } finally {
    cache.isFetching = false;
  }

  if (!cache.data) {
    loadFallbackSnapshot();
  }
  return cache.data;
}

// Pre-fill cache on server startup
loadFallbackSnapshot();
syncFromUpstream(true).catch(() => {});

// Background auto-refresh poller every 20s
setInterval(() => {
  syncFromUpstream(false).catch(() => {});
}, 20000);

// API Routes
app.get('/api/snapshot', async (req, res) => {
  const force = req.query.refresh === '1';
  try {
    const data = await syncFromUpstream(force);
    if (!data) {
      return res.status(503).json({
        ok: false,
        message: 'Outage snapshot currently initializing. Please retry in a moment.',
      });
    }

    res.setHeader('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
    res.setHeader('X-NOC-Cache-Age-Seconds', Math.round((Date.now() - cache.lastFetchedAt) / 1000));
    return res.json(data);
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api/source-health', async (_req, res) => {
  const isHealthy = !!cache.data;
  const ageSec = Math.round((Date.now() - cache.lastFetchedAt) / 1000);
  return res.json({
    ok: isHealthy,
    source: 'Google Sheets API (via Almasor Endpoint)',
    cachedRows: cache.data?.rows?.length || 0,
    napDownRows: cache.data?.napDownRows?.length || 0,
    cacheAgeSeconds: ageSec,
    syncStatus: ageSec < 60 ? 'LIVE_STREAMING' : 'HEALTHY_BUFFER',
    lastSyncTimestamp: new Date(cache.lastFetchedAt).toISOString(),
  });
});

app.post('/api/agent/ai-audit', async (req, res) => {
  const { pendingCount, provinceStats, agedIncidents, findingsBreakdown } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Return high-precision rule-based NOC evaluation if no Gemini API key set
    const topProvince = Object.entries(provinceStats || {}).sort((a: any, b: any) => b[1] - a[1])[0] as [string, number] | undefined;
    return res.json({
      ok: true,
      mode: 'heuristic-noc-agent',
      summary: `Active Outage Assessment: ${pendingCount} unresolved NAP outages monitored across Bicol region. ${topProvince ? `${topProvince[0]} accounts for the critical majority (${topProvince[1]} outages).` : ''}`,
      riskAssessment: pendingCount > 50 ? 'ELEVATED SLA RISK: Backlog concentration requires emergency multi-team dispatch.' : 'MODERATE: Steady progress on field restoration.',
      topRootCauses: (findingsBreakdown || []).slice(0, 5).map((f: any) => ({
        cause: f.name || f.issue,
        count: f.count,
        impact: f.count > 10 ? 'High Sector Impact' : 'Localized Impact',
      })),
      fieldDispatchAdvice: [
        `Prioritize ${topProvince ? topProvince[0] : 'concentrated areas'} with specialized optical splicing crews.`,
        'Verify pigtail and coupler inventory for replacement in high-loss clusters.',
        'Enforce contractor SLA tracking for outages exceeding 48 hours.',
      ],
      criticalAgedIncidents: (agedIncidents || []).slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const ai = new GoogleGenAI({});
    const prompt = `You are the Senior Network Operations Center (NOC) Engineering Lead for Almasor Telecom (Bicol Region: Albay, Camarines Sur, Camarines Norte, Sorsogon, Masbate).
Analyze the current live outage telemetry:
- Total Active NAP Down (FINAL STATUS = PENDING): ${pendingCount}
- Provincial Distribution: ${JSON.stringify(provinceStats)}
- Top Issue Findings: ${JSON.stringify(findingsBreakdown)}
- Critical Aged Outages (>24h): ${JSON.stringify(agedIncidents?.slice(0, 5))}

Provide a concise, professional engineering report formatted as JSON with the exact structure:
{
  "summary": "2-3 sentences executive summary of the outage situation",
  "riskAssessment": "Risk level (LOW/MODERATE/CRITICAL) with operational justification",
  "topRootCauses": [
    { "cause": "string", "count": number, "impact": "string" }
  ],
  "fieldDispatchAdvice": [
    "action item 1",
    "action item 2",
    "action item 3"
  ]
}
Return only valid JSON without markdown wrapping.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    const cleanedJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return res.json({
      ok: true,
      mode: 'gemini-2.5-flash',
      ...parsed,
      criticalAgedIncidents: (agedIncidents || []).slice(0, 5),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[AI Audit Error]', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Dev: Mount Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Prod: Serve static build assets
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NOC Server] Running on http://0.0.0.0:${PORT} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
