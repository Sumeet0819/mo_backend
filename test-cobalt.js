const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://api.cobalt.tools/api/json', {
      url: 'https://www.youtube.com/watch?v=2LnCL41fnrk',
      isAudioOnly: true,
      aFormat: "mp3"
    }, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log("Cobalt URL:", res.data.url);
  } catch(e) {
    console.error(e.message, e.response?.data);
  }
}

test();
