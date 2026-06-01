async function test() {
  const res = await fetch('https://search.yahoo.com/search?p=youtube', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    }
  });
  const text = await res.text();
  if (text.includes('captcha') || text.includes('challenge')) {
    console.log('BLOCKED');
  } else {
    console.log('SUCCESS, length:', text.length);
  }
}
test();
