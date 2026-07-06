const axios = require('axios');

async function findInstance() {
  try {
    const res = await axios.get('https://api.invidious.io/instances.json');
    // filter for https and API available
    const instances = res.data.map(i => i[1]).filter(i => i.type === 'https' && i.api === true);
    
    console.log(`Found ${instances.length} API instances.`);
    
    for (const inst of instances) {
      try {
        const url = `${inst.uri}/api/v1/videos/UQ3sp9aAmjs`;
        const testRes = await axios.get(url, { timeout: 3000 });
        if (testRes.data && testRes.data.formatStreams) {
           console.log("SUCCESS:", inst.uri);
           return;
        }
      } catch(e) {
        // ignore
      }
    }
    console.log("No working instances found.");
  } catch(e) {
    console.error(e.message);
  }
}

findInstance();
