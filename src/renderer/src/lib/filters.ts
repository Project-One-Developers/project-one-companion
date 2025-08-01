import {
    Character,
    Droptimizer,
    WowArmorType,
    WowClassName,
    WowItemSlotKey,
    WowRaidDifficulty
} from '@shared/types/types'

export type LootFilter = {
    selectedRaidDiff: WowRaidDifficulty
    onlyUpgrades: boolean
    minUpgrade: number
    showMains: boolean
    showAlts: boolean
    hideIfNoUpgrade: boolean
    selectedSlots: WowItemSlotKey[]
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
        .filter(dropt => {
            // Filter by raid difficulty
            if (filter.selectedRaidDiff.length > 0) {
                if (!filter.selectedRaidDiff.includes(dropt.raidInfo.difficulty)) {
                    return false
                }
            }

            // filter by main/alt selection
            const isMain = chars.some(
                c => c.name === dropt.charInfo.name && c.realm === dropt.charInfo.server && c.main
            )
            const isAlt = chars.some(
                c => c.name === dropt.charInfo.name && c.realm === dropt.charInfo.server && !c.main
            )

            // If this is a main character but mains are not shown
            if (isMain && !filter.showMains) {
                return false
            }

            // If this is an alt character but alts are not shown
            if (isAlt && !filter.showAlts) {
                return false
            }

            // filter by selected class
            if (
                filter.selectedWowClassName.length > 0 &&
                !filter.selectedWowClassName.includes(dropt.charInfo.class) // filter out char that doesnt match filter
            ) {
                return false
            }

            return true
        })

    // now filter remaining droptimizer by upgrade filter (eg: slot, dps, armor type)
    return (
        filterByDroptimizerFilters
            .map(dropt => {
                const upgrades = dropt.upgrades ?? []
                // Filter by upgrades
                const filteredUpgrades = upgrades.filter(upgrade => {
                    // Filter by upgrades
                    if (filter.onlyUpgrades && upgrade.dps < filter.minUpgrade) {
                        return false
                    }

                    // slot
                    if (filter.selectedSlots.length > 0) {
                        if (
                            upgrade.item.slot == null ||
                            !filter.selectedSlots.includes(upgrade.item.slotKey)
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
            .filter(
                dropt => !filter.hideIfNoUpgrade || (dropt.upgrades && dropt.upgrades.length > 0)
            )
    )
}
