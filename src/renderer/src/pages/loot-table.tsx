import { TooltipArrow } from '@radix-ui/react-tooltip'
import { FiltersPanel } from '@renderer/components/filter-panel'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { getDpsHumanReadable } from '@renderer/lib/utils'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { formatUnixTimestampToRelativeDays } from '@shared/libs/date/date-utils'
import { BossWithItems, Droptimizer, Item, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

import { useMemo, useState, type JSX } from 'react'

// Custom hooks
const useRaidData = (currentRaid: number) => {
    const droptimizerRes = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchLatestDroptimizers
    })
    const raidLootTable = useQuery({
        queryKey: [queryKeys.raidLootTable, currentRaid],
        queryFn: () => fetchRaidLootTable(currentRaid)
    })
    const charRes = useQuery({
        queryKey: [queryKeys.characters],
        queryFn: fetchCharacters
    })

    return {
        droptimizers: droptimizerRes.data ?? [],
        droptimizersIsLoading: droptimizerRes.isLoading,
        raidLootTable: raidLootTable.data ?? [],
        raidLootTableIsLoading: raidLootTable.isLoading,
        charList: charRes.data ?? [],
        charIsLoading: charRes.isLoading
    }
}

type DroptimizersForItemsProps = {
    item: Item
    droptimizers: Droptimizer[]
    showUpgradeItem?: boolean
}

export const DroptimizersForItem = ({ item, droptimizers }: DroptimizersForItemsProps) => {
    const itemDroptimizerUpgrades = droptimizers
        .flatMap((dropt) =>
            (dropt.upgrades ?? []).map((upgrade) => ({
                ...upgrade,
                droptimizer: {
                    url: dropt.url,
                    charInfo: dropt.charInfo,
                    simInfo: dropt.simInfo,
                    itemsEquipped: dropt.itemsEquipped
                }
            }))
        )
        .filter((upgrade) => upgrade.item.id === item.id)
        .sort((a, b) => b.dps - a.dps)

    return (
        <div className="flex flex-row items-center gap-x-2">
            {itemDroptimizerUpgrades.map((upgrade) => (
                <div key={`${upgrade.id}`}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex flex-col items-center">
                                <WowSpecIcon
                                    specId={upgrade.droptimizer.charInfo.specId}
                                    className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                />
                                <p className="text-bold text-[11px]">
                                    {getDpsHumanReadable(upgrade.dps)}
                                </p>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="TooltipContent" sideOffset={5}>
                            {upgrade.droptimizer.charInfo.name +
                                ' - ' +
                                formatUnixTimestampToRelativeDays(upgrade.droptimizer.simInfo.date)}
                            <TooltipArrow className="TooltipArrow" />
                        </TooltipContent>
                    </Tooltip>
                </div>
            ))}
        </div>
    )
}

// Boss Card Component
const BossPanel = ({
    boss,
    droptimizers,
    diff,
    hideItemsWithoutDropt
}: {
    boss: BossWithItems
    droptimizers: Droptimizer[]
    diff: WowRaidDifficulty
    hideItemsWithoutDropt: boolean
}) => {
    const bossHasDroptimizers = true
    // const bossHasDroptimizers = droptimizers.some((dropt) =>
    //     (dropt.upgrades ?? []).some((upgrade) => upgrade.item.bossId === boss.id)
    // )

    const itemHasDroptimizers = function (item: Item): boolean {
        if (hideItemsWithoutDropt) {
            return droptimizers.some((dropt) =>
                (dropt.upgrades ?? []).some((upgrade) => upgrade.item.id === item.id)
            )
        }
        return true
    }

    return (
        <div className="flex flex-col bg-muted rounded-lg overflow-hidden min-w-[250px]">
            {/* Boss header: cover + name */}
            <div className="flex flex-col gap-y-2">
                <img
                    src={encounterIcon.get(boss.id)}
                    alt={`${boss.name} icon`}
                    className="w-full h-32 object-scale-down"
                />
                <h2 className="text-center text-xs font-bold">{boss.name}</h2>
            </div>
            {/* Boss items */}
            <div className="flex flex-col gap-y-3 p-6">
                {bossHasDroptimizers ? (
                    boss.items
                        .sort((a, b) => a.id - b.id)
                        .filter(itemHasDroptimizers)
                        .map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer"
                            >
                                <WowItemIcon
                                    item={item}
                                    iconOnly={false}
                                    raidDiff={diff}
                                    tierBanner={true}
                                />
                                <div className="flex flex-row items-center gap-x-2">
                                    <DroptimizersForItem item={item} droptimizers={droptimizers} />
                                </div>
                            </div>
                        ))
                ) : (
                    <p className="text-center text-sm text-gray-500">No upgrades available</p>
                )}
            </div>
        </div>
    )
}

// Main Component
export default function LootTable(): JSX.Element {
    const DEFAULT_FILTER: LootFilter = {
        selectedRaidDiff: 'Mythic',
        onlyUpgrades: false,
        minUpgrade: 1000,
        hideOlderThanDays: false,
        hideAlts: true,
        hideIfNoUpgrade: true,
        maxDays: 7,
        selectedArmorTypes: [],
        selectedSlots: [],
        selectedWowClassName: []
    }

    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)

    const {
        droptimizers,
        droptimizersIsLoading,
        raidLootTable: encounterList,
        raidLootTableIsLoading: encounterListIsLoading,
        charList,
        charIsLoading
    } = useRaidData(CURRENT_RAID_ID)

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const filteredDroptimizers = useMemo(() => {
        if (!droptimizers) return []
        return filterDroptimizer(droptimizers, charList, filter)
    }, [droptimizers, charList, filter])

    if (encounterListIsLoading || droptimizersIsLoading || charIsLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Filter */}
            <FiltersPanel filter={filter} updateFilter={updateFilter} />
            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {encounterList
                    .sort((a, b) => a.order - b.order)
                    .map((boss) => (
                        <BossPanel
                            key={boss.id}
                            boss={boss}
                            droptimizers={filteredDroptimizers}
                            diff={filter.selectedRaidDiff}
                            hideItemsWithoutDropt={filter.hideIfNoUpgrade}
                        />
                    ))}
            </div>
        </div>
    )
}
