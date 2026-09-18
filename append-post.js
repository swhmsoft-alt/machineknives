// append-post.js — append content to a Markdown file using Node so that
// unicode characters (em-dash, en-dash, arrow) survive the file write.
// Used because the PowerShell Add-Content -Value pipeline strips / mangles
// non-ASCII characters in the heredoc.

const fs = require('fs');
const path = process.argv[2];
const content = process.argv[3];

if (!path || !content) {
  console.error('Usage: node append-post.js <file> <content>');
  process.exit(1);
}

fs.appendFileSync(path, content, 'utf8');
console.log(`Appended ${Buffer.byteLength(content, 'utf8')} bytes to ${path}`);
