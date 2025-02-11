import { FiltersPanel } from '@renderer/components/filter-panel'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
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
    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, currentRaid],
        queryFn: () => fetchRaidLootTable(currentRaid)
    })

    return {
        droptimizers: droptimizerRes.data ?? [],
        droptimizersIsLoading: droptimizerRes.isLoading,
        encounterList: itemRes.data ?? [],
        encounterListIsLoading: itemRes.isLoading
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
                <div key={`${upgrade.id}`} className="flex flex-col items-center">
                    <WowSpecIcon
                        specId={upgrade.droptimizer.charInfo.specId}
                        className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                        title={
                            upgrade.droptimizer.charInfo.name +
                            ' - ' +
                            formatUnixTimestampToRelativeDays(upgrade.droptimizer.simInfo.date)
                        }
                    />
                    <p className="text-bold text-[11px]">{getDpsHumanReadable(upgrade.dps)}</p>
                </div>
            ))}
        </div>
    )
}

// Boss Card Component
const BossPanel = ({
    boss,
    droptimizers,
    diff
}: {
    boss: BossWithItems
    droptimizers: Droptimizer[]
    diff: WowRaidDifficulty
}) => {
    const bossHasDroptimizers = true
    // const bossHasDroptimizers = droptimizers.some((dropt) =>
    //     (dropt.upgrades ?? []).some((upgrade) => upgrade.item.bossId === boss.id)
    // )
    // const itemHasDroptimizers = function (item: Item): boolean {
    //     return droptimizers.some((dropt) =>
    //         (dropt.upgrades ?? []).some((upgrade) => upgrade.item.id === item.id)
    //     )
    // }

    // todo: re-enable with filter
    // eslint-disable-next-line
    const itemHasDroptimizers = function (_: Item): boolean {
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
                    boss.items.filter(itemHasDroptimizers).map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer"
                        >
                            <WowItemIcon
                                item={item}
                                iconOnly={false}
                                raidDiff={diff}
                                className=""
                                tierBanner={true}
                                iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
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
        olderThanDays: false,
        maxDays: 7,
        selectedArmorTypes: [],
        selectedSlots: []
    }

    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)

    const { droptimizers, droptimizersIsLoading, encounterList, encounterListIsLoading } =
        useRaidData(CURRENT_RAID_ID)

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const filteredDroptimizers = useMemo(() => {
        if (!droptimizers) return []
        return filterDroptimizer(droptimizers, filter)
    }, [droptimizers, filter])

    if (encounterListIsLoading || droptimizersIsLoading) {
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
                {encounterList.map((boss) => (
                    <BossPanel
                        key={boss.id}
                        boss={boss}
                        droptimizers={filteredDroptimizers}
                        diff={filter.selectedRaidDiff}
                    />
                ))}
            </div>
        </div>
    )
}
