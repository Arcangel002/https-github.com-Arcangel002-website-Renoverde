#!/usr/bin/env node
/**
 * Setup Script for Renoverde Backend
 * This script helps initialize the backend environment
 */

import fs from 'fs-extra';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
};

const main = async () => {
  console.log(`
${colors.green}╔════════════════════════════════════════════╗${colors.reset}
${colors.green}║   🌱 RENOVERDE BACKEND SETUP              ║${colors.reset}
${colors.green}╚════════════════════════════════════════════╝${colors.reset}
  `);

  try {
    // Check if .env exists
    if (!fs.existsSync('.env')) {
      log.info('Creating .env file from .env.example...');
      fs.copySync('.env.example', '.env');
      log.success('.env file created');

      log.warn('\nPlease configure the following in .env:');
      log.warn('  - Database credentials');
      log.warn('  - JWT secrets');
      log.warn('  - Email service settings');
    } else {
      log.success('.env file already exists');
    }

    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads', { recursive: true });
      log.success('Created uploads directory');
    }

    // Offer to install dependencies
    const installDeps = await question('\nInstall npm dependencies? (y/n) ');
    if (installDeps.toLowerCase() === 'y') {
      log.info('Installing dependencies...');
      execSync('npm install', { stdio: 'inherit' });
      log.success('Dependencies installed');
    }

    console.log(`
${colors.green}╔════════════════════════════════════════════╗${colors.reset}
${colors.green}║   ✓ SETUP COMPLETE                        ║${colors.reset}
${colors.green}╚════════════════════════════════════════════╝${colors.reset}

${colors.yellow}Next steps:${colors.reset}

1. ${colors.blue}Configure .env file${colors.reset}
   - Set DATABASE credentials
   - Set JWT_SECRET and JWT_REFRESH_SECRET (generate random strings)
   - Set EMAIL credentials

2. ${colors.blue}Create PostgreSQL database${colors.reset}
   ${colors.yellow}psql -U postgres${colors.reset}
   ${colors.yellow}CREATE DATABASE renoverde_db;${colors.reset}

3. ${colors.blue}Start development server${colors.reset}
   ${colors.yellow}npm run dev${colors.reset}

4. ${colors.blue}Test the API${colors.reset}
   ${colors.yellow}curl http://localhost:5000/api/health${colors.reset}

${colors.green}API Endpoints are ready to use! 🎉${colors.reset}
    `);
  } catch (error) {
    log.error(error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
};

main();
