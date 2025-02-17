import { WowClass } from '@shared/types/types'

export const WOW_CLASS_WITH_SPECS: WowClass[] = [
    {
        id: 1,
        name: 'Warrior',
        specs: [
            { id: 71, name: 'Arms' },
            { id: 72, name: 'Fury' },
            { id: 73, name: 'Protection' }
        ]
    },
    {
        id: 2,
        name: 'Paladin',
        specs: [
            { id: 65, name: 'Holy' },
            { id: 66, name: 'Protection' },
            { id: 70, name: 'Retribution' }
        ]
    },
    {
        id: 3,
        name: 'Hunter',
        specs: [
            { id: 253, name: 'Beast Mastery' },
            { id: 254, name: 'Marksmanship' },
            { id: 255, name: 'Survival' }
        ]
    },
    {
        id: 4,
        name: 'Rogue',
        specs: [
            { id: 259, name: 'Assassination' },
            { id: 260, name: 'Outlaw' },
            { id: 261, name: 'Subtlety' }
        ]
    },
    {
        id: 5,
        name: 'Priest',
        specs: [
            { id: 256, name: 'Discipline' },
            { id: 257, name: 'Holy' },
            { id: 258, name: 'Shadow' }
        ]
    },
    {
        id: 6,
        name: 'Death Knight',
        specs: [
            { id: 250, name: 'Blood' },
            { id: 251, name: 'Frost' },
            { id: 252, name: 'Unholy' }
        ]
    },
    {
        id: 7,
        name: 'Shaman',
        specs: [
            { id: 262, name: 'Elemental' },
            { id: 263, name: 'Enhancement' },
            { id: 264, name: 'Restoration' }
        ]
    },
    {
        id: 8,
        name: 'Mage',
        specs: [
            { id: 62, name: 'Arcane' },
            { id: 63, name: 'Fire' },
            { id: 64, name: 'Frost' }
        ]
    },
    {
        id: 9,
        name: 'Warlock',
        specs: [
            { id: 265, name: 'Affliction' },
            { id: 266, name: 'Demonology' },
            { id: 267, name: 'Destruction' }
        ]
    },
    {
        id: 10,
        name: 'Monk',
        specs: [
            { id: 268, name: 'Brewmaster' },
            { id: 269, name: 'Windwalker' },
            { id: 270, name: 'Mistweaver' }
        ]
    },
    {
        id: 11,
        name: 'Druid',
        specs: [
            { id: 102, name: 'Balance' },
            { id: 103, name: 'Feral' },
            { id: 104, name: 'Guardian' },
            { id: 105, name: 'Restoration' }
        ]
    },
    {
        id: 12,
        name: 'Demon Hunter',
        specs: [
            { id: 577, name: 'Havoc' },
            { id: 581, name: 'Vengeance' }
        ]
    },
    {
        id: 13,
        name: 'Evoker',
        specs: [
            { id: 1467, name: 'Devastation' },
            { id: 1468, name: 'Preservation' },
            { id: 1473, name: 'Augmentation' }
        ]
    }
]

export const SPEC_ID_TO_CLASS_SPEC = {
    // Death Knight
    250: { wowClass: 'Death Knight', wowSpec: 'Blood' },
    251: { wowClass: 'Death Knight', wowSpec: 'Frost' },
    252: { wowClass: 'Death Knight', wowSpec: 'Unholy' },

    // Demon Hunter
    577: { wowClass: 'Demon Hunter', wowSpec: 'Havoc' },
    581: { wowClass: 'Demon Hunter', wowSpec: 'Vengeance' },

    // Druid
    102: { wowClass: 'Druid', wowSpec: 'Balance' },
    103: { wowClass: 'Druid', wowSpec: 'Feral' },
    104: { wowClass: 'Druid', wowSpec: 'Guardian' },
    105: { wowClass: 'Druid', wowSpec: 'Restoration' },

    // Evoker
    1467: { wowClass: 'Evoker', wowSpec: 'Devastation' },
    1468: { wowClass: 'Evoker', wowSpec: 'Preservation' },
    1473: { wowClass: 'Evoker', wowSpec: 'Augmentation' },

    // Hunter
    253: { wowClass: 'Hunter', wowSpec: 'Beast Mastery' },
    254: { wowClass: 'Hunter', wowSpec: 'Marksmanship' },
    255: { wowClass: 'Hunter', wowSpec: 'Survival' },

    // Mage
    62: { wowClass: 'Mage', wowSpec: 'Arcane' },
    63: { wowClass: 'Mage', wowSpec: 'Fire' },
    64: { wowClass: 'Mage', wowSpec: 'Frost' },

    // Monk
    268: { wowClass: 'Monk', wowSpec: 'Brewmaster' },
    269: { wowClass: 'Monk', wowSpec: 'Windwalker' },
    270: { wowClass: 'Monk', wowSpec: 'Mistweaver' },

    // Paladin
    65: { wowClass: 'Paladin', wowSpec: 'Holy' },
    66: { wowClass: 'Paladin', wowSpec: 'Protection' },
    70: { wowClass: 'Paladin', wowSpec: 'Retribution' },

    // Priest
    256: { wowClass: 'Priest', wowSpec: 'Discipline' },
    257: { wowClass: 'Priest', wowSpec: 'Holy' },
    258: { wowClass: 'Priest', wowSpec: 'Shadow' },

    // Rogue
    259: { wowClass: 'Rogue', wowSpec: 'Assassination' },
    260: { wowClass: 'Rogue', wowSpec: 'Outlaw' },
    261: { wowClass: 'Rogue', wowSpec: 'Subtlety' },

    // Shaman
    262: { wowClass: 'Shaman', wowSpec: 'Elemental' },
    263: { wowClass: 'Shaman', wowSpec: 'Enhancement' },
    264: { wowClass: 'Shaman', wowSpec: 'Restoration' },

    // Warlock
    265: { wowClass: 'Warlock', wowSpec: 'Affliction' },
    266: { wowClass: 'Warlock', wowSpec: 'Demonology' },
    267: { wowClass: 'Warlock', wowSpec: 'Destruction' },

    // Warrior
    71: { wowClass: 'Warrior', wowSpec: 'Arms' },
    72: { wowClass: 'Warrior', wowSpec: 'Fury' },
    73: { wowClass: 'Warrior', wowSpec: 'Protection' }
}
