#!/usr/bin/env node

import { promises as fs } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extensionDir = resolve(__dirname, 'dist/extension');

async function validateExtension() {
  console.log('🔍 Validating Clean Web Extension...');
  
  let hasErrors = false;

  try {
    // Check if extension directory exists
    await fs.access(extensionDir);
    console.log('✅ Extension directory exists');
  } catch (error) {
    console.error('❌ Extension directory not found. Run `npm run build:extension` first.');
    return false;
  }

  // Required files for Chrome extension
  const requiredFiles = [
    'manifest.json',
    'content.js',
    'background.js',
    'popup.js',
    'popup.html'
  ];

  // Check required files
  for (const file of requiredFiles) {
    try {
      const filePath = resolve(extensionDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.size === 0) {
        console.warn(`⚠️  ${file} is empty`);
        hasErrors = true;
      } else {
        console.log(`✅ ${file} exists (${Math.round(stats.size / 1024)}KB)`);
      }
    } catch (error) {
      console.error(`❌ ${file} is missing`);
      hasErrors = true;
    }
  }

  // Validate manifest.json structure
  try {
    const manifestPath = resolve(extensionDir, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Check required manifest fields
    const requiredFields = ['manifest_version', 'name', 'version', 'background', 'content_scripts', 'action'];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        console.error(`❌ Manifest missing required field: ${field}`);
        hasErrors = true;
      }
    }
    
    // Check manifest version
    if (manifest.manifest_version !== 3) {
      console.error('❌ Manifest version should be 3');
      hasErrors = true;
    } else {
      console.log('✅ Manifest V3 structure validated');
    }
  } catch (error) {
    console.error('❌ Failed to validate manifest.json:', error.message);
    hasErrors = true;
  }

  // Check JavaScript files for basic syntax
  const jsFiles = ['content.js', 'background.js', 'popup.js'];
  for (const jsFile of jsFiles) {
    try {
      const filePath = resolve(extensionDir, jsFile);
      const content = await fs.readFile(filePath, 'utf8');
      
      // Basic check for common issues
      if (content.includes('import ') && content.includes('from ')) {
        console.warn(`⚠️  ${jsFile} contains ES6 imports - may not work in extension context`);
      }
      
      if (!content.includes('chrome.')) {
        if (jsFile !== 'popup.js') { // Popup might not directly use Chrome APIs
          console.warn(`⚠️  ${jsFile} doesn't appear to use Chrome APIs`);
        }
      }
      
      console.log(`✅ ${jsFile} basic syntax check passed`);
    } catch (error) {
      console.error(`❌ Failed to validate ${jsFile}:`, error.message);
      hasErrors = true;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (!hasErrors) {
    console.log('✅ Extension validation passed!');
    console.log('\n📖 To load the extension in Chrome:');
    console.log('1. Open Chrome and go to chrome://extensions/');
    console.log('2. Enable "Developer mode" (toggle in top right)');
    console.log('3. Click "Load unpacked" and select the dist/extension folder');
    console.log('4. The extension should appear in your extensions list');
    console.log(`\n📁 Extension location: ${extensionDir}`);
    return true;
  } else {
    console.log('❌ Extension validation failed. Please fix the errors above.');
    return false;
  }
}

validateExtension().then(success => {
  process.exit(success ? 0 : 1);
});