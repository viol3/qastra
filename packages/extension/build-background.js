const fs = require('fs');
const path = require('path');

// Read the background source
const bgSource = fs.readFileSync(path.join(__dirname, 'src', 'background.ts'), 'utf8');

// Convert TypeScript to JavaScript - remove type annotations and keep proper syntax
const jsCode = bgSource
  .replace(/import .+ from .+;?\n/g, '') // Remove imports
  .replace(/export \{\};?\n?/g, '') // Remove export statements
  .replace(/: any/g, '')
  .replace(/: string/g, '')
  .replace(/: boolean/g, '')
  .replace(/: number/g, '')
  .replace(/_sender,/g, 'sender,'); // Restore sender parameter

// Ensure dist directory exists
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Write to dist
fs.writeFileSync(path.join(distDir, 'background.js'), jsCode);

console.log('✓ background.js built successfully');
