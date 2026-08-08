import { drizzle } from "drizzle-orm/neon-serverless";
import { neonConfig, Pool } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

const globalForDb = globalThis as unknown as { neonPool?: Pool };

if (!globalForDb.neonPool) {
  globalForDb.neonPool = new Pool({ connectionString: databaseUrl });
  globalForDb.neonPool.on("error", (err: unknown) =>
    console.error("[neon-pool] idle client error", err),
  );
}

export const db = drizzle({ client: globalForDb.neonPool });

/** Covers both the root db instance and the tx handle inside db.transaction(). */
export type TransactionScope =
  typeof db | Parameters<Parameters<typeof db.transaction>[0]>[0];
