import { DroptimizerCard } from '@renderer/components/droptimizer-card'
import { FiltersPanel } from '@renderer/components/filter-panel'
import NewDroptimizerForm from '@renderer/components/new-droptimizer-form'
import { filterDroptimizer, LootFilter } from '@renderer/lib/filters'
import { fetchDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'

// Default filter values
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

export default function DroptimizerPage(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.droptimizers],
        queryFn: fetchDroptimizers
    })

    const [filter, setFilters] = useState<LootFilter>(DEFAULT_FILTER)

    const updateFilter = (key: keyof LootFilter, value: unknown): void => {
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const filteredDroptimizers = useMemo(() => {
        if (!data?.droptimizers) return []
        return filterDroptimizer(data.droptimizers, filter)
    }, [data?.droptimizers, filter])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            <FiltersPanel filter={filter} updateFilter={updateFilter} />
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredDroptimizers.map((dropt) => (
                    <DroptimizerCard key={dropt.url} droptimizer={dropt} />
                ))}
            </div>
            {/* Bottom right buttons */}
            <Widget />
        </div>
    )
}

const Widget = (): JSX.Element => (
    <div className="absolute bottom-6 right-6">
        <NewDroptimizerForm />
    </div>
)
