const axios = require('axios');
async function test() {
  const res = await axios.get('https://api.invidious.io/instances.json');
  const active = res.data.map(i => i[1]).filter(i => i.type === 'https' && i.cors);
  console.log(active.map(i => i.uri).slice(0, 10));
}
test();
