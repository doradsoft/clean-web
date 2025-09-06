#!/usr/bin/env node

import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const srcDir = join(__dirname, 'src')
const distDir = join(__dirname, 'dist')

async function build() {
    console.log('Building Chrome extension...')
    
    // Clean dist directory
    try {
        await fs.rm(distDir, { recursive: true, force: true })
    } catch (err) {
        // Ignore if directory doesn't exist
    }
    
    await fs.mkdir(distDir, { recursive: true })
    
    // Copy manifest.json and popup.html as-is
    await fs.copyFile(join(srcDir, 'manifest.json'), join(distDir, 'manifest.json'))
    await fs.copyFile(join(srcDir, 'popup.html'), join(distDir, 'popup.html'))
    
    // Process background.js (wrap in IIFE)
    const backgroundContent = await fs.readFile(join(srcDir, 'background.js'), 'utf-8')
    const backgroundIIFE = `(function() {\n'use strict';\n${backgroundContent}\n})();`
    await fs.writeFile(join(distDir, 'background.js'), backgroundIIFE)
    
    // Process popup.js (wrap in IIFE)
    const popupContent = await fs.readFile(join(srcDir, 'popup.js'), 'utf-8')
    const popupIIFE = `(function() {\n'use strict';\n${popupContent}\n})();`
    await fs.writeFile(join(distDir, 'popup.js'), popupIIFE)
    
    // Copy content.js as-is (already wrapped in IIFE)
    await fs.copyFile(join(srcDir, 'content.js'), join(distDir, 'content.js'))
    
    console.log('Chrome extension built successfully!')
    console.log('Files generated:')
    const files = await fs.readdir(distDir)
    files.forEach(file => console.log(`  - ${file}`))
}

build().catch(console.error)