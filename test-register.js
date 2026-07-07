async function test() {
  try {
    const res = await fetch('https://ai-bos-eta.vercel.app/api/auth/sign-up/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://ai-bos-eta.vercel.app'
      },
      body: JSON.stringify({
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        name: 'Test User'
      })
    });
    
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error(err);
  }
}
test();
