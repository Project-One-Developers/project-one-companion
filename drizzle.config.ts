import { defineConfig } from "drizzle-kit";

const connectionUrl = process.env.DATABASE_URL;

if (!connectionUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./renderer/lib/storage/storage.schema.ts",
    dbCredentials: {
        url: connectionUrl,
    },
});
