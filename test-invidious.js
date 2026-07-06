const axios = require('axios');

const instances = [
  'https://invidious.nerdvpn.de',
  'https://invidious.asir.dev',
  'https://inv.tux.pizza',
  'https://invidious.privacydev.net'
];

async function test() {
  for (const instance of instances) {
    try {
      console.log(`Testing ${instance}...`);
      const res = await axios.get(`${instance}/api/v1/videos/2LnCL41fnrk`, { timeout: 5000 });
      const formats = res.data.formatStreams;
      if (formats) {
        const audio = formats.find(f => f.type.startsWith('audio/'));
        if (audio) {
          console.log(`SUCCESS on ${instance}:`, audio.url.substring(0, 50) + '...');
          return;
        }
      }
    } catch(e) {
      console.error(`FAILED on ${instance}:`, e.message);
    }
  }
}

test();
