const { spawn } = require('child_process');
const http = require('http');

async function test() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    'http://localhost:5173/'
  ]);

  await new Promise(r => setTimeout(r, 3000));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('TABS:', data);
      proc.kill();
    });
  }).on('error', (err) => {
    console.error('CDP err:', err.message);
    proc.kill();
  });
}

test();
