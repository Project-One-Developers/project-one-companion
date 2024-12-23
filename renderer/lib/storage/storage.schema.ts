import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const player = pgTable("players", {
  id: varchar("id").primaryKey(),
  name: varchar("name").notNull(),
});

export const char = pgTable("chars", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 24 }).notNull(), // wow charname limit == 24
  class: varchar("class").notNull(),
  role: varchar("role").notNull(),
  playerId: varchar("player_id").references(() => player.id),
});

export const droptimizer = pgTable("droptimizers", {
  id: varchar("id").primaryKey(),
  url: text("url").notNull(),
  resultRaw: text("result_raw").notNull(),
  date: timestamp("date").notNull(),
  fightstyle: varchar("fightstyle", { length: 50 }).notNull(),
  duration: integer("duration").notNull(),
  raidDifficulty: varchar("raid_difficulty", { length: 20 }).notNull(),
  // charId: varchar("char_id").references(() => char.id),
});

export const raidSession = pgTable("raid_sessions", {
  id: varchar("id").primaryKey(),
  started_at: timestamp("date").notNull(),
  completed_at: timestamp("date"),
});

export const raidSessionRoster = pgTable(
  "raid_sessions_roster",
  {
    id: varchar("id").primaryKey(),
    raidSessionId: varchar("raid_session_id").references(() => raidSession.id),
    charId: varchar("char_id").references(() => char.id),
  },
  (t) => ({
    unq: unique("raid_partecipation").on(t.raidSessionId, t.charId), // un char può partecipare ad una sessione alla volta
  }),
);

export const boss = pgTable("boss", {
  id: varchar("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
});

// todo: item sarà la tabella che contiene l'import di public/items.csv
// da definire
export const item = pgTable("items", {
  id: varchar("id").primaryKey(),
  bossId: varchar("boss_id").references(() => boss.id),
});

export const loot = pgTable("loots", {
  id: varchar("id").primaryKey(),
  dropDate: timestamp("drop_date").notNull(),
  thirdStat: varchar("third_stat", { length: 255 }),
  socket: boolean("socket").notNull().default(false),
  // eligibility: text('eligibility').array(), // array of IDs referencing RaidSession.Chars
  raidSessionId: varchar("raid_session_id").references(() => raidSession.id),
  itemId: varchar("item_id").references(() => item.id),
  bossId: varchar("boss_id").references(() => boss.id), // ridondato per comodità ma ricavabile da item.boss.id
});

export const assignment = pgTable("assignments", {
  id: varchar("id").primaryKey(),
  charId: varchar("char_id").references(() => char.id),
  lootId: varchar("loot_id")
    .references(() => loot.id)
    .unique("loot_assignment"), // un loot può essere assegnato una sola volta
});

export const bisList = pgTable("bis_list", {
  id: varchar("id").primaryKey(),
  charId: varchar("char_id").references(() => char.id),
  //itemList: text('item_list').array() // array of strings
});
