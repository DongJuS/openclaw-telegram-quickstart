/**
 * Output formatters: convert parsed conversations to Markdown or JSON.
 */

export function toMarkdown(conversation) {
  const lines = [];

  lines.push(`# ${conversation.title}`);
  lines.push("");
  if (conversation.createdAt) {
    lines.push(
      `> Created: ${conversation.createdAt.slice(0, 10)} | Messages: ${conversation.messages.length}`
    );
    lines.push("");
  }

  for (const msg of conversation.messages) {
    const label = msg.role === "user" ? "**User**" : "**Assistant**";
    const model = msg.model ? ` _(${msg.model})_` : "";

    lines.push(`### ${label}${model}`);
    lines.push("");
    lines.push(msg.text);
    lines.push("");
  }

  return lines.join("\n");
}

export function toJSON(conversation) {
  return JSON.stringify(conversation, null, 2);
}

export function toIndex(conversations) {
  return conversations.map((c) => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    messageCount: c.messages.length,
  }));
}
