import type { WowClass } from 'shared/types/types'

export const classIcon = new Map<WowClass, string>([
    ['Death Knight', 'https://wow.zamimg.com/images/wow/icons/medium/class_deathknight.jpg'],
    ['Demon Hunter', 'https://wow.zamimg.com/images/wow/icons/medium/class_demonhunter.jpg'],
    ['Druid', 'https://wow.zamimg.com/images/wow/icons/medium/class_druid.jpg'],
    ['Evoker', 'https://wow.zamimg.com/images/wow/icons/medium/class_evoker.jpg'],
    ['Hunter', 'https://wow.zamimg.com/images/wow/icons/medium/class_hunter.jpg'],
    ['Mage', 'https://wow.zamimg.com/images/wow/icons/medium/class_mage.jpg'],
    ['Monk', 'https://wow.zamimg.com/images/wow/icons/medium/class_monk.jpg'],
    ['Paladin', 'https://wow.zamimg.com/images/wow/icons/medium/class_paladin.jpg'],
    ['Priest', 'https://wow.zamimg.com/images/wow/icons/medium/class_priest.jpg'],
    ['Rogue', 'https://wow.zamimg.com/images/wow/icons/medium/class_rogue.jpg'],
    ['Shaman', 'https://wow.zamimg.com/images/wow/icons/medium/class_shaman.jpg'],
    ['Warlock', 'https://wow.zamimg.com/images/wow/icons/medium/class_warlock.jpg'],
    ['Warrior', 'https://wow.zamimg.com/images/wow/icons/medium/class_warrior.jpg']
])

// Map of specialization IDs to their corresponding icon file names
export const specIcon = new Map<number, string>([
    [250, 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_bloodpresence.jpg'], // Blood Death Knight
    [251, 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_frostpresence.jpg'], // Frost Death Knight
    [252, 'https://wow.zamimg.com/images/wow/icons/medium/spell_deathknight_unholypresence.jpg'], // Unholy Death Knight
    [577, 'https://wow.zamimg.com/images/wow/icons/medium/ability_demonhunter_specdps.jpg'], // Havoc Demon Hunter
    [581, 'https://wow.zamimg.com/images/wow/icons/medium/ability_demonhunter_spectank.jpg'], // Vengeance Demon Hunter
    [102, 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_starfall.jpg'], // Balance Druid
    [103, 'https://wow.zamimg.com/images/wow/icons/medium/ability_druid_catform.jpg'], // Feral Druid
    [104, 'https://wow.zamimg.com/images/wow/icons/medium/ability_racial_bearform.jpg'], // Guardian Druid
    [105, 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_healingtouch.jpg'], // Restoration Druid
    [253, 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_bestialdiscipline.jpg'], // Beast Mastery Hunter
    [254, 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_focusedaim.jpg'], // Marksmanship Hunter
    [255, 'https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_camouflage.jpg'], // Survival Hunter
    [62, 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_magicalsentry.jpg'], // Arcane Mage
    [63, 'https://wow.zamimg.com/images/wow/icons/medium/spell_fire_firebolt02.jpg'], // Fire Mage
    [64, 'https://wow.zamimg.com/images/wow/icons/medium/spell_frost_frostbolt02.jpg'], // Frost Mage
    [268, 'https://wow.zamimg.com/images/wow/icons/medium/spell_monk_brewmaster_spec.jpg'], // Brewmaster Monk
    [270, 'https://wow.zamimg.com/images/wow/icons/medium/spell_monk_mistweaver_spec.jpg'], // Mistweaver Monk
    [269, 'https://wow.zamimg.com/images/wow/icons/medium/spell_monk_windwalker_spec.jpg'], // Windwalker Monk
    [65, 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_holybolt.jpg'], // Holy Paladin
    [66, 'https://wow.zamimg.com/images/wow/icons/medium/ability_paladin_shieldofthetemplar.jpg'], // Protection Paladin
    [70, 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_auraoflight.jpg'], // Retribution Paladin
    [256, 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_powerwordshield.jpg'], // Discipline Priest
    [257, 'https://wow.zamimg.com/images/wow/icons/medium/spell_holy_guardianspirit.jpg'], // Holy Priest
    [258, 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_shadowwordpain.jpg'], // Shadow Priest
    [259, 'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_eviscerate.jpg'], // Assassination Rogue
    [260, 'https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_sinisterstrike.jpg'], // Outlaw Rogue
    [261, 'https://wow.zamimg.com/images/wow/icons/medium/ability_stealth.jpg'], // Subtlety Rogue
    [262, 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_lightning.jpg'], // Elemental Shaman
    [263, 'https://wow.zamimg.com/images/wow/icons/medium/spell_shaman_improvedstormstrike.jpg'], // Enhancement Shaman
    [264, 'https://wow.zamimg.com/images/wow/icons/medium/spell_nature_magicimmunity.jpg'], // Restoration Shaman
    [265, 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_deathcoil.jpg'], // Affliction Warlock
    [266, 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_metamorphosis.jpg'], // Demonology Warlock
    [267, 'https://wow.zamimg.com/images/wow/icons/medium/spell_shadow_rainoffire.jpg'], // Destruction Warlock
    [71, 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_savageblow.jpg'], // Arms Warrior
    [72, 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_innerrage.jpg'], // Fury Warrior
    [73, 'https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_defensivestance.jpg'], // Protection Warrior
    [1467, 'https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_devastation.jpg'], // Devastation Evoker
    [1468, 'https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_preservation.jpg'], // Preservation Evoker
    [1473, 'https://wow.zamimg.com/images/wow/icons/medium/classicon_evoker_augmentation.jpg'] // Augmentation Evoker
])

export const encounterIcon = new Map<number, string>([
    [2607, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/12/117772.webp'], // Ulgrax the Devourer
    [2611, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/165/117669.webp'], // The Bloodbound Horror
    [2599, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/33/116257.webp'], // Sikran, Captain of the Sureki
    [2609, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/132/118404.webp'], // Rasha'nan
    [2612, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/179/118963.webp'], // Broodtwister Ovi'nax
    [2601, 'https://wow.zamimg.com/modelviewer/live/webthumbs/npc/186/117946.webp'], // Nexus-Princess Ky'veza
    [
        2608,
        'https://assets2.mythictrap.com/nerubar-palace/background_finals/silken-court-custom.png'
    ], // The Silken Court
    [2602, 'https://wow.zamimg.com/modelviewer/beta/webthumbs/npc/213/119253.png'], // Queen Ansurek
    [-67, 'https://wow.zamimg.com/modelviewer/classic/webthumbs/npc/55/117047.webp'] // Trash Drop
])
