async function test() {
  const res = await fetch('https://lite.duckduckgo.com/lite/?q=youtube', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    }
  });
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
