/**
 * This script helps troubleshoot and fix common dependency issues
 * Run with: node scripts/fix-dependencies.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for dependency issues...');

// Helper to run commands and handle errors
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to run command: ${command}`);
    return false;
  }
}

// Clear Metro and React Native caches
console.log('🧹 Cleaning caches...');
runCommand('npx react-native start --reset-cache');

// Check for and install specific dependencies
console.log('📦 Ensuring dependencies are installed properly...');
const dependencies = [
  'expo-image-picker',
  'expo-image-manipulator',
  'expo-clipboard'
];

for (const dep of dependencies) {
  console.log(`Checking ${dep}...`);
  runCommand(`npx expo install ${dep}`);
}

// Rebuild pods for iOS if on macOS
if (process.platform === 'darwin') {
  console.log('🍎 Rebuilding iOS pods...');
  if (fs.existsSync(path.join(process.cwd(), 'ios'))) {
    runCommand('cd ios && pod install && cd ..');
  }
}

console.log('✅ Dependencies check completed');
console.log('🚀 Try running your app again with: npx expo start --clear');
