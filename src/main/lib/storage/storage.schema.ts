import {
    ARMOR_TYPES,
    CLASSES,
    ITEM_SLOTS,
    ITEM_SLOTS_KEY,
    RAID_DIFF,
    ROLES,
    SPECS
} from '@shared/consts/wow.consts'
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

export const pgClassEnum = pgEnum('class', CLASSES)
export const pgSpecEnum = pgEnum('spec', SPECS)
export const pgRoleEnum = pgEnum('role', ROLES)
export const pgRaidDiffEnum = pgEnum('raid_diff', RAID_DIFF)

export const pgItemArmorTypeEnum = pgEnum('item_armor_type', ARMOR_TYPES)
export const pgItemSlotEnum = pgEnum('item_slot', ITEM_SLOTS)
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
    (t) => [
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
        headIlvl: integer('equipped_head_ilvl'),
        headId: integer('equipped_head_id'),
        neckIlvl: integer('equipped_neck_ilvl'),
        neckId: integer('equipped_neck_id'),
        shoulderIlvl: integer('equipped_shoulder_ilvl'),
        shoulderId: integer('equipped_shoulder_id'),
        backIlvl: integer('equipped_back_ilvl'),
        backId: integer('equipped_back_id'),
        chestIlvl: integer('equipped_chest_ilvl'),
        chestId: integer('equipped_chest_id'),
        wristIlvl: integer('equipped_wrist_ilvl'),
        wristId: integer('equipped_wrist_id'),
        handsIlvl: integer('equipped_hands_ilvl'),
        handsId: integer('equipped_hands_id'),
        waistIlvl: integer('equipped_waist_ilvl'),
        waistId: integer('equipped_waist_id'),
        legsIlvl: integer('equipped_legs_ilvl'),
        legsId: integer('equipped_legs_id'),
        feetIlvl: integer('equipped_feet_ilvl'),
        feetId: integer('equipped_feet_id'),
        finger1Ilvl: integer('equipped_finger1_ilvl'),
        finger1Id: integer('equipped_finger1_id'),
        finger2Ilvl: integer('equipped_finger2_ilvl'),
        finger2Id: integer('equipped_finger2_id'),
        trinket1Ilvl: integer('equipped_trinket1_ilvl'),
        trinket1Id: integer('equipped_trinket1_id'),
        trinket2Ilvl: integer('equipped_trinket2_ilvl'),
        trinket2Id: integer('equipped_trinket2_id'),
        mainHandIlvl: integer('equipped_mainhand_ilvl'),
        mainHandId: integer('equipped_mainhand_id'),
        offHandIlvl: integer('equipped_offhand_ilvl'),
        offHandId: integer('equipped_offhand_id'),
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
        tiersetHeadIlvl: integer('tierset_head_ilvl'),
        tiersetShouldersIlvl: integer('tierset_shoulders_ilvl'),
        tiersetChestIlvl: integer('tierset_chest_ilvl'),
        tiersetHandsIlvl: integer('tierset_hands_ilvl'),
        tiersetLegsIlvl: integer('tierset_legs_ilvl'),
        tiersetHeadDiff: varchar('tierset_head_diff'),
        tiersetShouldersDiff: varchar('tierset_shoulders_diff'),
        tiersetChestDiff: varchar('tierset_chest_diff'),
        tiersetHandsDiff: varchar('tierset_hands_diff'),
        tiersetLegsDiff: varchar('tierset_legs_diff'),
        highestIlvlEverEquipped: varchar('highest_ilvl_ever_equipped'),
        bestHeadIlvl: integer('best_head_ilvl'),
        bestHeadId: integer('best_head_id'),
        bestNeckIlvl: integer('best_neck_ilvl'),
        bestNeckId: integer('best_neck_id'),
        bestShoulderIlvl: integer('best_shoulder_ilvl'),
        bestShoulderId: integer('best_shoulder_id'),
        bestBackIlvl: integer('best_back_ilvl'),
        bestBackId: integer('best_back_id'),
        bestChestIlvl: integer('best_chest_ilvl'),
        bestChestId: integer('best_chest_id'),
        bestWristIlvl: integer('best_wrist_ilvl'),
        bestWristId: integer('best_wrist_id'),
        bestHandsIlvl: integer('best_hands_ilvl'),
        bestHandsId: integer('best_hands_id'),
        bestWaistIlvl: integer('best_waist_ilvl'),
        bestWaistId: integer('best_waist_id'),
        bestLegsIlvl: integer('best_legs_ilvl'),
        bestLegsId: integer('best_legs_id'),
        bestFeetIlvl: integer('best_feet_ilvl'),
        bestFeetId: integer('best_feet_id'),
        bestFinger1Ilvl: integer('best_finger1_ilvl'),
        bestFinger1Id: integer('best_finger1_id'),
        bestFinger2Ilvl: integer('best_finger2_ilvl'),
        bestFinger2Id: integer('best_finger2_id'),
        bestTrinket1Ilvl: integer('best_trinket1_ilvl'),
        bestTrinket1Id: integer('best_trinket1_id'),
        bestTrinket2Ilvl: integer('best_trinket2_ilvl'),
        bestTrinket2Id: integer('best_trinket2_id'),
        bestMainHandIlvl: integer('best_main_hand_ilvl'),
        bestMainHandId: integer('best_main_hand_id'),
        bestOffHandIlvl: integer('best_off_hand_ilvl'),
        bestOffHandId: integer('best_off_hand_id')
    },
    (t) => {
        return [
            {
                pk: primaryKey({ columns: [t.name, t.realm] })
            }
        ]
    }
)

export const bisListTable = pgTable(
    'bis_list',
    {
        id: varchar('id').primaryKey(),
        itemId: integer('item_id').notNull(),
        specId: integer('spec_id').notNull()
    },
    (table) => [unique().on(table.itemId, table.specId)]
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
        catalyzedItemId: integer('catalyzed_item_id').references(() => itemTable.id),
        droptimizerId: varchar('droptimizer_id')
            .references(() => droptimizerTable.url, { onDelete: 'cascade' })
            .notNull()
    },
    (t) => [
        unique('item_upgrade_in_droptimizer').on(t.itemId, t.droptimizerId) // un itemid per droptimizer
    ]
)

export const droptimizerTable = pgTable('droptimizers', {
    url: text('url').primaryKey(),
    ak: varchar('ak').notNull(), // droptimizer identifier key eg: 1273,heroic,Tartesia,Nemesis,Devastation,Evoker
    dateImported: integer('date_imported').notNull(), // imported unix timestamp in this app
    simDate: integer('sim_date').notNull(), // droptimizer execution unix timestamp
    simFightStyle: varchar('sim_fight_style', { length: 50 }).notNull(),
    simDuration: integer('sim_duration').notNull(),
    simNTargets: integer('sim_n_targets').notNull(),
    simRaidbotInput: text('sim_raidbot_input').notNull(),
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
    weeklyChest:
        jsonb('weekly_chest').$type<{ id: number; bonusString: string; itemLevel: number }[]>(),
    currencies: jsonb('currencies').$type<{ id: number; type: string; amount: number }[]>(),
    itemsAverageItemLevel: integer('items_average_ilvl'),
    itemsAverageItemLevelEquipped: integer('items_average_ilvl_equipped'),
    itemsEquipped: jsonb('items_equipped').notNull()
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
    (t) => [
        {
            pk: primaryKey({ columns: [t.raidSessionId, t.charId] })
        }
    ]
)

export const lootTable = pgTable('loots', {
    id: varchar('id').primaryKey(),
    dropDate: integer('drop_date').notNull(),
    tertiaryStat: boolean('third_stat'),
    itemString: varchar('item_string'),
    bonusString: varchar('bonus_string'),
    socket: boolean('socket').notNull().default(false),
    raidDifficulty: pgRaidDiffEnum('raid_difficulty').notNull(),
    charsEligibility: text('chars_eligibility').array(), // array of IDs referencing RaidSession.Chars
    rclootId: varchar('rcloot_id').unique(),
    assignedCharacterId: varchar('assigned_character_id').references(() => charTable.id),
    raidSessionId: varchar('raid_session_id')
        .references(() => raidSessionTable.id)
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
    name: varchar('name', { length: 255 }).notNull().unique(),
    instanceId: integer('instance_id').notNull(),
    instanceName: varchar('instance_name').notNull(),
    instanceType: varchar('instance_type').notNull(),
    order: integer('order').notNull()
})

// Sono gli item lootabili dal raid - contiene l'import di public/items.csv
export const itemTable = pgTable('items', {
    id: integer('id').primaryKey(), // ricicliamo id fornito da wow api
    name: varchar('name', { length: 255 }).notNull(),
    ilvlMythic: integer('ilvl_mythic').notNull(),
    ilvlHeroic: integer('ilvl_heroic').notNull(),
    ilvlNormal: integer('ilvl_normal').notNull(),
    itemClass: varchar('item_class', { length: 50 }),
    slot: pgItemSlotEnum('slot'),
    slotKey: pgItemSlotKeyEnum('slot_key'),
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
    specIds: text('spec_ids').array(),
    classes: text('classes').array(),
    classesId: text('classes_id').array(),
    stats: text('stats'),
    mainStats: varchar('main_stats', { length: 50 }),
    secondaryStats: varchar('secondary_stats', { length: 50 }),
    wowheadUrl: text('wowhead_url'),
    iconName: varchar('icon_name', { length: 255 }),
    iconUrl: text('icon_url'),
    catalyzed: boolean('catalyzed').notNull().default(false), // se questo item è ottenibile solo tramite catalyst
    sourceId: integer('source_id'),
    sourceName: varchar('source_name'),
    sourceType: varchar('source_type'),
    bossName: varchar('boss_name', { length: 255 }), // ridondante ma utile
    bossId: integer('boss_id')
        .references(() => bossTable.id)
        .notNull()
})

// Mapping tra itemId e Tier Token che lo genera - contiene l'import di public/items_to_tierset.csv
export const itemToTiersetTable = pgTable('items_to_tierset', {
    itemId: integer('item_id').primaryKey(),
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
    (t) => [
        {
            pk: primaryKey({ columns: [t.itemId, t.encounterId, t.catalyzedItemId] }) // todo: non va
        }
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
    charPartecipation: many(raidSessionRosterTable)
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
    })
}))
