import { CURRENT_SEASON } from '@shared/consts/wow.consts'

/**
 * List of currency IDs that should not be displayed in the UI
 */
export const CURRENCY_BLACKLIST: number[] = [
    211516, // DF Spark of Awakening
    190453, // DF Season1 Spark
    204440, // DF Season2 Spark
    206959, // DF Season3 Spark
    197921, // DF Primal Infusion
    198048, // DF Titan Training Matrix I
    198056, // DF Titan Training Matrix II
    198058, // DF Titan Training Matrix III
    198059, // DF Titan Training Matrix IV
    198046, // DF Concentrated Primal Infusion
    204682, // DF Enchanted Wyrm's Shadowflame Crest
    2122, // DF Storm Sigil
    228338, // TWW Soul Sigil I
    228339, // TWW Soul Sigil II
    210221, // TWW Season 1 Pvp Forged Combatant's Heraldry
    211296, // TWW Season 1 Spark
    224069, // TWW Season Enchanted Weathered Harbinger Crest
    224072, // TWW Season 1 Enchanted Runed Harbinger Crest
    224073, // TWW Season 1 Enchanted Gilded Harbinger Crest
    1792, // PVP honor
    210233, // PVP Forged Gladiator's Heraldry
    210232, // PVP Forged Aspirant's Heraldry
    230936, // TWW Season 2 Enchanted Runed Undermine Crest
    230905, // TWW Season 2 Fractured Spark of Fortunes
    230906, // TWW Season 2 Spark of Fortunes
    3107, // TWW Season 2 Weathered Undermine Crest
    3108, // TWW Season 2 Carved Undermine Crest
    3109, // TWW Season 2 Runed Undermine Crest
    3110, // TWW Season 2 Gilded Undermine Crest
    230936, // TWW Season 2 Enchanted Runed Undermine Crest
    230935 // TWW Season 2 Enchanted Gilded Undermine Crest
]

/**
 * Checks if a currency ID is blacklisted
 */
export const isCurrencyBlacklisted = (currencyId: number): boolean => {
    return CURRENCY_BLACKLIST.includes(currencyId)
}

/**
 * Checks if a currency ID is relevant in this season
 */
export const isRelevantCurrency = (currencyId: number): boolean => {
    if (CURRENT_SEASON === 3) {
        if (
            currencyId === 3008 || // valorstone
            currencyId === 3269 || // catalyst
            currencyId === 3288 || // runed
            currencyId === 3290 // gilded
        ) {
            return true
        }
    }

    return false
}
