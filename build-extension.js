#!/usr/bin/env node

import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDir = resolve(__dirname, 'src/extension');
const outDir = resolve(__dirname, 'dist/extension');

async function buildExtension() {
  console.log('🏗️  Building Clean Web Extension...');
  
  try {
    // 1. Clean the output directory
    console.log('🧹 Cleaning output directory...');
    try {
      await fs.rm(outDir, { recursive: true, force: true });
    } catch (error) {
      // Directory might not exist, that's ok
    }
    await fs.mkdir(outDir, { recursive: true });

    // 2. Build TypeScript files with Vite
    console.log('📦 Building TypeScript files...');
    execSync('vite build --config vite.extension.config.ts', { stdio: 'inherit' });

    // 3. Copy static files
    console.log('📄 Copying static files...');
    const staticFiles = [
      'manifest.json',
      'popup.html'
    ];

    for (const file of staticFiles) {
      const srcPath = resolve(srcDir, file);
      const destPath = resolve(outDir, file);
      
      try {
        await fs.copyFile(srcPath, destPath);
        console.log(`   ✅ Copied ${file}`);
      } catch (error) {
        console.warn(`   ⚠️  Could not copy ${file}:`, error.message);
      }
    }

    // 4. Create basic icons (placeholder)
    console.log('🎨 Creating placeholder icons...');
    const iconSizes = [16, 32, 48, 128];
    for (const size of iconSizes) {
      const iconContent = createPlaceholderIcon(size);
      await fs.writeFile(resolve(outDir, `icon-${size}.png`), iconContent);
    }

    console.log('✅ Extension build completed successfully!');
    console.log(`📁 Extension files are in: ${outDir}`);
    console.log('\n📖 To load the extension in Chrome:');
    console.log('1. Open Chrome and go to chrome://extensions/');
    console.log('2. Enable "Developer mode" (toggle in top right)');
    console.log('3. Click "Load unpacked" and select the dist/extension folder');
    
  } catch (error) {
    console.error('❌ Extension build failed:', error.message);
    process.exit(1);
  }
}

function createPlaceholderIcon(size) {
  // Create a simple SVG icon as a placeholder
  // In a real project, you'd have actual PNG icons
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#2563eb" rx="4"/>
      <text x="50%" y="50%" text-anchor="middle" dy="0.3em" fill="white" font-family="Arial, sans-serif" font-size="${size * 0.4}" font-weight="bold">CW</text>
    </svg>
  `;
  
  // For simplicity, we'll just create an empty file
  // In a real implementation, you'd convert SVG to PNG or use actual PNG files
  return Buffer.from(''); // Placeholder
}

buildExtension();