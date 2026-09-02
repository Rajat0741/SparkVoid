import type { FileUIPart } from "ai";
import type { CustomUIMessage } from "@/types";

/**
 * Downloads external file URLs and replaces them with base64 data URIs
 * so model providers receive inline data instead of unsupported external URIs.
 */
export async function inlineFileUrlParts(
  messages: CustomUIMessage[],
): Promise<CustomUIMessage[]> {
  return Promise.all(
    messages.map(async (msg) => {
      const hasRemoteFile = msg.parts.some(
        (part) =>
          part.type === "file" &&
          !(part as FileUIPart).url.startsWith("data:"),
      );
      if (!hasRemoteFile) return msg;

      const parts = await Promise.all(
        msg.parts.map(async (part) => {
          if (part.type !== "file") return part;
          const filePart = part as FileUIPart;
          if (filePart.url.startsWith("data:")) return part;

          try {
            const response = await fetch(filePart.url);
            if (!response.ok) {
              console.error(
                `[inlineFileUrlParts] Failed to fetch ${filePart.url}: status ${response.status}`,
              );
              return part;
            }

            const buffer = await response.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            const mediaType =
              filePart.mediaType || response.headers.get("content-type");

            if (!mediaType) {
              console.error(
                `[inlineFileUrlParts] Could not determine media type for ${filePart.url}. Skipping inlining.`,
              );
              return part;
            }

            return {
              ...filePart,
              mediaType,
              url: `data:${mediaType};base64,${base64}`,
            } satisfies FileUIPart;
          } catch (err) {
            console.error(
              `[inlineFileUrlParts] Failed to fetch ${filePart.url}:`,
              err,
            );
            return part;
          }
        }),
      );

      return { ...msg, parts };
    }),
  );
}
