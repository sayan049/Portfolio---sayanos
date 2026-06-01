async function test() {
  const res = await fetch('https://html.duckduckgo.com/html/?q=reactjs', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
      'Accept-Language': 'en-US,en;q=0.5'
    }
  });
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
