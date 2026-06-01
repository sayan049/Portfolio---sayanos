// import { NextRequest, NextResponse } from 'next/server'

// export async function GET(req: NextRequest) {
//   const url = req.nextUrl.searchParams.get('url')
//   if (!url) {
//     return new NextResponse('Missing URL parameter', { status: 400 })
//   }

//   try {
//     // Intercept YouTube at the proxy level (including Bing redirects that end up here)
//     if (url.includes('youtube.com') || url.includes('youtu.be')) {
//       let dest = 'https://search.yahoo.com/search?p=youtube'
//       if (url.includes('watch') || url.includes('youtu.be/')) {
//         try {
//           const urlObj = new URL(url.replace('youtu.be/', 'youtube.com/watch?v='))
//           const vid = urlObj.searchParams.get('v')
//           if (vid) dest = `https://www.youtube.com/embed/${vid}?autoplay=1`
//         } catch {}
//       }
//       return new NextResponse(`
//         <script>
//           window.parent.postMessage({ type: 'safari-navigate', url: '${dest}' }, '*')
//         </script>
//       `, { headers: { 'Content-Type': 'text/html' } })
//     }

//     const parsedUrl = new URL(url)

//     const res = await fetch(url, {
//       headers: {
//         'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
//         'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
//         'Accept-Language': 'en-US,en;q=0.9',
//         'Cache-Control':   'no-cache',
//         'Pragma':          'no-cache',
//         'Referer':         `${parsedUrl.protocol}//${parsedUrl.host}/`,
//       },
//       redirect: 'follow',
//     })

//     const contentType = res.headers.get('content-type') ?? ''

//     // Non-HTML: pipe straight through
//     if (!contentType.includes('text/html')) {
//       const buf = await res.arrayBuffer()
//       return new NextResponse(buf, {
//         headers: {
//           'Content-Type':                 contentType || 'application/octet-stream',
//           'Access-Control-Allow-Origin':  '*',
//         },
//       })
//     }

//     let html = await res.text()
//     const base = `${parsedUrl.protocol}//${parsedUrl.host}`

//     // 1) Inject <base> so relative assets resolve correctly
//     const headEndIdx = html.indexOf('</head>')
//     if (headEndIdx !== -1) {
//       html = html.substring(0, headEndIdx) +
//         `<base href="${base}/">` +
//         html.substring(headEndIdx)
//     }

//     // 1.2) If it's Bing or Yahoo, strip all their original scripts so they don't fire background CORS-violating AJAX requests
//     if (url.includes('bing.com') || url.includes('yahoo.com')) {
//       html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
//     }

//     // 1.5) Rewrite absolute paths in HTML attributes to point to the original domain
//     // so scripts that ignore <base> or use location.origin don't hit our local server.
//     html = html.replace(/src="\/([^/])/g, `src="${base}/$1`)
//     html = html.replace(/href="\/([^/])/g, `href="${base}/$1`)

//     // 1.8) Rewrite YouTube URLs directly in the HTML to prevent native JS redirects (framebusting)
//     // Convert watch URLs to embed
//     html = html.replace(/https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g, 'https://www.youtube.com/embed/$2?autoplay=1')
//     // Convert all other youtube URLs to bing search
//     html = html.replace(/https:\/\/(www\.)?youtube\.com/g, 'https://www.bing.com/videos/search?q=youtube')
//     // Convert youtu.be to embed
//     html = html.replace(/https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g, 'https://www.youtube.com/embed/$1?autoplay=1')

//     // 2) Intercept ALL link navigations → proxy them
//     //    This fixes "youtube.com refused to connect" when clicking DDG results
//     const interceptScript = `
// <script>
// (function() {
//   // Prevent frame-busting
//   try {
//     Object.defineProperty(window, 'top',    { get: function(){ return window; } });
//     Object.defineProperty(window, 'parent', { get: function(){ return window; } });
//   } catch(e) {}

//   function proxyUrl(href) {
//     try {
//       var abs = new URL(href, '${base}/').href;
//       return '/api/proxy?url=' + encodeURIComponent(abs);
//     } catch(e) { return href; }
//   }

//   // Intercept anchor clicks
//   document.addEventListener('click', function(e) {
//     var el = e.target;
//     while (el && el.tagName !== 'A') el = el.parentElement;
//     if (!el) return;
//     var href = el.getAttribute('href');
//     if (!href || href.startsWith('#') || href.startsWith('javascript')) return;
//     e.preventDefault();
//     e.stopPropagation();
//     var proxied = proxyUrl(href);
//     // Post message to parent to navigate iframe
//     window.parent.postMessage({ type: 'safari-navigate', url: proxied }, '*');
//   }, true);

//   // Intercept form submissions
//   document.addEventListener('submit', function(e) {
//     var form = e.target;
//     var action = form.getAttribute('action') || window.location.href;
//     e.preventDefault();
//     var params = new URLSearchParams(new FormData(form));
//     var dest   = new URL(action, '${base}/').href + (action.includes('?') ? '&' : '?') + params.toString();
//     window.parent.postMessage({ type: 'safari-navigate', url: '/api/proxy?url=' + encodeURIComponent(dest) }, '*');
//   }, true);
// })();
// </script>`

//     // Insert right after <head>
//     const headStartIdx = html.indexOf('<head')
//     const headTagEnd   = html.indexOf('>', headStartIdx)

//     let finalInjections = interceptScript
//     if (url.includes('lite.duckduckgo.com')) {
//       finalInjections += `
// <style>
//   body, html { background: #1a1a1a !important; color: #f0f0f0 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important; }
//   a { color: #4FC3F7 !important; text-decoration: none !important; }
//   a:hover { text-decoration: underline !important; }
//   input[type="text"] { background: #2a2a2a !important; color: white !important; border: 1px solid #4FC3F7 !important; border-radius: 4px !important; padding: 4px 8px !important; }
//   input[type="submit"] { background: #4FC3F7 !important; color: black !important; border: none !important; border-radius: 4px !important; padding: 4px 12px !important; cursor: pointer !important; font-weight: bold !important; }
//   .result-snippet { color: #a0a0a0 !important; }
//   .result-url { color: #4FC3F7 !important; opacity: 0.7; font-size: 12px; }
// </style>`
//     }

//     if (headTagEnd !== -1) {
//       html = html.substring(0, headTagEnd + 1) + finalInjections + html.substring(headTagEnd + 1)
//     } else {
//       html = finalInjections + html
//     }

//     return new NextResponse(html, {
//       headers: {
//         'Content-Type':                'text/html; charset=utf-8',
//         'Access-Control-Allow-Origin': '*',
//         'X-Frame-Options':             'ALLOWALL',
//       },
//     })

//   } catch (error) {
//     const msg = error instanceof Error ? error.message : String(error)
//     console.log(`Proxy Error: ${msg} for ${url}`)

//     const fallbackHtml = `<!DOCTYPE html>
// <html>
// <head>
// <style>
//   * { box-sizing: border-box; margin: 0; padding: 0; }
//   body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #111118; color: white; }
//   .card { background: rgba(255,255,255,0.06); backdrop-filter: blur(20px); padding: 2rem 2.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); text-align: center; max-width: 420px; }
//   h2 { font-size: 18px; font-weight: 600; margin-bottom: 0.75rem; }
//   p { color: rgba(255,255,255,0.55); font-size: 14px; line-height: 1.6; margin-bottom: 1.25rem; }
//   code { background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; font-size: 12px; word-break: break-all; }
//   a { display: inline-block; padding: 9px 20px; background: #4FC3F7; color: #000; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
// </style>
// </head>
// <body>
//   <div class="card">
//     <h2>⚠️ Cannot Load Page</h2>
//     <p>This site could not be loaded through the proxy.<br><code>${url}</code></p>
//     <a href="${url}" target="_blank">Open in New Tab ↗</a>
//   </div>
// </body>
// </html>`

//     return new NextResponse(fallbackHtml, {
//       status: 200,
//       headers: { 'Content-Type': 'text/html; charset=utf-8' },
//     })
//   }
// }
import { NextRequest, NextResponse } from 'next/server'

// Search engines to try in order — stops at first success
const SEARCH_ENGINES = [
  (q: string) => `https://search.brave.com/search?q=${encodeURIComponent(q)}&source=web`,
  (q: string) => `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(q)}`,
  (q: string) => `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`,
]

const FETCH_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'DNT': '1',
}

function isSearchEngineBlocked(html: string): boolean {
  const lower = html.toLowerCase()
  return (
    lower.includes('if this persists') ||
    lower.includes('unusual traffic') ||
    lower.includes('captcha') ||
    lower.includes('robot') ||
    lower.includes('automated') ||
    lower.includes('blocked') ||
    lower.includes('support email') ||
    html.length < 500   // suspiciously short = likely an error page
  )
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 })
  }

  try {
    // ── YouTube intercept ─────────────────────────────────────────────────
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let dest = `/api/proxy?url=${encodeURIComponent('https://search.brave.com/search?q=youtube&source=web')}`
      if (url.includes('watch') || url.includes('youtu.be/')) {
        try {
          const urlObj = new URL(url.replace('youtu.be/', 'youtube.com/watch?v='))
          const vid = urlObj.searchParams.get('v')
          if (vid) dest = `https://www.youtube.com/embed/${vid}?autoplay=0`
        } catch { }
      } else if (url.includes('/embed/')) {
        dest = url   // pass embed URLs through directly
      }

      if (dest.includes('/embed/')) {
        return new NextResponse(`<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>*{margin:0;padding:0;box-sizing:border-box}body{background:#000;height:100vh}
iframe{width:100%;height:100%;border:none;display:block}</style>
</head><body>
<iframe src="${dest}"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
  allowfullscreen></iframe>
</body></html>`, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        })
      }

      return new NextResponse(`
        <script>
          window.parent.postMessage({ type: 'safari-navigate', url: '${dest}' }, '*')
        </script>
      `, { headers: { 'Content-Type': 'text/html' } })
    }

    // ── Detect if this is a search engine request ─────────────────────────
    const isSearchRequest =
      url.includes('search.brave.com') ||
      url.includes('duckduckgo.com') ||
      url.includes('lite.duckduckgo.com') ||
      url.includes('html.duckduckgo.com')

    // ── For search requests: try engines in order until one works ─────────
    if (isSearchRequest) {
      // Extract the query from whichever search engine URL was passed
      let query = ''
      try {
        const parsedSearch = new URL(url)
        query = parsedSearch.searchParams.get('q') || parsedSearch.searchParams.get('p') || ''
      } catch { }

      if (query) {
        for (const engineFn of SEARCH_ENGINES) {
          const engineUrl = engineFn(query)
          try {
            const res = await fetch(engineUrl, {
              headers: { ...FETCH_HEADERS, Referer: 'https://www.google.com/' },
              redirect: 'follow',
            })

            if (!res.ok) continue

            const html = await res.text()
            if (isSearchEngineBlocked(html)) continue

            // Success — process and return
            return processHtml(html, engineUrl, query)
          } catch {
            continue
          }
        }

        // All engines failed — return a styled error with direct search links
        return new NextResponse(buildSearchFallback(query), {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        })
      }
    }

    // ── Normal URL fetch ──────────────────────────────────────────────────
    const parsedUrl = new URL(url)
    const res = await fetch(url, {
      headers: { ...FETCH_HEADERS, Referer: `${parsedUrl.protocol}//${parsedUrl.host}/` },
      redirect: 'follow',
    })

    const contentType = res.headers.get('content-type') ?? ''

    if (!contentType.includes('text/html')) {
      const buf = await res.arrayBuffer()
      return new NextResponse(buf, {
        headers: {
          'Content-Type': contentType || 'application/octet-stream',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    const html = await res.text()
    return processHtml(html, url)

  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error(`Proxy Error: ${msg} for ${url}`)
    return new NextResponse(buildErrorPage(url), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}

// ── HTML processor ────────────────────────────────────────────────────────────

function processHtml(html: string, url: string, searchQuery?: string): NextResponse {
  const parsedUrl = new URL(url)
  const base = `${parsedUrl.protocol}//${parsedUrl.host}`
  const isSearchPage = url.includes('brave.com') || url.includes('duckduckgo.com')

  // Strip scripts from search engines (they fire CORS-violating XHR)
  if (isSearchPage || url.includes('bing.com') || url.includes('yahoo.com')) {
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  }

  // Rewrite root-relative paths
  html = html.replace(/src="\/([^/])/g, `src="${base}/$1`)
  html = html.replace(/href="\/([^/])/g, `href="${base}/$1`)

  // Rewrite YouTube URLs
  html = html.replace(
    /https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
    'https://www.youtube.com/embed/$2?autoplay=0'
  )
  html = html.replace(
    /https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/g,
    'https://www.youtube.com/embed/$1?autoplay=0'
  )
  html = html.replace(
    /https:\/\/(www\.)?youtube\.com(?!\/embed)/g,
    'https://www.bing.com/videos/search?q=youtube'
  )

  const interceptScript = buildInterceptScript(base)
  const searchStyles = isSearchPage ? SEARCH_STYLES : ''

  // If it's Brave Search and scripts were stripped, inject a working search form
  const searchFormInjection = (isSearchPage && searchQuery)
    ? buildSearchFormInjection(searchQuery)
    : ''

  let finalInjections = interceptScript + searchStyles + searchFormInjection

  // Inject right after opening <head>
  const headStartIdx = html.indexOf('<head')
  const headTagEnd = html.indexOf('>', headStartIdx)

  if (headTagEnd !== -1) {
    html = html.substring(0, headTagEnd + 1) + finalInjections + html.substring(headTagEnd + 1)
  } else {
    html = finalInjections + html
  }

  // Also inject <base> before </head>
  const headEndIdx = html.indexOf('</head>')
  if (headEndIdx !== -1) {
    html = html.substring(0, headEndIdx) +
      `<base href="${base}/">` +
      html.substring(headEndIdx)
  }

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'X-Frame-Options': 'ALLOWALL',
    },
  })
}

// ── Script / style builders ───────────────────────────────────────────────────

function buildInterceptScript(base: string): string {
  return `<script>
(function() {
  try {
    Object.defineProperty(window, 'top',    { get: function(){ return window; } });
    Object.defineProperty(window, 'parent', { get: function(){ return window; } });
    Object.defineProperty(window, 'self',   { get: function(){ return window; } });
  } catch(e) {}

  function toProxy(href) {
    try {
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:')) return null;
      if (href.startsWith('/api/proxy')) return href;
      var abs = new URL(href, '${base}/').href;
      if (abs.includes('youtube.com/embed/')) return abs;
      return '/api/proxy?url=' + encodeURIComponent(abs);
    } catch(e) { return null; }
  }

  function navigate(url) {
    window.parent.postMessage({ type: 'safari-navigate', url: url }, '*');
  }

  document.addEventListener('click', function(e) {
    var el = e.target;
    while (el && el.tagName !== 'A') el = el.parentElement;
    if (!el) return;
    var href = el.getAttribute('href');
    var proxied = toProxy(href);
    if (!proxied) return;
    e.preventDefault();
    e.stopPropagation();
    navigate(proxied);
  }, true);

  document.addEventListener('submit', function(e) {
    var form   = e.target;
    var method = (form.getAttribute('method') || 'get').toLowerCase();
    var action = form.getAttribute('action') || window.location.href;
    e.preventDefault();
    e.stopPropagation();
    var absAction = new URL(action, '${base}/').href;
    if (method === 'get') {
      var params = new URLSearchParams(new FormData(form));
      var sep    = absAction.includes('?') ? '&' : '?';
      navigate('/api/proxy?url=' + encodeURIComponent(absAction + sep + params.toString()));
    } else {
      navigate('/api/proxy?url=' + encodeURIComponent(absAction));
    }
  }, true);
})();
</script>`
}

// Injected search form that replaces the broken search box on Brave/DDG
// when their scripts are stripped
function buildSearchFormInjection(query: string): string {
  return `<script>
document.addEventListener('DOMContentLoaded', function() {
  // Find any search input and prefill it
  var inputs = document.querySelectorAll('input[type="text"], input[type="search"], input[name="q"]');
  inputs.forEach(function(inp) { inp.value = ${JSON.stringify(query)}; });
});
</script>`
}

const SEARCH_STYLES = `<style>
  html, body {
    background: #111118 !important;
    color: #e8e8e8 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    font-size: 15px !important;
  }
  a { color: #4FC3F7 !important; text-decoration: none !important; }
  a:hover { text-decoration: underline !important; color: #81d4fa !important; }

  /* Search inputs */
  input[type="text"], input[type="search"], input[name="q"] {
    background: #1e1e2e !important;
    color: #e8e8e8 !important;
    border: 1px solid rgba(79,195,247,0.4) !important;
    border-radius: 8px !important;
    padding: 8px 12px !important;
    font-size: 14px !important;
    outline: none !important;
    width: 100% !important;
    max-width: 600px !important;
  }
  input[type="text"]:focus, input[type="search"]:focus {
    border-color: #4FC3F7 !important;
    box-shadow: 0 0 0 2px rgba(79,195,247,0.15) !important;
  }
  input[type="submit"], button[type="submit"], button.btn {
    background: #4FC3F7 !important;
    color: #000 !important;
    border: none !important;
    border-radius: 8px !important;
    padding: 8px 16px !important;
    cursor: pointer !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    margin-left: 8px !important;
  }

  /* Result cards */
  .snippet-title, .result__title, h3 {
    color: #4FC3F7 !important;
    font-size: 17px !important;
    margin-bottom: 2px !important;
  }
  .snippet-description, .result__snippet, .snippet {
    color: #aaa !important;
    font-size: 13px !important;
    line-height: 1.5 !important;
  }
  .result__url, .snippet-url {
    color: #5cb85c !important;
    font-size: 12px !important;
  }
  .result, .snippet, [data-type] {
    border-bottom: 1px solid rgba(255,255,255,0.06) !important;
    padding: 14px 0 !important;
    margin: 0 !important;
  }

  /* Hide ads / tracking UI */
  [class*="ad-"], [id*="ad-"], [class*="sponsored"], [data-sponsored],
  .footer, [class*="footer"], nav { display: none !important; }
</style>`

// ── Fallback pages ────────────────────────────────────────────────────────────

function buildSearchFallback(query: string): string {
  const encoded = encodeURIComponent(query)
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    background:#111118;color:#e8e8e8;
    display:flex;align-items:center;justify-content:center;min-height:100vh;padding:2rem}
  .card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);
    border-radius:16px;padding:2rem 2.5rem;max-width:480px;width:100%;text-align:center}
  h2{font-size:18px;font-weight:600;margin-bottom:.5rem}
  p{color:rgba(255,255,255,.5);font-size:14px;margin-bottom:1.5rem;line-height:1.6}
  .engines{display:flex;flex-direction:column;gap:10px}
  .engine-btn{
    display:flex;align-items:center;gap:10px;
    padding:10px 16px;border-radius:10px;
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
    color:#4FC3F7;text-decoration:none;font-size:14px;font-weight:500;
    cursor:pointer;transition:background .15s
  }
  .engine-btn:hover{background:rgba(79,195,247,.12)}
  .engine-icon{font-size:20px;flex-shrink:0}
</style>
</head>
<body>
<div class="card">
  <h2>🔍 Search results unavailable</h2>
  <p>Search engines are blocking automated requests right now.<br>
  Click below to search for <strong style="color:#e8e8e8">"${query.replace(/</g, '&lt;')}"</strong> directly:</p>
  <div class="engines">
    <a class="engine-btn"
       href="/api/proxy?url=${encodeURIComponent(`https://html.duckduckgo.com/html/?q=${encoded}`)}"
       onclick="window.parent.postMessage({type:'safari-navigate',url:this.href},'*');return false;">
      <span class="engine-icon">🦆</span> DuckDuckGo
    </a>
    <a class="engine-btn"
       href="/api/proxy?url=${encodeURIComponent(`https://www.bing.com/search?q=${encoded}`)}"
       onclick="window.parent.postMessage({type:'safari-navigate',url:this.href},'*');return false;">
      <span class="engine-icon">🔷</span> Bing
    </a>
    <a class="engine-btn"
       href="https://www.google.com/search?q=${encoded}"
       target="_blank" rel="noopener">
      <span class="engine-icon">🌐</span> Google (new tab)
    </a>
  </div>
</div>
</body>
</html>`
}

function buildErrorPage(url: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8">
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,sans-serif;
    display:flex;align-items:center;justify-content:center;
    height:100vh;background:#111118;color:white}
  .card{background:rgba(255,255,255,.06);backdrop-filter:blur(20px);
    padding:2rem 2.5rem;border-radius:16px;
    border:1px solid rgba(255,255,255,.1);text-align:center;max-width:420px}
  h2{font-size:18px;font-weight:600;margin-bottom:.75rem}
  p{color:rgba(255,255,255,.55);font-size:14px;line-height:1.6;margin-bottom:1.25rem}
  code{background:rgba(255,255,255,.08);padding:2px 6px;border-radius:4px;
    font-size:12px;word-break:break-all}
  a{display:inline-block;padding:9px 20px;background:#4FC3F7;color:#000;
    text-decoration:none;border-radius:8px;font-size:14px;font-weight:600}
</style>
</head>
<body>
  <div class="card">
    <h2>⚠️ Cannot Load Page</h2>
    <p>This site could not be loaded through the proxy.<br>
    <code>${url.replace(/</g, '&lt;').slice(0, 80)}</code></p>
    <a href="${url}" target="_blank" rel="noopener">Open in New Tab ↗</a>
  </div>
</body>
</html>`
}