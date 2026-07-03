import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { admin, oneTap } from "better-auth/plugins";
import { user, account, session, verification } from "./db/schema";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  appName: "SparkVoid",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, account, session, verification },
  }),
  socialProviders: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    oneTap(),
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
    admin(),
  ],
});
