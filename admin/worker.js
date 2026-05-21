// Cloudflare Worker — GitHub OAuth proxy for knowjoby blog admin
//
// Environment variables (set in Workers dashboard → Settings → Variables):
//   CLIENT_SECRET   GitHub OAuth App client secret
//   ALLOWED_LOGIN   Your GitHub username (e.g. "knowjoby") — blocks anyone else from logging in

const CLIENT_ID = 'Ov23liDN9uKWS28woYwW';
const ADMIN_URL = 'https://knowjoby.github.io/admin/';
const SCOPE     = 'public_repo';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const CALLBACK_URI = new URL('/callback', url.origin).href;

    // ── /auth ── redirect user to GitHub for authorization
    if (url.pathname === '/auth') {
      const params = new URLSearchParams({
        client_id:    CLIENT_ID,
        redirect_uri: CALLBACK_URI,
        scope:        SCOPE,
        state:        crypto.randomUUID(),
      });
      return Response.redirect(
        `https://github.com/login/oauth/authorize?${params}`,
        302
      );
    }

    // ── /callback ── GitHub sends back ?code=…
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      if (!code) return new Response('Missing OAuth code', { status: 400 });

      // Exchange code for access token
      const res = await fetch('https://github.com/login/oauth/access_token', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          client_id:     CLIENT_ID,
          client_secret: env.CLIENT_SECRET,
          code,
          redirect_uri:  CALLBACK_URI,
        }),
      });
      const data = await res.json();

      if (!data.access_token) {
        return new Response(`OAuth failed: ${data.error_description || data.error || 'unknown'}`, { status: 400 });
      }

      // Optional: block anyone except the repo owner
      if (env.ALLOWED_LOGIN) {
        const me = await fetch('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${data.access_token}`,
            'User-Agent':    'knowjoby-blog-admin/1.0',
          },
        }).then(r => r.json());
        if (me.login !== env.ALLOWED_LOGIN) {
          return new Response('Unauthorized', { status: 403 });
        }
      }

      // Token in URL hash — never sent to any server, JS reads & clears it immediately
      return Response.redirect(`${ADMIN_URL}#token=${data.access_token}`, 302);
    }

    return new Response('Not found', { status: 404 });
  },
};
