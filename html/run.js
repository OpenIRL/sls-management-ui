#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// For Create React App, the build output is in the build/ directory
const buildDir = path.join(__dirname, 'build');

// Check if build directory exists
if (!fs.existsSync(buildDir)) {
    console.error('Build directory not found. Please run "npm run build" first.');
    process.exit(1);
}

// Find all HTML and JS files in the build directory
const findFiles = (dir, pattern) => {
    let results = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(filePath, pattern));
        } else if (pattern.test(file)) {
            results.push(filePath);
        }
    }
    
    return results;
};

const files = findFiles(buildDir, /\.(html|js)$/);

console.log('SRT Live Server Management UI - Runtime Configuration\n');
console.log('Configuration:');
console.log(`  APP_BASE_URL: ${process.env.APP_BASE_URL || 'http://localhost:8080'}`);
console.log(`  SRT_PLAYER_PORT: ${process.env.SRT_PLAYER_PORT || '4000'}`);
console.log(`  SRT_SENDER_PORT: ${process.env.SRT_SENDER_PORT || '4001'}`);
console.log(`  SLS_STATS_PORT: ${process.env.SLS_STATS_PORT || '8080'}`);
if (process.env.SRTLA_PORT) {
    console.log(`  SRTLA_PORT: ${process.env.SRTLA_PORT}`);
} else {
    console.log(`  SRTLA_PORT: (not configured)`);
}
console.log('');

// Replace placeholders in all files
files.forEach(filepath => {
    console.log(`Processing ${filepath}...`);
    const content = fs.readFileSync(filepath, 'utf8');

    let newContent = content.replace(/\{\{APP_BASE_URL\}\}/g, 
        process.env.APP_BASE_URL || 'http://localhost:8080');
    
    // Replace new port placeholders
    newContent = newContent.replace(/\{\{SRT_PLAYER_PORT\}\}/g, 
        process.env.SRT_PLAYER_PORT || '4000');
    newContent = newContent.replace(/\{\{SRT_SENDER_PORT\}\}/g, 
        process.env.SRT_SENDER_PORT || '4001');
    newContent = newContent.replace(/\{\{SLS_STATS_PORT\}\}/g, 
        process.env.SLS_STATS_PORT || '8080');
    newContent = newContent.replace(/\{\{SRTLA_PORT\}\}/g, 
        process.env.SRTLA_PORT || '');  // Empty string if not configured

    if (content !== newContent) {
        fs.writeFileSync(filepath, newContent);
        console.log(`  → Replaced placeholders in ${path.basename(filepath)}`);
    }
});

console.log('\nStarting HTTP server on port 3000...');
execSync(`http-server ${buildDir} --cors -p 3000`, { stdio: 'inherit' }); 