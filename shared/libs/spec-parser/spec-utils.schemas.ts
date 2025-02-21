import { WowClass } from '@shared/types/types'

export const WOW_CLASS_WITH_SPECS: WowClass[] = [
    {
        id: 1,
        name: 'Warrior',
        specs: [
            { id: 71, name: 'Arms', role: 'DPS', position: 'Melee' },
            { id: 72, name: 'Fury', role: 'DPS', position: 'Melee' },
            { id: 73, name: 'Protection', role: 'Tank', position: 'Melee' }
        ]
    },
    {
        id: 2,
        name: 'Paladin',
        specs: [
            { id: 65, name: 'Holy', role: 'Healer', position: 'Melee' },
            { id: 66, name: 'Protection', role: 'Tank', position: 'Melee' },
            { id: 70, name: 'Retribution', role: 'DPS', position: 'Melee' }
        ]
    },
    {
        id: 3,
        name: 'Hunter',
        specs: [
            { id: 253, name: 'Beast Mastery', role: 'DPS', position: 'Ranged' },
            { id: 254, name: 'Marksmanship', role: 'DPS', position: 'Ranged' },
            { id: 255, name: 'Survival', role: 'DPS', position: 'Melee' }
        ]
    },
    {
        id: 4,
        name: 'Rogue',
        specs: [
            { id: 259, name: 'Assassination', role: 'DPS', position: 'Melee' },
            { id: 260, name: 'Outlaw', role: 'DPS', position: 'Melee' },
            { id: 261, name: 'Subtlety', role: 'DPS', position: 'Melee' }
        ]
    },
    {
        id: 5,
        name: 'Priest',
        specs: [
            { id: 256, name: 'Discipline', role: 'Healer', position: 'Ranged' },
            { id: 257, name: 'Holy', role: 'Healer', position: 'Ranged' },
            { id: 258, name: 'Shadow', role: 'DPS', position: 'Ranged' }
        ]
    },
    {
        id: 6,
        name: 'Death Knight',
        specs: [
            { id: 250, name: 'Blood', role: 'Tank', position: 'Melee' },
            { id: 251, name: 'Frost', role: 'DPS', position: 'Melee' },
            { id: 252, name: 'Unholy', role: 'DPS', position: 'Melee' }
        ]
    },
    {
        id: 7,
        name: 'Shaman',
        specs: [
            { id: 262, name: 'Elemental', role: 'DPS', position: 'Ranged' },
            { id: 263, name: 'Enhancement', role: 'DPS', position: 'Melee' },
            { id: 264, name: 'Restoration', role: 'Healer', position: 'Ranged' }
        ]
    },
    {
        id: 8,
        name: 'Mage',
        specs: [
            { id: 62, name: 'Arcane', role: 'DPS', position: 'Ranged' },
            { id: 63, name: 'Fire', role: 'DPS', position: 'Ranged' },
            { id: 64, name: 'Frost', role: 'DPS', position: 'Ranged' }
        ]
    },
    {
        id: 9,
        name: 'Warlock',
        specs: [
            { id: 265, name: 'Affliction', role: 'DPS', position: 'Ranged' },
            { id: 266, name: 'Demonology', role: 'DPS', position: 'Ranged' },
            { id: 267, name: 'Destruction', role: 'DPS', position: 'Ranged' }
        ]
    },
    {
        id: 10,
        name: 'Monk',
        specs: [
            { id: 268, name: 'Brewmaster', role: 'Tank', position: 'Melee' },
            { id: 269, name: 'Windwalker', role: 'DPS', position: 'Melee' },
            { id: 270, name: 'Mistweaver', role: 'Healer', position: 'Melee' }
        ]
    },
    {
        id: 11,
        name: 'Druid',
        specs: [
            { id: 102, name: 'Balance', role: 'DPS', position: 'Ranged' },
            { id: 103, name: 'Feral', role: 'DPS', position: 'Melee' },
            { id: 104, name: 'Guardian', role: 'Tank', position: 'Melee' },
            { id: 105, name: 'Restoration', role: 'DPS', position: 'Ranged' }
        ]
    },
    {
        id: 12,
        name: 'Demon Hunter',
        specs: [
            { id: 577, name: 'Havoc', role: 'DPS', position: 'Melee' },
            { id: 581, name: 'Vengeance', role: 'Tank', position: 'Melee' }
        ]
    },
    {
        id: 13,
        name: 'Evoker',
        specs: [
            { id: 1467, name: 'Devastation', role: 'DPS', position: 'Ranged' },
            { id: 1468, name: 'Preservation', role: 'Healer', position: 'Ranged' },
            { id: 1473, name: 'Augmentation', role: 'DPS', position: 'Ranged' }
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
