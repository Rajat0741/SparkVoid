import type { CustomUIMessage } from "@/types";

const AGENT_LABELS = { spark: "Spark", void: "Void" } as const;

export function tagAgentMessages(messages: CustomUIMessage[]): CustomUIMessage[] {
  return messages.map((msg) => {
    if (msg.role !== "assistant") return msg;

    const agent = msg.metadata?.model;
    if (!agent) return msg;

    return {
      ...msg,
      parts: [
        { type: "text", text: `[${AGENT_LABELS[agent]}] ` },
        ...msg.parts,
      ],
    };
  });
}

export const agentAwarenessNote = [
  "This conversation may include turns from two assistants: Spark (fast, conversational) and Void (deep research).",
  "Past assistant messages are prefixed with [Spark] or [Void] to show who responded —",
  "this is system-added context, not something either assistant wrote.",
  "Never ever include this prefix in your own output.",
].join(" ");
