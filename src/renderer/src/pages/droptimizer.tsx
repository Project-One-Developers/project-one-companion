import { FiltersPanel } from '@renderer/components/filter-panel'
import NewDroptimizerForm from '@renderer/components/new-droptimizer-form'
import { WowheadLink } from '@renderer/components/ui/wowhead-link'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/raid'
import {
    formatWowWeek,
    getDpsHumanReadable,
    unitTimestampToRelativeDays,
    unixTimestampToWowWeek
} from '@renderer/lib/utils'
import { Item } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function DroptimizerPage(): JSX.Element {
    const res = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
    })
    const data = res.data
    const isLoading = res.isLoading

    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, 1273],
        queryFn: () => fetchRaidLootTable(1273)
        //select: (data) => data.map((boss) => boss.items)
    })
    const raidItems: Item[] = itemRes.data?.flatMap((boss) => boss.items) ?? []
    const raidItemsIsLoading = itemRes.isLoading

    // Filters state
    const [filters, setFilters] = useState({
        raidDiff: 'all',
        onlyLatest: true,
        currentWeek: false,
        onlyUpgrades: false
    })

    const updateFilter = (key: string, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    // Compute filtered data
    const filteredDroptimizers = useMemo(() => {
        if (!data?.droptimizers) return []

        // Using a Map to track the latest droptimizer for each characterName
        const latestDroptimizersMap = new Map()

        return data.droptimizers
            .sort((a, b) => b.simInfo.date - a.simInfo.date)
            .filter((dropt) => {
                // Filter by raid difficulty
                if (filters.raidDiff !== 'all' && dropt.raidInfo.difficulty !== filters.raidDiff) {
                    return false
                }

                // Filter by current week
                if (
                    filters.currentWeek &&
                    unixTimestampToWowWeek(dropt.simInfo.date) !== unixTimestampToWowWeek()
                ) {
                    return false
                }

                // Filter by upgrades
                if (filters.onlyUpgrades && (!dropt.upgrades || dropt.upgrades.length === 0)) {
                    return false
                }

                // Works only if the droptimizer array is sorted by dropt.simInfo.date desc
                if (filters.onlyLatest) {
                    const existingDropt = latestDroptimizersMap.get(dropt.ak)
                    if (!existingDropt || dropt.simInfo.date > existingDropt.simInfo.date) {
                        latestDroptimizersMap.set(dropt.ak, dropt)
                    } else {
                        return false
                    }
                }

                return true
            })
    }, [data, filters])

    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative ">
                    <div className="grid grid-cols- w-full items-center">
                        <div></div>
                        <h1 className="mx-auto text-3xl font-bold">Droptimizer</h1>
                        <div className="flex items-center justify-center absolute bottom-6 right-6">
                            <NewDroptimizerForm />
                        </div>
                        {/* WoW Reset Info */}
                        <div className="flex items-center justify-center absolute bottom-6 right-20">
                            <p className="">
                                <strong>WoW Reset:</strong> {formatWowWeek()} (
                                {unixTimestampToWowWeek()})
                            </p>
                        </div>
                    </div>
                    {/* Filter Panel */}
                    <div className="w-full">
                        <FiltersPanel filters={filters} updateFilter={updateFilter} />
                    </div>
                    {/* Droptimizer Panel */}
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {filteredDroptimizers.map((dropt) => (
                            <div
                                key={dropt.url}
                                className="flex flex-col justify-between p-6 bg-muted h-[230px] w-[300px] rounded-lg relative"
                            >
                                <div className="flex items-center space-x-3">
                                    <WowSpecIcon
                                        specId={dropt.charInfo.specId}
                                        className="object-cover object-top rounded-md full h-10 w-10 border border-background"
                                    />
                                    <h2 className="font-black">{dropt.charInfo.name}</h2>
                                </div>
                                <div className="text-sm text-gray-600 mt-3">
                                    <p>
                                        <strong>Raid Difficulty:</strong>{' '}
                                        {dropt.raidInfo.difficulty}
                                    </p>
                                    <p>
                                        <strong>Fight Style:</strong> {dropt.simInfo.fightstyle}(
                                        {dropt.simInfo.nTargets}) {dropt.simInfo.duration} sec
                                    </p>
                                    <p title={new Date(dropt.simInfo.date * 1000).toLocaleString()}>
                                        <strong>Date: </strong>
                                        {unitTimestampToRelativeDays(dropt.simInfo.date)}
                                    </p>
                                    <p>
                                        <strong>Upgrades:</strong> {dropt.upgrades?.length}
                                    </p>
                                </div>
                                {dropt.upgrades && !raidItemsIsLoading ? (
                                    <div className={'flex items-center gap-3 mt-1'}>
                                        {dropt.upgrades
                                            .sort((a, b) => b.dps - a.dps)
                                            .slice(0, 6)
                                            .map((upgrade) => {
                                                // Lookup the item in the raidItems array
                                                const foundItem = raidItems.find(
                                                    (item) => item.id === upgrade.itemId
                                                )
                                                return (
                                                    <div
                                                        className="-mr-4 relative group"
                                                        key={upgrade.itemId}
                                                    >
                                                        {foundItem ? (
                                                            <WowItemIcon
                                                                item={foundItem}
                                                                iconOnly={true}
                                                                raidDiff="Heroic"
                                                                catalystBanner={
                                                                    upgrade.catalyzedItemId !== null
                                                                }
                                                                className="mt-2"
                                                                iconClassName={
                                                                    'object-cover object-top rounded-full h-10 w-10 border border-background'
                                                                }
                                                            />
                                                        ) : (
                                                            // Quando non esite mapping sul nostro db -> ricorro a wowhead
                                                            <WowheadLink
                                                                itemId={upgrade.itemId}
                                                                specId={dropt.charInfo.specId}
                                                                iconOnly={true}
                                                                className={
                                                                    ' border-red-50 h-30 w-10 '
                                                                }
                                                                data-wh-icon-size="medium"
                                                            />
                                                        )}
                                                        <p className="text-xs text-gray-600 text-center">
                                                            <strong>
                                                                {getDpsHumanReadable(upgrade.dps)}
                                                            </strong>
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">No upgrades available.</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
