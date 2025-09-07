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

  // Check for background script (optional for our extension)
  try {
    const bgPath = resolve(extensionDir, 'background.js');
    await fs.stat(bgPath);
    console.log(`✅ background.js exists`);
  } catch (error) {
    console.log(`ℹ️  background.js not found (optional for this extension)`);
  }

  // Validate manifest.json structure
  try {
    const manifestPath = resolve(extensionDir, 'manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);
    
    // Check required manifest fields for our extension
    const requiredFields = ['manifest_version', 'name', 'version', 'content_scripts', 'action'];
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

    // Validate content scripts
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      const contentScript = manifest.content_scripts[0];
      if (contentScript.js && contentScript.js.includes('content.js')) {
        console.log('✅ Content script configuration looks good');
      } else {
        console.warn('⚠️  Content script may not be properly configured');
        hasErrors = true;
      }
    }

    // Validate action (popup)
    if (manifest.action && manifest.action.default_popup) {
      console.log('✅ Extension popup configured');
    } else {
      console.warn('⚠️  Extension popup not configured');
    }

  } catch (error) {
    console.error('❌ Failed to validate manifest.json:', error.message);
    hasErrors = true;
  }

  // Check CSS file
  try {
    const cssPath = resolve(extensionDir, 'content.css');
    const stats = await fs.stat(cssPath);
    console.log(`✅ content.css exists (${Math.round(stats.size / 1024)}KB)`);
  } catch (error) {
    console.warn('⚠️  content.css not found - styling may not work');
  }

  // Check icons
  const iconSizes = [16, 48, 128];
  for (const size of iconSizes) {
    try {
      const iconPath = resolve(extensionDir, 'icons', `icon${size}.png`);
      await fs.stat(iconPath);
      console.log(`✅ icon${size}.png exists`);
    } catch (error) {
      console.warn(`⚠️  icon${size}.png not found`);
    }
  }

  if (!hasErrors) {
    console.log('\n🎉 Extension validation passed! Ready to load in Chrome.');
    console.log('\n📖 To load the extension:');
    console.log('1. Open Chrome and go to chrome://extensions/');
    console.log('2. Enable "Developer mode" (toggle in top right)');
    console.log('3. Click "Load unpacked" and select the dist/extension folder');
    return true;
  } else {
    console.log('\n❌ Extension validation failed. Please fix the errors above.');
    return false;
  }
}

validateExtension().catch(console.error);