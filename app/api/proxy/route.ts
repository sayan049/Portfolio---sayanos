import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    // Intercept YouTube at the proxy level (including Bing redirects that end up here)
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let dest = 'https://www.bing.com/videos/search?q=youtube'
      if (url.includes('watch') || url.includes('youtu.be/')) {
        try {
          const urlObj = new URL(url.replace('youtu.be/', 'youtube.com/watch?v='))
          const vid = urlObj.searchParams.get('v')
          if (vid) dest = `https://www.youtube.com/embed/${vid}?autoplay=1`
        } catch {}
      }
      return new NextResponse(`
        <script>
          window.parent.postMessage({ type: 'safari-navigate', url: '${dest}' }, '*')
        </script>
      `, { headers: { 'Content-Type': 'text/html' } })
    }

    const parsedUrl = new URL(url)

    const res = await fetch(url, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control':   'no-cache',
        'Pragma':          'no-cache',
        'Referer':         `${parsedUrl.protocol}//${parsedUrl.host}/`,
      },
      redirect: 'follow',
    })

    const contentType = res.headers.get('content-type') ?? ''

    // Non-HTML: pipe straight through
    if (!contentType.includes('text/html')) {
      const buf = await res.arrayBuffer()
      return new NextResponse(buf, {
        headers: {
          'Content-Type':                 contentType || 'application/octet-stream',
          'Access-Control-Allow-Origin':  '*',
        },
      })
    }

    let html = await res.text()
    const base = `${parsedUrl.protocol}//${parsedUrl.host}`

    // 1) Inject <base> so relative assets resolve correctly
    const headEndIdx = html.indexOf('</head>')
    if (headEndIdx !== -1) {
      html = html.substring(0, headEndIdx) +
        `<base href="${base}/">` +
        html.substring(headEndIdx)
    }

    // 1.2) If it's Bing or Yahoo, strip all their original scripts so they don't fire background CORS-violating AJAX requests
    if (url.includes('bing.com') || url.includes('yahoo.com')) {
      html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    }

    // 1.5) Rewrite absolute paths in HTML attributes to point to the original domain
    // so scripts that ignore <base> or use location.origin don't hit our local server.
    html = html.replace(/src="\/([^/])/g, `src="${base}/$1`)
    html = html.replace(/href="\/([^/])/g, `href="${base}/$1`)

    // 1.8) Rewrite YouTube URLs directly in the HTML to prevent native JS redirects (framebusting)
    // Convert watch URLs to embed
    html = html.replace(/https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g, 'https://www.youtube.com/embed/$2?autoplay=1')
    // Convert all other youtube URLs to bing search
    html = html.replace(/https:\/\/(www\.)?youtube\.com/g, 'https://www.bing.com/videos/search?q=youtube')
    // Convert youtu.be to embed
    html = html.replace(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g, 'https://www.youtube.com/embed/$1?autoplay=1')

    // 2) Intercept ALL link navigations → proxy them
    //    This fixes "youtube.com refused to connect" when clicking DDG results
    const interceptScript = `
<script>
(function() {
  // Prevent frame-busting
  try {
    Object.defineProperty(window, 'top',    { get: function(){ return window; } });
    Object.defineProperty(window, 'parent', { get: function(){ return window; } });
  } catch(e) {}

  function proxyUrl(href) {
    try {
      var abs = new URL(href, '${base}/').href;
      return '/api/proxy?url=' + encodeURIComponent(abs);
    } catch(e) { return href; }
  }

  // Intercept anchor clicks
  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el) return;
    var href = el.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript')) return;
    e.preventDefault();
    e.stopPropagation();
    var proxied = proxyUrl(href);
    // Post message to parent to navigate iframe
    window.parent.postMessage({ type: 'safari-navigate', url: proxied }, '*');
  }, true);

  // Intercept form submissions
  document.addEventListener('submit', function(e) {
    var form = e.target;
    var action = form.getAttribute('action') || window.location.href;
    e.preventDefault();
    var params = new URLSearchParams(new FormData(form));
    var dest   = new URL(action, '${base}/').href + (action.includes('?') ? '&' : '?') + params.toString();
    window.parent.postMessage({ type: 'safari-navigate', url: '/api/proxy?url=' + encodeURIComponent(dest) }, '*');
  }, true);
})();
</script>`

    // Insert right after <head>
    const headStartIdx = html.indexOf('<head')
    const headTagEnd   = html.indexOf('>', headStartIdx)

    let finalInjections = interceptScript
    if (url.includes('lite.duckduckgo.com')) {
      finalInjections += `
<style>
  body, html { background: #1a1a1a !important; color: #f0f0f0 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
  a { color: #4FC3F7 !important; text-decoration: none !important; }
  a:hover { text-decoration: underline !important; }
  input[type="text"] { background: #2a2a2a !important; color: white !important; border: 1px solid #4FC3F7 !important; border-radius: 4px !important; padding: 4px 8px !important; }
  input[type="submit"] { background: #4FC3F7 !important; color: black !important; border: none !important; border-radius: 4px !important; padding: 4px 12px !important; cursor: pointer !important; font-weight: bold !important; }
  .result-snippet { color: #a0a0a0 !important; }
  .result-url { color: #4FC3F7 !important; opacity: 0.7; font-size: 12px; }
</style>`
    }

    if (headTagEnd !== -1) {
      html = html.substring(0, headTagEnd + 1) + finalInjections + html.substring(headTagEnd + 1)
    } else {
      html = finalInjections + html
    }

    return new NextResponse(html, {
      headers: {
        'Content-Type':                'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'X-Frame-Options':             'ALLOWALL',
      },
    })

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.log(`Proxy Error: ${msg} for ${url}`)

    const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #111118; color: white; }
  .card { background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); padding: 2rem 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 420px; }
  h2 { font-size: 18px; font-weight: 600; margin-bottom: 0.75rem; }
  p { color: rgba(255,255,255,0.55); font-size: 14px; line-height: 1.6; margin-bottom: 1.25rem; }
  code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 12px; word-break: break-all; }
  a { display: inline-block; padding: 9px 20px; background: #4FC3F7; color: #000; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
</style>
</head>
<body>
  <div class="card">
    <h2>⚠️ Cannot Load Page</h2>
    <p>This site could not be loaded through the proxy.<br><code>${url}</code></p>
    <a href="${url}" target="_blank">Open in New Tab ↗</a>
  </div>
</body>
</html>`

    return new NextResponse(fallbackHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}
