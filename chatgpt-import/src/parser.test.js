import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadConversations } from "./parser.js";
import { toMarkdown, toIndex } from "./formatter.js";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const samplePath = join(__dirname, "..", "test-data", "sample-conversations.json");

describe("parser", () => {
  it("loads and linearizes conversations", async () => {
    const convs = await loadConversations(samplePath);
    assert.equal(convs.length, 2);

    const first = convs[0];
    assert.equal(first.title, "Docker 컨테이너 네트워킹 질문");
    assert.equal(first.messages.length, 3);
    assert.equal(first.messages[0].role, "user");
    assert.equal(first.messages[1].role, "assistant");
    assert.equal(first.messages[1].model, "gpt-4o");
    assert.equal(first.messages[2].role, "user");
  });

  it("skips system messages", async () => {
    const convs = await loadConversations(samplePath);
    const roles = convs[0].messages.map((m) => m.role);
    assert.ok(!roles.includes("system"));
  });
});

describe("formatter", () => {
  it("produces markdown with title and messages", async () => {
    const convs = await loadConversations(samplePath);
    const md = toMarkdown(convs[0]);
    assert.ok(md.startsWith("# Docker"));
    assert.ok(md.includes("**User**"));
    assert.ok(md.includes("**Assistant**"));
    assert.ok(md.includes("_(gpt-4o)_"));
  });

  it("produces an index", async () => {
    const convs = await loadConversations(samplePath);
    const index = toIndex(convs);
    assert.equal(index.length, 2);
    assert.equal(index[0].messageCount, 3);
    assert.equal(index[1].messageCount, 2);
  });
});
