const axios = require('axios');

const instances = [
  'https://pipedapi.kavin.rocks',
  'https://piped-api.garudalinux.org',
  'https://pipedapi.tokhmi.xyz'
];

async function test() {
  for (const instance of instances) {
    try {
      console.log(`Testing ${instance}...`);
      const res = await axios.get(`${instance}/streams/2LnCL41fnrk`, { timeout: 8000 });
      const formats = res.data.audioStreams;
      if (formats && formats.length > 0) {
        const audio = formats.find(f => f.mimeType.startsWith('audio/mp4') || f.mimeType.startsWith('audio/m4a'));
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
