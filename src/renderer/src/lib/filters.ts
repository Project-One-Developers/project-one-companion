import {
    Character,
    Droptimizer,
    WowArmorType,
    WowClassName,
    WowItemSlot,
    WowRaidDifficulty
} from '@shared/types/types'
import { unixTimestampToRelativeDays } from './utils'

export type LootFilter = {
    selectedRaidDiff: WowRaidDifficulty
    onlyUpgrades: boolean
    minUpgrade: number
    hideOlderThanDays: boolean
    hideAlts: boolean
    maxDays: number
    selectedSlots: WowItemSlot[]
    selectedArmorTypes: WowArmorType[]
    selectedWowClassName: WowClassName[]
}

export function filterDroptimizer(
    droptimizers: Droptimizer[],
    chars: Character[],
    filter: LootFilter
): Droptimizer[] {
    const filterByDroptimizerFilters = droptimizers
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .filter((dropt) => {
            // Filter by raid difficulty
            if (filter.selectedRaidDiff.length > 0) {
                if (!filter.selectedRaidDiff.includes(dropt.raidInfo.difficulty)) {
                    return false
                }
            }

            // filter by all or main only
            if (
                filter.hideAlts &&
                chars.some(
                    (c) =>
                        c.name === dropt.charInfo.name &&
                        c.realm === dropt.charInfo.server &&
                        !c.main // filter out char explicity not main
                )
            ) {
                return false
            }

            // filter by selected class
            if (
                filter.selectedWowClassName.length > 0 &&
                !filter.selectedWowClassName.includes(dropt.charInfo.class) // filter out char that doesnt match filter
            ) {
                return false
            }

            // Filter droptimizer older than X days
            if (
                filter.hideOlderThanDays &&
                unixTimestampToRelativeDays(dropt.simInfo.date) > filter.maxDays
            ) {
                return false
            }

            return true
        })

    // now filter remaining droptimizer by upgrade filter (eg: slot, dps, armor type)
    return (
        filterByDroptimizerFilters
            .map((dropt) => {
                const upgrades = dropt.upgrades ?? []
                // Filter by upgrades
                const filteredUpgrades = upgrades.filter((upgrade) => {
                    // Filter by upgrades
                    if (filter.onlyUpgrades && upgrade.dps < filter.minUpgrade) {
                        return false
                    }

                    // slot
                    if (filter.selectedSlots.length > 0) {
                        if (
                            upgrade.item.slot == null ||
                            !filter.selectedSlots.includes(upgrade.item.slot)
                        ) {
                            return false
                        }
                    }

                    // armor type
                    // todo: back is considered cloth.. why?
                    if (filter.selectedArmorTypes.length > 0) {
                        if (
                            upgrade.item.armorType == null ||
                            !filter.selectedArmorTypes.includes(upgrade.item.armorType)
                        ) {
                            return false
                        }
                    }

                    return true
                })
                return {
                    ...dropt,
                    upgrades: filteredUpgrades
                }
            })
            // finally remove empty droptimizers
            .filter((dropt) => dropt.upgrades && dropt.upgrades.length > 0)
    )
}
