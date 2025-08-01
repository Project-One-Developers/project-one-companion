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
import { Filter, LoaderCircle, X } from 'lucide-react'

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
        .flatMap(dropt =>
            (dropt.upgrades ?? []).map(upgrade => ({
                ...upgrade,
                droptimizer: {
                    url: dropt.url,
                    charInfo: dropt.charInfo,
                    simInfo: dropt.simInfo,
                    itemsEquipped: dropt.itemsEquipped
                }
            }))
        )
        .filter(upgrade => upgrade.item.id === item.id)
        .sort((a, b) => b.dps - a.dps)

    return (
        <div className="flex flex-row items-center gap-x-2">
            {itemDroptimizerUpgrades.map(upgrade => (
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
            return droptimizers.some(dropt =>
                (dropt.upgrades ?? []).some(upgrade => upgrade.item.id === item.id)
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
                        .map(item => (
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
export default function LootGains(): JSX.Element {
    const DEFAULT_FILTER: LootFilter = {
        selectedRaidDiff: 'Mythic',
        onlyUpgrades: false,
        minUpgrade: 1000,
        showMains: true,
        showAlts: false,
        hideIfNoUpgrade: true,
        selectedArmorTypes: [],
        selectedSlots: [],
        selectedWowClassName: []
    }

    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const {
        droptimizers,
        droptimizersIsLoading,
        raidLootTable: encounterList,
        raidLootTableIsLoading: encounterListIsLoading,
        charList,
        charIsLoading
    } = useRaidData(CURRENT_RAID_ID)

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const filteredDroptimizers = useMemo(() => {
        if (!droptimizers) return []
        return filterDroptimizer(droptimizers, charList, filter)
    }, [droptimizers, charList, filter])

    // Check if any filters are active (for visual indication)
    const hasActiveFilters = useMemo(() => {
        return (
            filter.selectedArmorTypes.length > 0 ||
            filter.selectedSlots.length > 0 ||
            filter.selectedWowClassName.length > 0 ||
            filter.onlyUpgrades ||
            !filter.showMains ||
            filter.showAlts ||
            !filter.hideIfNoUpgrade
        )
    }, [filter])

    if (encounterListIsLoading || droptimizersIsLoading || charIsLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4 justify-center">
                {encounterList
                    .sort((a, b) => a.order - b.order)
                    .map(boss => (
                        <BossPanel
                            key={boss.id}
                            boss={boss}
                            droptimizers={filteredDroptimizers}
                            diff={filter.selectedRaidDiff}
                            hideItemsWithoutDropt={filter.hideIfNoUpgrade}
                        />
                    ))}
            </div>

            {/* Floating Filter Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all duration-200 z-50 ${
                    hasActiveFilters
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
                title="Toggle Filters"
            >
                {isFilterOpen ? <X className="w-6 h-6" /> : <Filter className="w-6 h-6" />}
                {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {/* Filter Panel Overlay */}
            {isFilterOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsFilterOpen(false)}
                >
                    <div
                        className="fixed bottom-20 right-6 max-w-md max-h-[80vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <FiltersPanel
                            filter={filter}
                            updateFilter={updateFilter}
                            className="shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
