import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const distDir = join(root, 'dist');
const assetDir = join(distDir, 'assets');

if (!existsSync(distDir) || !existsSync(assetDir)) {
  console.error('Bundle output not found. Run "npm run build" before checking budgets.');
  process.exit(1);
}

const files = [];

const collect = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) collect(fullPath);
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.css')) files.push(fullPath);
  }
};

collect(assetDir);

const totalBytes = files.reduce((sum, file) => {
  const content = readFileSync(file);
  return sum + content.length;
}, 0);

const jsBytes = files.filter((file) => file.endsWith('.js')).reduce((sum, file) => {
  const content = readFileSync(file);
  return sum + content.length;
}, 0);

const budget = {
  totalBytes,
  jsBytes,
};

console.log(JSON.stringify({
  budget,
  status: jsBytes <= 200 * 1024 && totalBytes <= 500 * 1024 ? 'pass' : 'fail',
}, null, 2));

if (jsBytes > 200 * 1024 || totalBytes > 500 * 1024) {
  process.exit(1);
}
