import { createConversation } from "@/features/chat/services/create-conversation";
import { createMessage } from "@/features/chat/services/create-message";
import { getConversationHistory } from "@/features/chat/services/get-messages";
import { MessageType, NewConversationType } from "@/lib/db/schema";
import { CustomUIMessage, MetadataType } from "@/types";
import { getUserSession } from "@/utils/getUser";
import { toUIMessage } from "@/utils/toUIMessage";
import {
  createGoogleGenerativeAI,
  GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { convertToModelMessages, generateId, streamText } from "ai";


const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(request: Request) {
  try {

    const { conversationId, message } = await request.json() as { conversationId: string; message: CustomUIMessage };

    const userSession = await getUserSession(request.headers);

    if (!userSession) {
      throw new Error("Unauthorized");
    }

    const newConversationData: NewConversationType = { id: conversationId, title: "title", userId: userSession?.user.id };
    
    await createConversation(newConversationData);

    const conversationHistory: MessageType[] = await getConversationHistory( conversationId );
    
    const messages: CustomUIMessage[] = toUIMessage(conversationHistory);

    messages.push(message)

    const createdMessage = await createMessage({message, conversationId})

    const model = google("gemini-3.1-flash-lite");

    const result = streamText({
      model: model,
      system:
        "You are a helpful assistant. Think about what user wants and provide a concise answer. If you don't know the answer, say you don't know.",
      messages: await convertToModelMessages(messages),
      providerOptions: {
        google: {
          thinkingConfig: {
            includeThoughts: true,
            thinkingLevel: "high",
          },
        } satisfies GoogleGenerativeAIProviderOptions,
      },
    });

    return result.toUIMessageStreamResponse({
      generateMessageId: generateId,
      messageMetadata: ({ part }) => {
        if (part.type === "finish" ){
          const meta: MetadataType = {
            tokens: part.totalUsage.totalTokens ?? 0,
          }
          return meta
        }
      },
      onFinish: async (aiMessage) => {
        const assistantMessage = aiMessage.messages.at(-1) as CustomUIMessage;
        await createMessage({ message: assistantMessage, conversationId })
      },
    });
  } catch (error) {
    console.log("error: ", error);
    return new Response(JSON.stringify({ error: `${error}` }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
