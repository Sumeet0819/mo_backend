const { spawn } = require('child_process');
const path = require('path');
const binaryName = 'yt-dlp';
const ytDlpPath = path.resolve(process.cwd(), binaryName);
const args = ['ytsearch20:eminem', '-j', '--no-warnings'];
console.log('Running:', ytDlpPath, args.join(' '));
const process1 = spawn(ytDlpPath, args);
let stdout = '';
let stderr = '';
process1.stdout.on('data', data => stdout += data.toString());
process1.stderr.on('data', data => stderr += data.toString());
process1.on('close', code => {
  console.log('Code:', code);
  console.log('Stderr:', stderr);
  console.log('Stdout length:', stdout.length);
  try {
      const lines = stdout.split('\n').filter(line => line.trim().length > 0);
      const results = lines.map(line => {
        const data = JSON.parse(line);
        return data.id;
      });
      console.log('Results parsed:', results.length);
  } catch (e) {
      console.log('Parse error:', e);
  }
});
