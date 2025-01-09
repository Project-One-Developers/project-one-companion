import { DroptimizerCard } from '@renderer/components/droptimizer-card'
import { FiltersPanel } from '@renderer/components/filter-panel'
import NewDroptimizerForm from '@renderer/components/new-droptimizer-form'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { formatWowWeek, unixTimestampToWowWeek } from '@renderer/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function DroptimizerPage(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
    })

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
                            <DroptimizerCard key={dropt.url} droptimizer={dropt} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}
