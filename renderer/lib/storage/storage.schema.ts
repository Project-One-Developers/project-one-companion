import { pgTable, text, varchar } from "drizzle-orm/pg-core";

export const player = pgTable("players", {
    id: varchar("id").primaryKey(),
    playerName: text("player_name").notNull(),
});
