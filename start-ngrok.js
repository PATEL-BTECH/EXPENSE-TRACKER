#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const LOCAL_PORT = 3000;
const NGROK_CONFIG_FILE = 'ngrok.yml';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function createNgrokConfig() {
  const config = `version: "2"
authtoken: YOUR_NGROK_AUTH_TOKEN_HERE
tunnels:
  expense-tracker:
    addr: ${LOCAL_PORT}
    proto: http
    subdomain: expense-tracker-demo
    inspect: true
    bind_tls: true
`;

  fs.writeFileSync(NGROK_CONFIG_FILE, config);
  log(`✅ Created ${NGROK_CONFIG_FILE}`, colors.green);
  log(`⚠️  Please update the authtoken in ${NGROK_CONFIG_FILE} with your ngrok auth token`, colors.yellow);
}

function checkNgrokConfig() {
  if (!fs.existsSync(NGROK_CONFIG_FILE)) {
    log('❌ ngrok.yml not found. Creating default configuration...', colors.red);
    createNgrokConfig();
    return false;
  }

  const config = fs.readFileSync(NGROK_CONFIG_FILE, 'utf8');
  if (config.includes('YOUR_NGROK_AUTH_TOKEN_HERE')) {
    log('❌ Please update the authtoken in ngrok.yml with your actual ngrok auth token', colors.red);
    return false;
  }

  return true;
}

function startNgrok() {
  if (!checkNgrokConfig()) {
    process.exit(1);
  }

  log('🚀 Starting ngrok tunnel...', colors.blue);
  
  const ngrok = spawn('ngrok', ['start', '--config', NGROK_CONFIG_FILE, 'expense-tracker'], {
    stdio: 'inherit'
  });

  ngrok.on('error', (error) => {
    log(`❌ Error starting ngrok: ${error.message}`, colors.red);
    log('💡 Make sure ngrok is installed: npm install -g ngrok', colors.yellow);
  });

  ngrok.on('close', (code) => {
    log(`🛑 ngrok process exited with code ${code}`, colors.yellow);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    log('\n🛑 Shutting down ngrok...', colors.yellow);
    ngrok.kill();
    process.exit(0);
  });
}

function showHelp() {
  log('🔧 Budget Buddy - ngrok Tunnel Manager', colors.bright);
  log('');
  log('Usage:', colors.cyan);
  log('  node start-ngrok.js [command]', colors.cyan);
  log('');
  log('Commands:', colors.cyan);
  log('  start     Start the ngrok tunnel (default)');
  log('  config    Create/recreate ngrok configuration file');
  log('  help      Show this help message');
  log('');
  log('Setup Instructions:', colors.yellow);
  log('1. Sign up at https://ngrok.com/signup');
  log('2. Get your auth token from https://dashboard.ngrok.com/get-started/your-authtoken');
  log('3. Run: node start-ngrok.js config');
  log('4. Edit ngrok.yml and replace YOUR_NGROK_AUTH_TOKEN_HERE with your actual token');
  log('5. Run: node start-ngrok.js start');
}

// Parse command line arguments
const command = process.argv[2] || 'start';

switch (command) {
  case 'start':
    startNgrok();
    break;
  case 'config':
    createNgrokConfig();
    break;
  case 'help':
  case '--help':
  case '-h':
    showHelp();
    break;
  default:
    log(`❌ Unknown command: ${command}`, colors.red);
    showHelp();
    process.exit(1);
}
