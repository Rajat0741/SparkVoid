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
        { type: "text", text: `⟦${AGENT_LABELS[agent]}⟧ ` },
        ...msg.parts,
      ],
    };
  });
}

export const agentAwarenessNote = [
  "This conversation may include turns from two assistants: Spark and Void.",
  "Past assistant messages are prefixed with ⟦Spark⟧ or ⟦Void⟧ — this is injected by the system, not written by the assistant.",
  "IMPORTANT: You must NEVER begin your response with ⟦Spark⟧ or ⟦Void⟧ or any similar bracket prefix.",
  "Incorrect: '⟦Spark⟧ Here is your answer...'",
  "Correct: 'Here is your answer...'",
].join(" ");