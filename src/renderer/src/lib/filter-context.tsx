import React, { createContext, ReactNode, useContext, useState } from 'react'
import { LootFilter } from './filters'

// Default filter state - you can customize this for your needs
const DEFAULT_FILTER: LootFilter = {
    selectedRaidDiff: 'Mythic',
    onlyUpgrades: false,
    minUpgrade: 0,
    showMains: true,
    showAlts: false,
    hideIfNoUpgrade: false,
    selectedSlots: [],
    selectedArmorTypes: [],
    selectedWowClassName: []
}

interface FilterContextType {
    filter: LootFilter
    updateFilter: (key: keyof LootFilter, value: any) => void
    resetFilter: () => void
    isFilterOpen: boolean
    setIsFilterOpen: (open: boolean) => void
    hasActiveFilters: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('useFilterContext must be used within a FilterProvider')
    }
    return context
}

interface FilterProviderProps {
    children: ReactNode
    defaultFilter?: Partial<LootFilter>
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children, defaultFilter = {} }) => {
    const [filter, setFilter] = useState<LootFilter>({
        ...DEFAULT_FILTER,
        ...defaultFilter
    })
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const updateFilter = (key: keyof LootFilter, value: any) => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    const resetFilter = () => {
        setFilter({ ...DEFAULT_FILTER, ...defaultFilter })
    }

    // Calculate if any filters are active
    const hasActiveFilters = React.useMemo(() => {
        const defaultWithOverrides = { ...DEFAULT_FILTER, ...defaultFilter }

        return (
            filter.selectedRaidDiff !== defaultWithOverrides.selectedRaidDiff ||
            filter.onlyUpgrades !== defaultWithOverrides.onlyUpgrades ||
            filter.minUpgrade !== defaultWithOverrides.minUpgrade ||
            filter.showMains !== defaultWithOverrides.showMains ||
            filter.showAlts !== defaultWithOverrides.showAlts ||
            filter.hideIfNoUpgrade !== defaultWithOverrides.hideIfNoUpgrade ||
            filter.selectedSlots.length > 0 ||
            filter.selectedArmorTypes.length > 0 ||
            filter.selectedWowClassName.length > 0
        )
    }, [filter, defaultFilter])

    return (
        <FilterContext.Provider
            value={{
                filter,
                updateFilter,
                resetFilter,
                isFilterOpen,
                setIsFilterOpen,
                hasActiveFilters
            }}
        >
            {children}
        </FilterContext.Provider>
    )
}
