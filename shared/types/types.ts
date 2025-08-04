import { bisListSchema } from '@shared/schemas/bis-list.schemas'
import { bossSchema, bossWithItemsSchema } from '@shared/schemas/boss.schema'
import { itemNoteSchema } from '@shared/schemas/itemNote.schema'
import {
    gearItemSchema,
    itemSchema,
    itemToCatalystSchema,
    itemToTiersetSchema,
    itemTrackSchema
} from '@shared/schemas/items.schema'
import {
    charAssignmentHighlightsSchema,
    lootSchema,
    lootWithAssignedSchema,
    lootWithItemSchema,
    newLootManualSchema,
    newLootSchema
} from '@shared/schemas/loot.schema'
import {
    editRaidSessionSchema,
    newRaidSessionSchema,
    raidSessionSchema,
    raidSessionWithRosterSchema,
    raidSessionWithSummarySchema
} from '@shared/schemas/raid.schemas'
import { appSettingsSchema } from '@shared/schemas/store.schemas'
import { charWowAuditSchema } from '@shared/schemas/wowaudit.schemas'
import { z } from 'zod'
import {
    characterGameInfoSchema,
    characterSchema,
    characterWithGears,
    characterWithPlayerSchema,
    characterWithProgressionSchema,
    editCharacterSchema,
    editPlayerSchema,
    newCharacterSchema,
    newPlayerSchema,
    playerSchema,
    playerWithCharacterSchema
} from '../schemas/characters.schemas'
import {
    droptimizerCurrenciesSchema,
    droptimizerSchema,
    droptimizerUpgradeSchema,
    newDroptimizerSchema,
    newDroptimizerUpgradeSchema,
    raidbotsURLSchema
} from '../schemas/simulations.schemas'
import {
    tierSetBonusSchema,
    wowArmorTypeSchema,
    wowClassNameSchema,
    wowItemEquippedSlotKeySchema,
    wowItemSlotKeySchema,
    wowItemSlotKeyTiersetSchema,
    wowItemSlotSchema,
    wowItemTrackNameSchema,
    wowRaidDiffSchema,
    wowRolePositionSchema,
    wowRolesSchema,
    wowSpecNameSchema
} from '../schemas/wow.schemas'

export type WowClassName = z.infer<typeof wowClassNameSchema>
export type WowSpecName = z.infer<typeof wowSpecNameSchema>
export type WowSpec = {
    id: number
    name: WowSpecName
    role: WoWRole
    position: WoWRolePosition
}

export type WowClass = {
    id: number
    name: WowClassName
    specs: WowSpec[]
}

export type WowRaidDifficulty = z.infer<typeof wowRaidDiffSchema>
export type WowItemTrackName = z.infer<typeof wowItemTrackNameSchema>
export type WowItemSlot = z.infer<typeof wowItemSlotSchema>
export type WowItemSlotKey = z.infer<typeof wowItemSlotKeySchema>
export type WowItemEquippedSlotKey = z.infer<typeof wowItemEquippedSlotKeySchema>
export type WowArmorType = z.infer<typeof wowArmorTypeSchema>
export type WoWRole = z.infer<typeof wowRolesSchema>
export type WoWRolePosition = z.infer<typeof wowRolePositionSchema>
export type WowTiersetSlot = z.infer<typeof wowItemSlotKeyTiersetSchema>

export type Player = z.infer<typeof playerSchema>
export type PlayerWithCharacters = z.infer<typeof playerWithCharacterSchema>
export type NewPlayer = z.infer<typeof newPlayerSchema>
export type EditPlayer = z.infer<typeof editPlayerSchema>

export type Character = z.infer<typeof characterSchema>
export type CharacterGameInfo = z.infer<typeof characterGameInfoSchema>
export type CharacterWithPlayer = z.infer<typeof characterWithPlayerSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>
export type EditCharacter = z.infer<typeof editCharacterSchema>
export type CharacterWithGears = z.infer<typeof characterWithGears>
export type CharacterWithProgression = z.infer<typeof characterWithProgressionSchema>
export type CharacterWowAudit = z.infer<typeof charWowAuditSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type DroptimizerUpgrade = z.infer<typeof droptimizerUpgradeSchema>
export type DroptimizerCurrencies = z.infer<typeof droptimizerCurrenciesSchema>

export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>
export type NewDroptimizerUpgrade = z.infer<typeof newDroptimizerUpgradeSchema>
export type RaidbotsURL = z.infer<typeof raidbotsURLSchema>

export type Item = z.infer<typeof itemSchema>
export type ItemNote = z.infer<typeof itemNoteSchema>
export type ItemTrack = z.infer<typeof itemTrackSchema>
export type GearItem = z.infer<typeof gearItemSchema>

export type ItemToTierset = z.infer<typeof itemToTiersetSchema>
export type ItemToCatalyst = z.infer<typeof itemToCatalystSchema>

// bis list
export type BisList = z.infer<typeof bisListSchema>

// encounter
export type Boss = z.infer<typeof bossSchema>
export type BossWithItems = z.infer<typeof bossWithItemsSchema>

export type RaidSession = z.infer<typeof raidSessionSchema>
export type RaidSessionWithRoster = z.infer<typeof raidSessionWithRosterSchema>
export type RaidSessionWithSummary = z.infer<typeof raidSessionWithSummarySchema>
export type NewRaidSession = z.infer<typeof newRaidSessionSchema>
export type EditRaidSession = z.infer<typeof editRaidSessionSchema>

// Raid loots
export type Loot = z.infer<typeof lootSchema>
export type LootWithItem = z.infer<typeof lootWithItemSchema>
export type LootWithAssigned = z.infer<typeof lootWithAssignedSchema>
export type NewLoot = z.infer<typeof newLootSchema>
export type NewLootManual = z.infer<typeof newLootManualSchema>
export enum TierSetCompletion {
    None = 0,
    OnePiece = 1,
    TwoPiece = 2,
    ThreePiece = 3,
    FourPiece = 4,
    FivePiece = 5
}

export enum DroptimizerWarn {
    None = 'none',
    Outdated = 'outdated',
    NotImported = 'missing'
}

export enum WowAuditWarn {
    None = 'none',
    Outdated = 'outdated',
    NotTracked = 'not-tracked'
}

export enum RaiderioWarn {
    None = 'none',
    Outdated = 'outdated',
    NotTracked = 'not-tracked'
}

export type CharacterSummary = {
    character: Character
    itemLevel: string
    weeklyChest: GearItem[]
    tierset: GearItem[]
    currencies: DroptimizerCurrencies[]
    warnDroptimizer: DroptimizerWarn
    warnWowAudit: WowAuditWarn
    warnRaiderio: RaiderioWarn
}

export type TierSetBonus = z.infer<typeof tierSetBonusSchema>
export type CharAssignmentHighlights = z.infer<typeof charAssignmentHighlightsSchema>

export type CharAssignmentInfo = {
    character: Character
    droptimizers: {
        upgrade: DroptimizerUpgrade | null // dps gain info
        itemEquipped: GearItem // item that is going to be replaced by the upgrade
        droptimizer: Droptimizer // droptimizer source
    }[]
    weeklyChest: GearItem[]
    tierset: GearItem[]
    bestItemsInSlot: GearItem[]
    bisForSpec: WowSpec[]
    alreadyGotIt: boolean
    warnDroptimizer: DroptimizerWarn
    warnWowAudit: WowAuditWarn
    warnRaiderio: RaiderioWarn
    highlights: CharAssignmentHighlights
}
export type LootAssignmentInfo = {
    loot: LootWithItem
    eligible: CharAssignmentInfo[]
}

// App config
export type AppSettings = z.infer<typeof appSettingsSchema>
