import { Droptimizer, WowArmorType, WowItemSlot, WowRaidDifficulty } from '@shared/types/types'
import { unixTimestampToRelativeDays } from './utils'

export type LootFilter = {
    selectedRaidDiff: WowRaidDifficulty
    onlyUpgrades: boolean
    minUpgrade: number
    olderThanDays: boolean
    maxDays: number
    selectedSlots: WowItemSlot[]
    selectedArmorTypes: WowArmorType[]
}

export function filterDroptimizer(droptimizers: Droptimizer[], filter: LootFilter): Droptimizer[] {
    const filterByDroptimizerFilters = droptimizers
        .sort((a, b) => b.simInfo.date - a.simInfo.date)
        .filter((dropt) => {
            // Filter by raid difficulty
            console.log(filter.selectedRaidDiff)
            if (filter.selectedRaidDiff.length > 0) {
                if (!filter.selectedRaidDiff.includes(dropt.raidInfo.difficulty)) {
                    return false
                }
            }

            // Filter droptimizer older than X days
            if (
                filter.olderThanDays &&
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
