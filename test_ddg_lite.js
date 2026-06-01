async function test() {
  const res = await fetch('https://lite.duckduckgo.com/lite/', {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'q=youtube'
  });
  const text = await res.text();
  console.log(text.substring(0, 500));
}
test();
