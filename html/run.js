#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// For Create React App, the build output is in the build/ directory
const buildDir = '/app';

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
console.log(`  APP_BASE_URL: ${process.env.REACT_APP_BASE_URL || 'http://localhost:8080'}`);
console.log(`  SRT_PLAYER_PORT: ${process.env.REACT_APP_SRT_PLAYER_PORT || '4000'}`);
console.log(`  SRT_SENDER_PORT: ${process.env.REACT_APP_SRT_SENDER_PORT || '4001'}`);
console.log(`  SLS_STATS_PORT: ${process.env.REACT_APP_SLS_STATS_PORT || '8080'}`);
if (process.env.REACT_APP_SRTLA_PORT) {
    console.log(`  SRTLA_PORT: ${process.env.REACT_APP_SRTLA_PORT}`);
} else {
    console.log(`  SRTLA_PORT: (not configured)`);
}

// Replace placeholders in all files
files.forEach(filepath => {
    console.log(`Processing ${filepath}...`);
    const content = fs.readFileSync(filepath, 'utf8');

    let newContent = content
        .toString()
        .replaceAll('{{BASE_URL}}', process.env.REACT_APP_BASE_URL)
        // Replace new port placeholders
        .replaceAll('{{SRT_PLAYER_PORT}}', process.env.REACT_APP_SRT_PLAYER_PORT)
        .replaceAll('{{SRT_SENDER_PORT}}', process.env.REACT_APP_SRT_SENDER_PORT)
        .replaceAll('{{SLS_STATS_PORT}}', process.env.REACT_APP_SLS_STATS_PORT)
        .replaceAll('{{SRTLA_PORT}}', process.env.REACT_APP_SRTLA_PORT);

    fs.writeFileSync(filepath, newContent);
});

console.log('\nStarting HTTP server on port 3000...');
execSync(`http-server /app --cors -p 3000`, { stdio: 'inherit' });