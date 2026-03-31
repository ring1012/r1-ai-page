export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;

  if (method === 'GET') {
    const data = await env.KV.get('dashboard_stats', { type: 'json' }) || { views: 0, lastUpdated: new Date().toISOString() };
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (method === 'POST') {
    const existing = await env.KV.get('dashboard_stats', { type: 'json' }) || { views: 0 };
    const newData = {
      views: existing.views + 1,
      lastUpdated: new Date().toISOString()
    };
    await env.KV.put('dashboard_stats', JSON.stringify(newData));
    return new Response(JSON.stringify(newData), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
