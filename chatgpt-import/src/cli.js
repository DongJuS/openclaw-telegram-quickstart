#!/usr/bin/env node

/**
 * CLI: chatgpt-import
 *
 * Usage:
 *   node src/cli.js <conversations.json> [--output <dir>] [--format md|json] [--filter <keyword>]
 */

import { parseArgs } from "node:util";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { loadConversations } from "./parser.js";
import { toMarkdown, toJSON, toIndex } from "./formatter.js";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    output: { type: "string", short: "o", default: "./output" },
    format: { type: "string", short: "f", default: "md" },
    filter: { type: "string", short: "k" },
    help: { type: "boolean", short: "h", default: false },
  },
});

if (values.help || positionals.length === 0) {
  console.log(`
chatgpt-import — ChatGPT conversations.json → OpenClaw-readable format

Usage:
  node src/cli.js <conversations.json> [options]

Options:
  -o, --output <dir>     Output directory (default: ./output)
  -f, --format md|json   Output format (default: md)
  -k, --filter <keyword> Only export conversations matching keyword
  -h, --help             Show this help
  `);
  process.exit(0);
}

const inputFile = positionals[0];
const outputDir = values.output;
const format = values.format;
const filter = values.filter?.toLowerCase();

console.log(`Parsing ${inputFile}...`);

let conversations = await loadConversations(inputFile);
console.log(`Found ${conversations.length} conversations`);

if (filter) {
  conversations = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(filter) ||
      c.messages.some((m) => m.text.toLowerCase().includes(filter))
  );
  console.log(`Filtered to ${conversations.length} conversations matching "${values.filter}"`);
}

conversations = conversations.filter((c) => c.messages.length > 0);

await mkdir(outputDir, { recursive: true });

const ext = format === "json" ? ".json" : ".md";
const formatter = format === "json" ? toJSON : toMarkdown;

let count = 0;
for (const conv of conversations) {
  const slug = sanitizeFilename(conv.title);
  const filename = `${slug}${ext}`;
  const content = formatter(conv);
  await writeFile(join(outputDir, filename), content, "utf-8");
  count++;
}

const index = toIndex(conversations);
await writeFile(
  join(outputDir, "_index.json"),
  JSON.stringify(index, null, 2),
  "utf-8"
);

console.log(`Exported ${count} conversations to ${outputDir}/`);
console.log(`Index: ${outputDir}/_index.json`);

function sanitizeFilename(title) {
  return title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 80);
}
