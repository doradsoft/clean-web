#!/usr/bin/env node

import { promises as fs } from 'fs'
import { join } from 'path'

async function validateExtension() {
    const distDir = 'dist'
    const requiredFiles = [
        'manifest.json',
        'background.js',
        'content.js', 
        'popup.html',
        'popup.js'
    ]
    
    console.log('🔍 Validating Chrome extension build...')
    
    // Check if dist directory exists
    try {
        await fs.access(distDir)
    } catch (err) {
        console.error('❌ dist directory not found. Run "npm run build" first.')
        process.exit(1)
    }
    
    // Check required files
    for (const file of requiredFiles) {
        try {
            await fs.access(join(distDir, file))
            console.log(`✅ ${file}`)
        } catch (err) {
            console.error(`❌ Missing required file: ${file}`)
            process.exit(1)
        }
    }
    
    // Validate manifest.json
    try {
        const manifestContent = await fs.readFile(join(distDir, 'manifest.json'), 'utf-8')
        const manifest = JSON.parse(manifestContent)
        
        if (manifest.manifest_version !== 3) {
            console.error('❌ manifest.json should use manifest_version 3')
            process.exit(1)
        }
        
        if (!manifest.background?.service_worker) {
            console.error('❌ manifest.json missing background service worker')
            process.exit(1)
        }
        
        if (!manifest.content_scripts?.[0]?.js?.includes('content.js')) {
            console.error('❌ manifest.json missing content script reference')
            process.exit(1)
        }
        
        console.log('✅ manifest.json structure valid')
    } catch (err) {
        console.error('❌ Invalid manifest.json:', err.message)
        process.exit(1)
    }
    
    // Check IIFE wrapping for background.js and popup.js
    const iifeFiles = ['background.js', 'popup.js']
    for (const file of iifeFiles) {
        const content = await fs.readFile(join(distDir, file), 'utf-8')
        if (!content.startsWith('(function() {') || !content.endsWith('})();')) {
            console.error(`❌ ${file} not properly wrapped in IIFE`)
            process.exit(1)
        }
        console.log(`✅ ${file} properly wrapped in IIFE`)
    }
    
    // Check content.js has IIFE structure
    const contentJs = await fs.readFile(join(distDir, 'content.js'), 'utf-8')
    if (!contentJs.includes('(function() {')) {
        console.error('❌ content.js missing IIFE structure')
        process.exit(1)
    }
    console.log('✅ content.js has IIFE structure')
    
    console.log('\n🎉 Chrome extension validation passed!')
    console.log('📦 Extension is ready to load in Chrome developer mode')
    console.log('💡 Load the "dist" directory in chrome://extensions/')
}

validateExtension().catch(console.error)