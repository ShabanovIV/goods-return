import { readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const MAX_LINES = 125;
const SOURCE_DIRECTORY = resolve('src');
const CHECKED_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.scss', '.ts', '.tsx']);
const DISABLE_MARKERS = ['eslint-disable max-lines', 'file-length-warning-disable'];

const collectFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(entryPath) : [entryPath];
  });

const countLines = (content) => {
  const lines = content.replaceAll('\r\n', '\n').split('\n');
  return content.endsWith('\n') ? lines.length - 1 : lines.length;
};

const oversizedFiles = collectFiles(SOURCE_DIRECTORY)
  .filter((filePath) => CHECKED_EXTENSIONS.has(extname(filePath)))
  .flatMap((filePath) => {
    const content = readFileSync(filePath, 'utf8');
    const lines = countLines(content);
    const disabled = DISABLE_MARKERS.some((marker) => content.includes(marker));
    return lines > MAX_LINES && !disabled ? [{ filePath, lines }] : [];
  });

oversizedFiles.forEach(({ filePath, lines }) => {
  console.warn(
    `Warning: ${relative(process.cwd(), filePath)} contains ${lines} lines (maximum ${MAX_LINES}).`,
  );
});
