import { useFilterContext } from '@renderer/lib/filter-context'
import clsx from 'clsx'
import { Filter, X } from 'lucide-react'
import React from 'react'
import { FiltersPanel } from './filter-panel'

interface GlobalFilterUIProps {
    showRaidDifficulty?: boolean
    showDroptimizerFilters?: boolean
    showMainsAlts?: boolean
    showClassFilter?: boolean
    showSlotFilter?: boolean
    showArmorTypeFilter?: boolean
    className?: string
}

export const GlobalFilterUI: React.FC<GlobalFilterUIProps> = ({
    showRaidDifficulty = true,
    showDroptimizerFilters = true,
    showMainsAlts = true,
    showClassFilter = true,
    showSlotFilter = true,
    showArmorTypeFilter = true,
    className
}) => {
    const { filter, updateFilter, isFilterOpen, setIsFilterOpen, hasActiveFilters } =
        useFilterContext()

    const toggleFilterPanel = () => setIsFilterOpen(!isFilterOpen)

    return (
        <>
            {/* Floating Filter Button */}
            <button
                onClick={toggleFilterPanel}
                className={clsx(
                    'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
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
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />
                    <div className="fixed bottom-24 right-6 z-50 max-w-md w-100">
                        <FiltersPanel
                            filter={filter}
                            updateFilter={updateFilter}
                            showRaidDifficulty={showRaidDifficulty}
                            showDroptimizerFilters={showDroptimizerFilters}
                            showMainsAlts={showMainsAlts}
                            showClassFilter={showClassFilter}
                            showSlotFilter={showSlotFilter}
                            showArmorTypeFilter={showArmorTypeFilter}
                            className={clsx('shadow-2xl', className)}
                        />
                    </div>
                </>
            )}
        </>
    )
}
