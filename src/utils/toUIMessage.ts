import { MessageType } from "@/lib/db/schema";
import { CustomUIMessage } from "@/types";

export function toUIMessage(message: MessageType[]): CustomUIMessage[] {
    return message.map((msg) => ({
        id: msg.id,
        role: msg.role,
        parts: msg.parts,
        metadata: msg.metadata ?? undefined,
    }));
}
