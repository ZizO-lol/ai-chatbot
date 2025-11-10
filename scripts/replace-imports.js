#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

// Define replacements
const replacements = [
  // next/link -> @/components/Link
  {
    from: /from ['"]next\/link['"]/g,
    to: "from '@/components/Link'",
  },
  // next/image -> @/components/Image
  {
    from: /from ['"]next\/image['"]/g,
    to: "from '@/components/Image'",
  },
  // next/navigation -> @/lib/navigation
  {
    from: /from ['"]next\/navigation['"]/g,
    to: "from '@/lib/navigation'",
  },
  // next-auth -> @/lib/auth
  {
    from: /from ['"]next-auth['"]/g,
    to: "from '@/lib/auth'",
  },
  // next-auth/react -> @/lib/auth
  {
    from: /from ['"]next-auth\/react['"]/g,
    to: "from '@/lib/auth'",
  },
  // Remove "use client" directives
  {
    from: /['"]use client['"];?\n*/g,
    to: '',
  },
  // Remove "use server" directives
  {
    from: /['"]use server['"];?\n*/g,
    to: '',
  },
];

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Updated: ${path.relative(srcDir, filePath)}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath);
    } else {
      processFile(filePath);
    }
  });
}

console.log('Starting import replacements...\n');
walkDir(srcDir);
console.log('\nDone!');
