// Visit ping for the Fireflies task: when someone opens /fireflies or its notes,
// push a notification to Shater's phone through ntfy (https://ntfy.sh).
// The topic lives only here on the server, never in the page.
const TOPIC = process.env.NTFY_TOPIC || 'shater-ff-45d753a71710';
const PAGES = { '/fireflies': 'the prototype', '/fireflies/details': 'the design notes' };
const BOT = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|vercel|headless|lighthouse/i;

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).end(); return; }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  const page = PAGES[String(body.path || '').replace(/\/$/, '')];
  const ua = req.headers['user-agent'] || '';
  if (!page || BOT.test(ua)) { res.status(204).end(); return; }

  const h = (k) => { const v = req.headers[k]; return v ? decodeURIComponent(String(v)) : ''; };
  const where = [h('x-vercel-ip-city'), h('x-vercel-ip-country')].filter(Boolean).join(', ') || 'somewhere';
  const device = /iPhone|iPad/.test(ua) ? 'iPhone/iPad' : /Android/.test(ua) ? 'Android' : /Mac OS X/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'unknown device';
  let from = 'direct or an email app';
  try { if (body.ref) from = new URL(body.ref).hostname; } catch {}

  try {
    await fetch(`https://ntfy.sh/${TOPIC}`, {
      method: 'POST',
      headers: { Title: `Someone opened ${page}`, Tags: 'eyes', Click: `https://shatermt.com${body.path}` },
      body: `${where} · ${device} · from ${from}`,
    });
  } catch {}
  res.status(204).end();
}
