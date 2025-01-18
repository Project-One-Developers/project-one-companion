import { itemSchema, itemToCatalystSchema, itemToTiersetSchema } from '@shared/schemas/items.schema'
import {
    bossSchema,
    editRaidSessionSchema,
    newBossSchema,
    newRaidSessionSchema,
    raidSessionSchema
} from '@shared/schemas/raid.schemas'
import { appSettingsSchema } from '@shared/schemas/store.schemas'
import { z } from 'zod'
import {
    characterSchema,
    editCharacterSchema,
    editPlayerSchema,
    newCharacterSchema,
    newPlayerSchema,
    playerSchema
} from '../schemas/characters.schemas'
import {
    droptimizerSchema,
    droptimizerUpgradeSchema,
    newDroptimizerSchema,
    newDroptimizerUpgradeSchema,
    raidbotsURLSchema
} from '../schemas/simulations.schemas'
import {
    wowArmorTypeSchema,
    wowClassSchema,
    wowItemSlotSchema,
    wowRaidDiffSchema,
    wowRolesSchema
} from '../schemas/wow.schemas'

export type WowClass = z.infer<typeof wowClassSchema>
export type WowRaidDifficulty = z.infer<typeof wowRaidDiffSchema>
export type WowItemSlot = z.infer<typeof wowItemSlotSchema>
export type WowArmorType = z.infer<typeof wowArmorTypeSchema>
export type WoWRole = z.infer<typeof wowRolesSchema>

export type Player = z.infer<typeof playerSchema>
export type NewPlayer = z.infer<typeof newPlayerSchema>
export type EditPlayer = z.infer<typeof editPlayerSchema>

export type Character = z.infer<typeof characterSchema>
export type NewCharacter = z.infer<typeof newCharacterSchema>
export type EditCharacter = z.infer<typeof editCharacterSchema>

export type Droptimizer = z.infer<typeof droptimizerSchema>
export type DroptimizerUpgrade = z.infer<typeof droptimizerUpgradeSchema>
export type NewDroptimizer = z.infer<typeof newDroptimizerSchema>
export type NewDroptimizerUpgrade = z.infer<typeof newDroptimizerUpgradeSchema>
export type RaidbotsURL = z.infer<typeof raidbotsURLSchema>

export type Item = z.infer<typeof itemSchema>
export type ItemToTierset = z.infer<typeof itemToTiersetSchema>
export type ItemToCatalyst = z.infer<typeof itemToCatalystSchema>

export type Boss = z.infer<typeof bossSchema>
export type NewBoss = z.infer<typeof newBossSchema>

export type RaidSession = z.infer<typeof raidSessionSchema>
export type NewRaidSession = z.infer<typeof newRaidSessionSchema>
export type EditRaidSession = z.infer<typeof editRaidSessionSchema>

// App config
export type AppSettings = z.infer<typeof appSettingsSchema>
