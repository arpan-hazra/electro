const http = require('http');
const WebSocket = require('three'); // wait, let's see if ws module is in node_modules or use node standard

// Let's check if ws is in node_modules
try {
  const WebSocket = require('ws');
  console.log('ws is available');
} catch (e) {
  console.log('ws is not available');
}
