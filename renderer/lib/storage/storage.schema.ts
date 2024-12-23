import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    text,
    unique,
    varchar,
} from "drizzle-orm/pg-core";
import { CLASSES, RAID_DIFF, ROLES } from "../classes";

export const pgClassEnum = pgEnum("class", CLASSES);
export const pgRoleEnum = pgEnum("role", ROLES);
export const pgRaidDiffEnum = pgEnum("raid_diff", RAID_DIFF);

export const playerTable = pgTable("players", {
    id: varchar("id").primaryKey(),
    name: varchar("name").notNull(),
});

export const charTable = pgTable("chars", {
    id: varchar("id").primaryKey(),
    name: varchar("name", { length: 24 }).notNull(), // wow charname limit == 24
    class: pgClassEnum().notNull(),
    role: pgRoleEnum().notNull(),
    playerId: varchar("player_id")
        .references(() => playerTable.id)
        .notNull(),
});

export const droptimizerTable = pgTable("droptimizers", {
    id: varchar("id").primaryKey(),
    url: text("url").notNull(),
    resultRaw: text("result_raw").notNull(),
    date: integer("date").notNull(),
    fightStyle: varchar("fight_style", { length: 50 }).notNull(),
    duration: integer("duration").notNull(),
    nTargets: integer("n_targets").notNull(),
    raidDifficulty: varchar("raid_difficulty", { length: 20 }).notNull(),
    // charId: varchar("char_id").references(() => char.id),
});

export const raidSessionTable = pgTable("raid_sessions", {
    id: varchar("id").primaryKey(),
    startedAt: integer("date").notNull(),
    completedAt: integer("date"),
});

export const raidSessionRosterTable = pgTable(
    "raid_sessions_roster",
    {
        id: varchar("id").primaryKey(),
        raidSessionId: varchar("raid_session_id")
            .references(() => raidSessionTable.id)
            .notNull(),
        charId: varchar("char_id")
            .references(() => charTable.id)
            .notNull(),
    },
    (t) => [
        unique("raid_partecipation").on(t.raidSessionId, t.charId), // un char può partecipare ad una sessione alla volta
    ],
);

export const bossTable = pgTable("boss", {
    id: integer("id").primaryKey(), // // ricicliamo journal_encounter_id fornito da wow api
    name: varchar("name", { length: 255 }).notNull(),
    raid: varchar("raid", { length: 255 }),
    order: integer("order").notNull(),
});

// Sono gli item lootabili dal raid - contiene l'import di public/items.csv
export const itemTable = pgTable("items", {
    id: integer("id").primaryKey(), // ricicliamo id fornito da wow api
    name: varchar("name", { length: 255 }).notNull(),
    ilvlMythic: integer("ilvl_mythic"),
    ilvlHeroic: integer("ilvl_heroic"),
    ilvlNormal: integer("ilvl_normal"),
    bonusID: varchar("bonus_id", { length: 50 }),
    itemClass: varchar("item_class", { length: 50 }),
    slot: varchar("slot", { length: 50 }),
    itemSubclass: varchar("item_subclass", { length: 50 }),
    tierPrefix: varchar("tier_prefix", { length: 50 }), // es: Dreadful
    tier: boolean("tier").notNull().default(false), // se è un item tierser
    veryRare: boolean("very_rare").notNull().default(false),
    specs: text("specs"),
    specIds: varchar("spec_ids", { length: 255 }),
    classes: varchar("classes", { length: 255 }),
    classesId: varchar("classes_id", { length: 50 }),
    stats: text("stats"),
    mainStats: varchar("main_stats", { length: 50 }),
    secondaryStats: varchar("secondary_stats", { length: 50 }),
    wowheadUrl: text("wowhead_url"),
    iconName: varchar("icon_name", { length: 255 }),
    iconUrl: text("icon_url"),
    bossName: varchar("boss_name", { length: 255 }), // ridondante ma utile
    bossId: varchar("boss_id")
        .references(() => bossTable.id)
        .notNull(),
});

export const lootTable = pgTable("loots", {
    id: varchar("id").primaryKey(),
    dropDate: integer("drop_date").notNull(),
    thirdStat: varchar("third_stat", { length: 255 }),
    socket: boolean("socket").notNull().default(false),
    // eligibility: text('eligibility').array(), // array of IDs referencing RaidSession.Chars
    raidSessionId: varchar("raid_session_id")
        .references(() => raidSessionTable.id)
        .notNull(),
    itemId: varchar("item_id")
        .references(() => itemTable.id)
        .notNull(),
    bossId: varchar("boss_id")
        .references(() => bossTable.id)
        .notNull(), // ridondato per comodità ma ricavabile da item.boss.id
});

export const assignmentTable = pgTable("assignments", {
    id: varchar("id").primaryKey(),
    charId: varchar("char_id")
        .references(() => charTable.id)
        .notNull(),
    lootId: varchar("loot_id")
        .references(() => lootTable.id)
        .unique("loot_assignment")
        .notNull(), // un loot può essere assegnato una sola volta
});

export const bisListTable = pgTable("bis_list", {
    id: varchar("id").primaryKey(),
    charId: varchar("char_id")
        .references(() => charTable.id)
        .notNull(),
    //itemList: text('item_list').array() // array of strings
});
