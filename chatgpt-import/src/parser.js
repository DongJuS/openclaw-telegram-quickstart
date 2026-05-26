/**
 * ChatGPT conversations.json parser.
 *
 * The official ChatGPT data export (Settings → Data Controls → Export)
 * produces a ZIP containing conversations.json — an array of conversation
 * objects with a tree-based `mapping` structure.
 *
 * This module linearizes the tree into ordered message arrays.
 */

import { readFile } from "node:fs/promises";

export async function loadConversations(filePath) {
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error(
      "Expected conversations.json to be an array of conversations"
    );
  }

  return data.map(parseConversation);
}

function parseConversation(conv) {
  const { title, create_time, update_time, mapping, current_node, id } = conv;

  const messages = linearize(mapping, current_node);

  return {
    id: id ?? null,
    title: title ?? "Untitled",
    createdAt: create_time ? new Date(create_time * 1000).toISOString() : null,
    updatedAt: update_time ? new Date(update_time * 1000).toISOString() : null,
    messages,
  };
}

function linearize(mapping, currentNode) {
  if (!mapping || !currentNode) return [];

  const chain = [];
  let nodeId = currentNode;

  while (nodeId) {
    const node = mapping[nodeId];
    if (!node) break;

    if (node.message) {
      const msg = node.message;
      const role = msg.author?.role ?? "unknown";
      const parts = msg.content?.parts ?? [];
      const text = parts
        .filter((p) => typeof p === "string")
        .join("\n")
        .trim();

      if (text && role !== "system") {
        chain.push({
          role,
          text,
          model: msg.metadata?.model_slug ?? null,
          createdAt: msg.create_time
            ? new Date(msg.create_time * 1000).toISOString()
            : null,
        });
      }
    }

    nodeId = node.parent;
  }

  return chain.reverse();
}
