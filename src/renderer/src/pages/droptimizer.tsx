import { DroptimizerCard } from '@renderer/components/droptimizer-card'
import DroptimizerNewDialog from '@renderer/components/droptimizer-new-dialog'
import { FiltersPanel } from '@renderer/components/filter-panel'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Filter, LoaderCircle, X } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'

// Default filter values
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

export default function DroptimizerPage(): JSX.Element {
    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const droptimizerQuery = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchLatestDroptimizers
    })
    const charQuery = useQuery({
        queryKey: [queryKeys.characters],
        queryFn: fetchCharacters
    })

    const filteredDroptimizers = useMemo(() => {
        if (!droptimizerQuery.data || !charQuery.data) return []
        return filterDroptimizer(droptimizerQuery.data, charQuery.data, filter)
    }, [droptimizerQuery.data, charQuery.data, filter])

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filter.selectedRaidDiff !== DEFAULT_FILTER.selectedRaidDiff ||
            filter.onlyUpgrades !== DEFAULT_FILTER.onlyUpgrades ||
            filter.minUpgrade !== DEFAULT_FILTER.minUpgrade ||
            filter.showMains !== DEFAULT_FILTER.showMains ||
            filter.showAlts !== DEFAULT_FILTER.showAlts ||
            filter.hideIfNoUpgrade !== DEFAULT_FILTER.hideIfNoUpgrade ||
            filter.selectedArmorTypes.length > 0 ||
            filter.selectedSlots.length > 0 ||
            filter.selectedWowClassName.length > 0
        )
    }, [filter])

    // Now the conditional return comes after all hooks
    if (droptimizerQuery.isLoading || charQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredDroptimizers.length > 0 ? (
                    filteredDroptimizers.map(dropt => (
                        <DroptimizerCard
                            key={dropt.url}
                            droptimizer={dropt}
                            character={charQuery.data?.find(c => c.name === dropt.charInfo.name)}
                        />
                    ))
                ) : (
                    <img
                        src="https://media1.tenor.com/m/md1_j1SnRSkAAAAd/brian-david-gilbert-nothing-here.gif"
                        alt="Empty"
                        width={400}
                        height={400}
                    />
                )}
            </div>

            {/* Floating Filter Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={clsx(
                    'fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
                    hasActiveFilters
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                )}
                title="Toggle Filters"
            >
                {isFilterOpen ? <X size={24} /> : <Filter size={24} />}
                {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
            </button>

            {/* Filter Panel Overlay */}
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />

                    {/* Filter Panel */}
                    <div className="fixed bottom-36 right-6 z-50 max-w-md w-100">
                        <FiltersPanel
                            filter={filter}
                            updateFilter={updateFilter}
                            showRaidDifficulty={true}
                            showDroptimizerFilters={true}
                            showClassFilter={true}
                            showSlotFilter={true}
                            showArmorTypeFilter={true}
                            className="shadow-2xl"
                        />
                    </div>
                </>
            )}

            {/* New Droptimizer Dialog Trigger */}
            <div className="fixed bottom-5 right-6">
                <DroptimizerNewDialog />
            </div>
        </div>
    )
}
