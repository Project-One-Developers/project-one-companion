import {
    ARMOR_TYPES,
    CLASSES_NAME,
    ITEM_SLOTS_DESC,
    ITEM_SLOTS_KEY,
    RAID_DIFF,
    ROLES
} from '@shared/consts/wow.consts'
import { RaiderioProgress } from '@shared/schemas/raiderio.schemas'
import { CharAssignmentHighlights, GearItem } from '@shared/types/types'
import { relations } from 'drizzle-orm'
import {
    boolean,
    integer,
    jsonb,
    pgEnum,
    pgTable,
    primaryKey,
    text,
    unique,
    varchar
} from 'drizzle-orm/pg-core'

//////////////////////////////////////////////////////////
//                      ENUMS                           //
//////////////////////////////////////////////////////////

export const pgClassEnum = pgEnum('class', CLASSES_NAME)
export const pgRoleEnum = pgEnum('role', ROLES)
export const pgRaidDiffEnum = pgEnum('raid_diff', RAID_DIFF)

export const pgItemArmorTypeEnum = pgEnum('item_armor_type', ARMOR_TYPES)
export const pgItemSlotEnum = pgEnum('item_slot', ITEM_SLOTS_DESC)
export const pgItemSlotKeyEnum = pgEnum('item_slot_key', ITEM_SLOTS_KEY)

//////////////////////////////////////////////////////////
//                   CHARACHTERS                        //
//////////////////////////////////////////////////////////

export const playerTable = pgTable('players', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull().unique()
})

export const charTable = pgTable(
    'characters',
    {
        id: varchar('id').primaryKey(),
        name: varchar('name', { length: 24 }).notNull(), // wow charname limit == 24
        realm: varchar('realm').notNull(),
        class: pgClassEnum().notNull(),
        role: pgRoleEnum().notNull(),
        main: boolean('main').notNull(), // consider player main char (for future me: dont put any constraint in case any player has more than one "main "char)
        playerId: varchar('player_id')
            .references(() => playerTable.id)
            .notNull()
    },
    t => [
        unique('name_realm').on(t.name, t.realm) // coppia nome-realm unique
    ]
)

export const charWowAuditTable = pgTable(
    'characters_wowaudit',
    {
        name: varchar('name', { length: 24 }).notNull(),
        realm: varchar('realm').notNull(),
        race: varchar('race'),
        guildRank: varchar('guild_rank'),
        characterId: integer('character_id').notNull(),
        blizzardLastModifiedUnixTs: integer('blizzard_last_modified_unix_ts').notNull(),
        wowauditLastModifiedUnixTs: integer('wowaudit_last_modified_unix_ts').notNull(),
        weekMythicDungeons: integer('week_mythic_dungeons'),
        emptySockets: integer('empty_sockets'),
        averageItemLevel: varchar('average_item_level'),
        enchantQualityWrist: integer('enchant_quality_wrist'),
        enchantQualityLegs: integer('enchant_quality_legs'),
        enchantQualityMainHand: integer('enchant_quality_main_hand'),
        enchantQualityOffHand: integer('enchant_quality_off_hand'),
        enchantQualityFinger1: integer('enchant_quality_finger1'),
        enchantQualityFinger2: integer('enchant_quality_finger2'),
        enchantQualityBack: integer('enchant_quality_back'),
        enchantQualityChest: integer('enchant_quality_chest'),
        enchantQualityFeet: integer('enchant_quality_feet'),
        enchantNameWrist: varchar('enchant_name_wrist'),
        enchantNameLegs: varchar('enchant_name_legs'),
        enchantNameMainHand: varchar('enchant_name_main_hand'),
        enchantNameOffHand: varchar('enchant_name_off_hand'),
        enchantNameFinger1: varchar('enchant_name_finger1'),
        enchantNameFinger2: varchar('enchant_name_finger2'),
        enchantNameBack: varchar('enchant_name_back'),
        enchantNameChest: varchar('enchant_name_chest'),
        enchantNameFeet: varchar('enchant_name_feet'),
        greatVaultSlot1: integer('great_vault_slot1'),
        greatVaultSlot2: integer('great_vault_slot2'),
        greatVaultSlot3: integer('great_vault_slot3'),
        greatVaultSlot4: integer('great_vault_slot4'),
        greatVaultSlot5: integer('great_vault_slot5'),
        greatVaultSlot6: integer('great_vault_slot6'),
        greatVaultSlot7: integer('great_vault_slot7'),
        greatVaultSlot8: integer('great_vault_slot8'),
        greatVaultSlot9: integer('great_vault_slot9'),
        highestIlvlEverEquipped: varchar('highest_ilvl_ever_equipped'),
        bestItemsEquipped: jsonb('best_items_equipped').$type<GearItem[]>().notNull(),
        itemsEquipped: jsonb('items_equipped').$type<GearItem[]>().notNull(),
        tiersetInfo: jsonb('tierset_info').$type<GearItem[]>().notNull()
    },
    t => [primaryKey({ columns: [t.name, t.realm] })]
)

export const charRaiderioTable = pgTable(
    'characters_raiderio',
    {
        name: varchar('name', { length: 24 }).notNull(),
        realm: varchar('realm').notNull(),
        race: varchar('race'),
        characterId: integer('character_id').notNull(),
        p1SyncAt: integer('p1_sync_at').notNull(), // 2025-07-29T06:00:12.000Z
        loggedOutAt: integer('logged_out_at').notNull(), // 2025-07-29T06:00:12.000Z
        itemUpdateAt: integer('item_update_at').notNull(), // 2025-07-29T06:00:12.000Z
        averageItemLevel: varchar('average_item_level'), // item_level_equipped
        itemsEquipped: jsonb('items_equipped').$type<GearItem[]>().notNull(),
        progress: jsonb('progress').$type<RaiderioProgress>().notNull()
    },
    t => [primaryKey({ columns: [t.name, t.realm] })]
)

export const bisListTable = pgTable(
    'bis_list',
    {
        id: varchar('id').primaryKey(),
        itemId: integer('item_id').notNull(),
        specId: integer('spec_id').notNull()
    },
    t => [unique().on(t.itemId, t.specId)]
)

//////////////////////////////////////////////////////////
//                   SIMULATIONS                        //
//////////////////////////////////////////////////////////

export const droptimizerUpgradesTable = pgTable(
    'droptimizer_upgrades',
    {
        id: varchar('id').primaryKey(),
        dps: integer('dps').notNull(),
        slot: varchar('slot').notNull(),
        ilvl: integer('ilvl').notNull(),
        itemId: integer('item_id')
            .references(() => itemTable.id)
            .notNull(),
        tiersetItemId: integer('tierset_item_id').references(() => itemTable.id),
        catalyzedItemId: integer('catalyzed_item_id').references(() => itemTable.id),
        droptimizerId: varchar('droptimizer_id')
            .references(() => droptimizerTable.url, { onDelete: 'cascade' })
            .notNull()
    },
    t => [
        unique('item_upgrade_in_droptimizer').on(t.itemId, t.droptimizerId) // un itemid per droptimizer
    ]
)

export const droptimizerTable = pgTable('droptimizers', {
    url: text('url').primaryKey(),
    ak: varchar('ak').notNull().unique(), // droptimizer identifier key eg: 1273,heroic,Tartesia,Nemesis,Devastation,Evoker
    dateImported: integer('date_imported').notNull(), // imported unix timestamp in this app
    simDate: integer('sim_date').notNull(), // droptimizer execution unix timestamp
    simFightStyle: varchar('sim_fight_style', { length: 50 }).notNull(),
    simDuration: integer('sim_duration').notNull(),
    simNTargets: integer('sim_n_targets').notNull(),
    simUpgradeEquipped: boolean('sim_upgrade_equipped'),
    raidId: integer('raid_id').notNull(),
    raidDifficulty: pgRaidDiffEnum('raid_difficulty').notNull(),
    characterName: varchar('character_name', { length: 24 }).notNull(),
    characterServer: varchar('character_server').notNull(),
    characterClass: pgClassEnum('character_class').notNull(),
    characterClassId: integer('character_classId').notNull(),
    characterSpec: varchar('character_spec').notNull(),
    characterSpecId: integer('character_specId').notNull(),
    characterTalents: varchar('character_talents').notNull(),
    weeklyChest: jsonb('weekly_chest').$type<GearItem[]>(),
    currencies: jsonb('currencies').$type<{ id: number; type: string; amount: number }[]>(),
    itemsAverageItemLevel: integer('items_average_ilvl'),
    itemsAverageItemLevelEquipped: integer('items_average_ilvl_equipped'),
    itemsEquipped: jsonb('items_equipped').$type<GearItem[]>().notNull(),
    itemsInBag: jsonb('items_in_bags').$type<GearItem[]>(),
    tiersetInfo: jsonb('tierset_info').$type<GearItem[]>()
})

// SimC Table for import char info without droptimizer
export const simcTable = pgTable('simc', {
    hash: text('hash').primaryKey(),
    dateGenerated: integer('date_generated').notNull(), // imported unix timestamp in this app
    charName: varchar('character_name', { length: 24 }).notNull(),
    charRealm: varchar('character_server').notNull(),
    weeklyChest: jsonb('weekly_chest').$type<GearItem[]>(),
    currencies: jsonb('currencies').$type<{ id: number; type: string; amount: number }[]>(),
    itemsEquipped: jsonb('items_equipped').$type<GearItem[]>().notNull(),
    itemsInBag: jsonb('items_in_bags').$type<GearItem[]>(),
    tiersetInfo: jsonb('tierset_info').$type<GearItem[]>()
})

//////////////////////////////////////////////////////////
//                   RAID SESSION                       //
//////////////////////////////////////////////////////////

export const raidSessionTable = pgTable('raid_sessions', {
    id: varchar('id').primaryKey(),
    name: varchar('name').notNull(),
    raidDate: integer('date').notNull()
})

export const raidSessionRosterTable = pgTable(
    'raid_sessions_roster',
    {
        raidSessionId: varchar('raid_session_id')
            .references(() => raidSessionTable.id, { onDelete: 'cascade' })
            .notNull(),
        charId: varchar('char_id')
            .references(() => charTable.id, { onDelete: 'cascade' })
            .notNull()
    },
    t => [primaryKey({ columns: [t.raidSessionId, t.charId] })]
)

export const lootTable = pgTable('loots', {
    id: varchar('id').primaryKey(),
    dropDate: integer('drop_date').notNull(),
    itemString: varchar('item_string'),
    gearItem: jsonb('gear_item').$type<GearItem>(),
    raidDifficulty: pgRaidDiffEnum('raid_difficulty').notNull(),
    charsEligibility: text('chars_eligibility').array(), // array of IDs referencing RaidSession.Chars
    assignedCharacterId: varchar('assigned_character_id').references(() => charTable.id),
    assignedHighlights: jsonb('assigned_highlights').$type<CharAssignmentHighlights>(),
    tradedToAssigned: boolean('traded_to_assigned').notNull().default(false),
    raidSessionId: varchar('raid_session_id')
        .references(() => raidSessionTable.id, { onDelete: 'cascade' })
        .notNull(),
    itemId: integer('item_id')
        .references(() => itemTable.id)
        .notNull()
})

export const assignmentTable = pgTable('assignments', {
    id: varchar('id').primaryKey(),
    charId: varchar('char_id')
        .references(() => charTable.id)
        .notNull(),
    lootId: varchar('loot_id')
        .references(() => lootTable.id)
        .unique('loot_assignment')
        .notNull() // un loot può essere assegnato una sola volta
})

//////////////////////////////////////////////////////////
//                     JSON DATA                        //
//////////////////////////////////////////////////////////

export const bossTable = pgTable('bosses', {
    id: integer('id').primaryKey(), // // ricicliamo journal_encounter_id fornito da wow api
    name: varchar('name', { length: 255 }).notNull(),
    instanceId: integer('instance_id').notNull(),
    instanceName: varchar('instance_name').notNull(),
    instanceType: varchar('instance_type').notNull(),
    order: integer('order').notNull(),
    raiderioEncounterSlug: varchar('raiderio_encounter_slug', { length: 50 }),
    raiderioRaidSlug: varchar('raiderio_raid_slug', { length: 50 })
})

// Sono gli item lootabili dal raid - contiene l'import di public/items.csv
export const itemTable = pgTable('items', {
    id: integer('id').primaryKey(), // ricicliamo id fornito da wow api
    name: varchar('name', { length: 255 }).notNull(),
    ilvlBase: integer('ilvl_base').notNull(),
    ilvlMythic: integer('ilvl_mythic').notNull(),
    ilvlHeroic: integer('ilvl_heroic').notNull(),
    ilvlNormal: integer('ilvl_normal').notNull(),
    itemClass: varchar('item_class', { length: 50 }),
    slot: pgItemSlotEnum('slot').notNull(),
    slotKey: pgItemSlotKeyEnum('slot_key').notNull(),
    armorType: pgItemArmorTypeEnum('armor_type'),
    itemSubclass: varchar('item_subclass', { length: 50 }),
    token: boolean('token').notNull(), // se è un item che genera tierset
    tokenPrefix: varchar('token_prefix', { length: 50 }), // es: Dreadful
    tierset: boolean('tierset').notNull(), // se è un item tierset
    tiersetPrefix: varchar('tierset_prefix', { length: 50 }),
    veryRare: boolean('very_rare').notNull(),
    boe: boolean('boe').notNull(),
    onUseTrinket: boolean('on_use_trinket').notNull(),
    specs: text('specs').array(), // null == tutte le spec
    specIds: integer('spec_ids').array(),
    classes: text('classes').array(),
    classesId: integer('classes_id').array(),
    stats: text('stats'),
    mainStats: varchar('main_stats', { length: 50 }),
    secondaryStats: varchar('secondary_stats', { length: 50 }),
    wowheadUrl: text('wowhead_url').notNull(),
    iconName: varchar('icon_name', { length: 255 }).notNull(),
    iconUrl: text('icon_url').notNull(),
    catalyzed: boolean('catalyzed').notNull().default(false), // se questo item è ottenibile solo tramite catalyst
    sourceId: integer('source_id').notNull(),
    sourceName: varchar('source_name').notNull(),
    sourceType: varchar('source_type').notNull(),
    bossName: varchar('boss_name', { length: 255 }), // ridondante ma utile
    season: integer('season').notNull(),
    bossId: integer('boss_id')
        .references(() => bossTable.id)
        .notNull()
})

// Item Note ( user can write note about item, we isolate in a dedicated table to avoid data loss on item reload)
export const itemNoteTable = pgTable('items_note', {
    itemId: integer('item_id').primaryKey(),
    note: varchar('note').notNull()
})

// Mapping tra itemId e Tier Token che lo genera - contiene l'import di public/items_to_tierset.csv
export const itemToTiersetTable = pgTable('items_to_tierset', {
    itemId: integer('item_id').primaryKey(),
    classId: integer('class_id').notNull(),
    tokenId: integer('token_id')
        .references(() => itemTable.id)
        .notNull()
})

// Mapping tra itemId e relativi catalyst (preso da public/items_to_catalyst.json)
// La logica è: catalyzedItemId è l'item id ottenuto se dovessi catalizzare l'itemId lootato da un certo boss (encounter id)
// encounterId ci server per il reverse lookup: da catalyzedItemId + encounterId risalgo all'itemId originale
export const itemToCatalystTable = pgTable(
    'items_to_catalyst',
    {
        itemId: integer('item_id').notNull(),
        encounterId: integer('encounter_id').notNull(),
        catalyzedItemId: integer('catalyzed_item_id').notNull()
    },
    t => [
        primaryKey({ columns: [t.itemId, t.encounterId, t.catalyzedItemId] }) // todo: non va UPDATE BY ZORBY: fixed in this commit?
    ]
)

// Project One Configuration
// Contains Config and Secret that we cant distribute with the client application
// eg: DISCORD_BOT_TOKEN
export const appConfigTable = pgTable('app_config', {
    key: varchar('key').primaryKey(),
    value: varchar('value').notNull()
})

//////////////////////////////////////////////////////////
//                     RELATIONS                        //
//////////////////////////////////////////////////////////

export const bossItemsRelations = relations(bossTable, ({ many }) => ({
    items: many(itemTable)
}))

export const itemBossRelations = relations(itemTable, ({ one }) => ({
    boss: one(bossTable, {
        fields: [itemTable.bossId],
        references: [bossTable.id]
    })
}))

export const charPlayerRelations = relations(charTable, ({ one }) => ({
    player: one(playerTable, {
        fields: [charTable.playerId],
        references: [playerTable.id]
    })
}))

export const droptimizerUpgradesRelations = relations(droptimizerUpgradesTable, ({ one }) => ({
    droptimizer: one(droptimizerTable, {
        fields: [droptimizerUpgradesTable.droptimizerId],
        references: [droptimizerTable.url]
    }),
    item: one(itemTable, {
        fields: [droptimizerUpgradesTable.itemId],
        references: [itemTable.id]
    }),
    catalyzedItem: one(itemTable, {
        fields: [droptimizerUpgradesTable.catalyzedItemId],
        references: [itemTable.id]
    })
}))

export const droptimizerRelations = relations(droptimizerTable, ({ many }) => ({
    upgrades: many(droptimizerUpgradesTable)
}))

export const playerCharRelations = relations(playerTable, ({ many }) => ({
    characters: many(charTable)
}))

// Raid Sessions
export const raidSessionTableRelations = relations(raidSessionTable, ({ many }) => ({
    charPartecipation: many(raidSessionRosterTable),
    lootedItems: many(lootTable)
}))

export const charTableRelations = relations(charTable, ({ one, many }) => ({
    raidPartecipation: many(raidSessionRosterTable),
    player: one(playerTable, {
        fields: [charTable.playerId],
        references: [playerTable.id]
    })
}))

export const raidSessionRosterRelations = relations(raidSessionRosterTable, ({ one }) => ({
    raidSession: one(raidSessionTable, {
        fields: [raidSessionRosterTable.raidSessionId],
        references: [raidSessionTable.id]
    }),
    character: one(charTable, {
        fields: [raidSessionRosterTable.charId],
        references: [charTable.id]
    })
}))

// Loot table
export const lootsRelations = relations(lootTable, ({ one }) => ({
    item: one(itemTable, {
        fields: [lootTable.itemId],
        references: [itemTable.id]
    }),
    assignedCharacter: one(charTable, {
        fields: [lootTable.assignedCharacterId],
        references: [charTable.id]
    })
}))
