const axios = require('axios');
async function findPiped() {
  try {
    const res = await axios.get('https://raw.githubusercontent.com/TeamPiped/Piped-Instances/main/instances.json');
    const instances = res.data.filter(i => i.api);
    console.log(`Found ${instances.length} Piped API instances.`);
    for (const inst of instances) {
      try {
        const url = `${inst.api_url}/streams/UQ3sp9aAmjs`;
        const testRes = await axios.get(url, { timeout: 3000 });
        if (testRes.data && testRes.data.audioStreams && testRes.data.audioStreams.length > 0) {
           console.log("SUCCESS:", inst.api_url);
           return;
        }
      } catch(e) { }
    }
    console.log("No working piped instances.");
  } catch(e) {
    console.error(e.message);
  }
}
findPiped();
