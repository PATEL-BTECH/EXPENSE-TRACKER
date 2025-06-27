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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkNgrokConfig() {
  if (!fs.existsSync(NGROK_CONFIG_FILE)) {
    log('❌ ngrok.yml not found. Please run: node start-ngrok.js config', colors.red);
    return false;
  }

  const config = fs.readFileSync(NGROK_CONFIG_FILE, 'utf8');
  if (config.includes('YOUR_NGROK_AUTH_TOKEN_HERE')) {
    log('❌ Please update the authtoken in ngrok.yml with your actual ngrok auth token', colors.red);
    return false;
  }

  return true;
}

function startDevelopmentServer() {
  log('🚀 Starting Next.js development server...', colors.blue);
  
  const nextDev = spawn('npm', ['run', 'dev'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  nextDev.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Ready')) {
      log('✅ Development server is ready!', colors.green);
    }
    process.stdout.write(`${colors.blue}[Next.js]${colors.reset} ${output}`);
  });

  nextDev.stderr.on('data', (data) => {
    process.stderr.write(`${colors.blue}[Next.js]${colors.reset} ${data}`);
  });

  return nextDev;
}

function startNgrokTunnel() {
  log('🌐 Starting ngrok tunnel...', colors.magenta);
  
  const ngrok = spawn('ngrok', ['start', '--config', NGROK_CONFIG_FILE, 'expense-tracker'], {
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true
  });

  ngrok.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(`${colors.magenta}[ngrok]${colors.reset} ${output}`);
  });

  ngrok.stderr.on('data', (data) => {
    process.stderr.write(`${colors.magenta}[ngrok]${colors.reset} ${data}`);
  });

  return ngrok;
}

function main() {
  log('🎯 Budget Buddy - Development Server with ngrok', colors.bright);
  log('================================================', colors.cyan);

  // Check ngrok configuration
  if (!checkNgrokConfig()) {
    log('\n📋 Setup Instructions:', colors.yellow);
    log('1. Get your ngrok auth token from: https://dashboard.ngrok.com/get-started/your-authtoken');
    log('2. Edit ngrok.yml and replace YOUR_NGROK_AUTH_TOKEN_HERE with your token');
    log('3. Run this script again');
    process.exit(1);
  }

  // Start development server
  const nextProcess = startDevelopmentServer();

  // Wait a bit for the dev server to start, then start ngrok
  setTimeout(() => {
    const ngrokProcess = startNgrokTunnel();

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      log('\n🛑 Shutting down servers...', colors.yellow);
      
      if (ngrokProcess) {
        log('Stopping ngrok...', colors.yellow);
        ngrokProcess.kill();
      }
      
      if (nextProcess) {
        log('Stopping Next.js dev server...', colors.yellow);
        nextProcess.kill();
      }
      
      setTimeout(() => {
        log('✅ All servers stopped', colors.green);
        process.exit(0);
      }, 1000);
    });

    ngrokProcess.on('error', (error) => {
      log(`❌ Error starting ngrok: ${error.message}`, colors.red);
      log('💡 Make sure ngrok is installed: npm install -g ngrok', colors.yellow);
    });

  }, 3000); // Wait 3 seconds for Next.js to start

  nextProcess.on('error', (error) => {
    log(`❌ Error starting development server: ${error.message}`, colors.red);
  });

  // Show helpful information
  setTimeout(() => {
    log('\n📱 Access your application:', colors.cyan);
    log(`   Local:  http://localhost:${LOCAL_PORT}`, colors.green);
    log('   Public: Check ngrok output above for the public URL', colors.green);
    log('\n🔧 ngrok Web Interface: http://localhost:4040', colors.cyan);
    log('\n⚡ Press Ctrl+C to stop both servers', colors.yellow);
  }, 5000);
}

main();
