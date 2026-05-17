const fs = require('fs');
const path = require('path');

if (process.platform !== 'win32') {
  process.exit(0);
}

const source = path.join(
  process.cwd(),
  'node_modules',
  'lightningcss-win32-x64-msvc',
  'lightningcss.win32-x64-msvc.node',
);
const target = path.join(
  process.cwd(),
  'node_modules',
  'lightningcss',
  'lightningcss.win32-x64-msvc.node',
);

try {
  if (!fs.existsSync(source) || fs.existsSync(target)) {
    process.exit(0);
  }

  fs.copyFileSync(source, target);
} catch (error) {
  console.warn('[postinstall] lightningcss repair skipped:', error.message);
}
