const axios = require('axios');

async function test() {
  const res = await axios.post('https://www.youtube.com/youtubei/v1/player', {
    context: {
      client: {
        hl: "en",
        gl: "US",
        clientName: "ANDROID",
        clientVersion: "19.29.37",
        androidSdkVersion: 31,
      }
    },
    videoId: "2LnCL41fnrk",
    playbackContext: {
      contentPlaybackContext: {
        signatureTimestamp: 19900
      }
    }
  }, {
    headers: {
      'User-Agent': 'com.google.android.youtube/19.29.37 (Linux; U; Android 12; en_US)'
    }
  });

  const streamingData = res.data.streamingData;
  console.log(JSON.stringify(streamingData ? streamingData.formats.map(f => ({itag: f.itag, url: !!f.url, cipher: !!f.signatureCipher})) : "No streaming data", null, 2));
}

test();
