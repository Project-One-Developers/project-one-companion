import { DroptimizerCard } from '@renderer/components/droptimizer-card'
import DroptimizerNewDialog from '@renderer/components/droptimizer-new-dialog'
import { FiltersPanel } from '@renderer/components/filter-panel'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'

// Default filter values
const DEFAULT_FILTER: LootFilter = {
    selectedRaidDiff: 'Mythic',
    onlyUpgrades: false,
    minUpgrade: 1000,
    hideOlderThanDays: false,
    hideAlts: true,
    maxDays: 7,
    selectedArmorTypes: [],
    selectedSlots: []
}

export default function DroptimizerPage(): JSX.Element {
    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)
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

    if (droptimizerQuery.isLoading || charQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            <FiltersPanel filter={filter} updateFilter={updateFilter} />
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredDroptimizers.length > 0 ? (
                    filteredDroptimizers.map((dropt) => (
                        <DroptimizerCard key={dropt.url} droptimizer={dropt} />
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
            {/* Bottom right buttons */}
            <Widget />
        </div>
    )
}

const Widget = (): JSX.Element => (
    <div className="fixed bottom-6 right-6">
        <DroptimizerNewDialog />
    </div>
)
