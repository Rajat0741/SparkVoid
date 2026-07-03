import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react
import { oneTapClient, adminClient,  } from "better-auth/client/plugins";
import { sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,

      autoSelect: false,
      cancelOnTapOutside: false,
      context: "signin",

      promptOptions: {
        baseDelay: 1000,
        maxAttempts: 3,
      },
    }),
    sentinelClient({
      identifyUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_IDENTIFY_URL,
    }),
    adminClient(),
  ],
});
