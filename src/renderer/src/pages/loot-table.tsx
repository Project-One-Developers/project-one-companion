import { FiltersPanel } from '@renderer/components/filter-panel'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
import { formatUnixTimestampToRelativeDays, getDpsHumanReadable } from '@renderer/lib/utils'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { Boss, Droptimizer, Item, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

import { useMemo, useState, type JSX } from 'react'

// Custom hooks
const useRaidData = (currentRaid: number) => {
    const droptimizerRes = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
    })
    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, currentRaid],
        queryFn: () => fetchRaidLootTable(currentRaid)
    })

    return {
        droptimizers: droptimizerRes.data?.droptimizers ?? [],
        droptimizersIsLoading: droptimizerRes.isLoading,
        encounterList: itemRes.data ?? [],
        encounterListIsLoading: itemRes.isLoading
    }
}

// Boss Item Component
const BossItem = ({
    item,
    droptimizers,
    diff
}: {
    item: Item
    droptimizers: Droptimizer[]
    diff: WowRaidDifficulty
}) => (
    <div className="flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer">
        <WowItemIcon
            item={item}
            iconOnly={false}
            raidDiff={diff}
            className=""
            iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
        />
        {/* Character List with upgrade */}
        <div className="flex flex-row items-center gap-x-2">
            {droptimizers.map((dropt) => (
                <div key={`${item.id}-${dropt.url}`} className="flex flex-col items-center">
                    <WowSpecIcon
                        specId={dropt.charInfo.specId}
                        className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                        title={
                            dropt.charInfo.name +
                            ' - ' +
                            formatUnixTimestampToRelativeDays(dropt.simInfo.date)
                        }
                    />
                    <p className="text-bold text-[11px]">
                        {dropt.upgrades != null && dropt.upgrades.length > 0
                            ? getDpsHumanReadable(dropt.upgrades[0].dps)
                            : '?'}
                    </p>
                </div>
            ))}
        </div>
    </div>
)

// Boss Card Component
const BossPanel = ({
    boss,
    droptimizers,
    diff
}: {
    boss: Boss
    droptimizers: Droptimizer[]
    diff: WowRaidDifficulty
}) => {
    const getDroptimizersContainingItemId = (itemId: number): Droptimizer[] => {
        return droptimizers
            .filter(
                (droptimizer) =>
                    droptimizer.upgrades != null &&
                    droptimizer.upgrades.findIndex((up) => up.item.id === itemId) > -1
            )
            .sort((a, b) => {
                const aDps = a.upgrades?.[0].dps ?? 0
                const bDps = b.upgrades?.[0].dps ?? 0
                return bDps - aDps
            })
    }

    const itemsWithDroptimizers = boss.items.reduce(
        (acc, item) => {
            const itemDroptimizers = getDroptimizersContainingItemId(item.id)
            if (itemDroptimizers.length > 0) {
                acc.push({ item, itemDroptimizers: itemDroptimizers })
            }
            return acc
        },
        [] as { item: Item; itemDroptimizers: Droptimizer[] }[]
    )

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
                {itemsWithDroptimizers.length > 0 ? (
                    itemsWithDroptimizers.map(({ item, itemDroptimizers }) => (
                        <BossItem
                            key={item.id}
                            item={item}
                            droptimizers={itemDroptimizers}
                            diff={diff}
                        />
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
        onlyLatest: true,
        onlyUpgrades: false,
        minUpgrade: 1000,
        olderThanDays: false,
        maxDays: 7,
        selectedArmorTypes: [],
        selectedSlots: []
    }

    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)
    const currentRaid = 1273

    const { droptimizers, droptimizersIsLoading, encounterList, encounterListIsLoading } =
        useRaidData(currentRaid)

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
