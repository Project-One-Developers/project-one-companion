import { wowClassSchema, wowSpecSchema } from '@shared/schemas/wow.schemas'
import { z } from 'zod'

const specMappingSchema = z.record(
    z.number(),
    z.object({
        wowClass: wowClassSchema,
        wowSpec: wowSpecSchema
    })
)

export const SPEC_ID_TO_CLASS_SPEC = specMappingSchema.parse({
    // Death Knight
    250: { wowClass: 'DEATH_KNIGHT', wowSpec: 'BLOOD' },
    251: { wowClass: 'DEATH_KNIGHT', wowSpec: 'FROST_DK' },
    252: { wowClass: 'DEATH_KNIGHT', wowSpec: 'UNHOLY' },

    // Demon Hunter
    577: { wowClass: 'DEMON_HUNTER', wowSpec: 'HAVOC' },
    581: { wowClass: 'DEMON_HUNTER', wowSpec: 'VENGEANCE' },

    // Druid
    102: { wowClass: 'DRUID', wowSpec: 'BALANCE' },
    103: { wowClass: 'DRUID', wowSpec: 'FERAL' },
    104: { wowClass: 'DRUID', wowSpec: 'GUARDIAN' },
    105: { wowClass: 'DRUID', wowSpec: 'RESTO_DRUID' },

    // Evoker
    1467: { wowClass: 'EVOKER', wowSpec: 'DEVASTATION' },
    1468: { wowClass: 'EVOKER', wowSpec: 'PRESERVATION' },
    1473: { wowClass: 'EVOKER', wowSpec: 'AUGMENTATION' },

    // Hunter
    253: { wowClass: 'HUNTER', wowSpec: 'BEAST_MASTERY' },
    254: { wowClass: 'HUNTER', wowSpec: 'MARKSMANSHIP' },
    255: { wowClass: 'HUNTER', wowSpec: 'SURVIVAL' },

    // Mage
    62: { wowClass: 'MAGE', wowSpec: 'ARCANE' },
    63: { wowClass: 'MAGE', wowSpec: 'FIRE' },
    64: { wowClass: 'MAGE', wowSpec: 'FROST_MAGE' },

    // Monk
    268: { wowClass: 'MONK', wowSpec: 'BREWMASTER' },
    269: { wowClass: 'MONK', wowSpec: 'WINDWALKER' },
    270: { wowClass: 'MONK', wowSpec: 'MISTWEAVER' },

    // Paladin
    65: { wowClass: 'PALADIN', wowSpec: 'HOLY_PALADIN' },
    66: { wowClass: 'PALADIN', wowSpec: 'PROT_PALADIN' },
    70: { wowClass: 'PALADIN', wowSpec: 'RETRIBUTION' },

    // Priest
    256: { wowClass: 'PRIEST', wowSpec: 'DISCIPLINE' },
    257: { wowClass: 'PRIEST', wowSpec: 'HOLY_PRIEST' },
    258: { wowClass: 'PRIEST', wowSpec: 'SHADOW' },

    // Rogue
    259: { wowClass: 'ROGUE', wowSpec: 'ASSASSINATION' },
    260: { wowClass: 'ROGUE', wowSpec: 'OUTLAW' },
    261: { wowClass: 'ROGUE', wowSpec: 'SUBTLETY' },

    // Shaman
    262: { wowClass: 'SHAMAN', wowSpec: 'ELEMENTAL' },
    263: { wowClass: 'SHAMAN', wowSpec: 'ENHANCEMENT' },
    264: { wowClass: 'SHAMAN', wowSpec: 'RESTO_SHAMAN' },

    // Warlock
    265: { wowClass: 'WARLOCK', wowSpec: 'AFFLICTION' },
    266: { wowClass: 'WARLOCK', wowSpec: 'DEMONOLOGY' },
    267: { wowClass: 'WARLOCK', wowSpec: 'DESTRUCTION' },

    // Warrior
    71: { wowClass: 'WARRIOR', wowSpec: 'ARMS' },
    72: { wowClass: 'WARRIOR', wowSpec: 'FURY' },
    73: { wowClass: 'WARRIOR', wowSpec: 'PROT_WARRIOR' }
})

export type SpecIdMapping = z.infer<typeof specMappingSchema>
