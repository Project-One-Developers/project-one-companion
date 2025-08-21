import { DroptimizerCard } from '@renderer/components/droptimizer-card'
import DroptimizerNewDialog from '@renderer/components/droptimizer-new-dialog'
import { filterDroptimizer } from '@renderer/lib/filters'
import { fetchLatestDroptimizers } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchCharacters } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useMemo, type JSX } from 'react'
import { GlobalFilterUI } from '../components/global-filter-ui'
import { useFilterContext } from '../lib/filter-context'

export default function DroptimizerPage(): JSX.Element {
    // Get global filter context
    const { filter } = useFilterContext()

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

    // Now the conditional return comes after all hooks
    if (droptimizerQuery.isLoading || charQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
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

            {/* Bottom Right Filter button */}
            <GlobalFilterUI
                showRaidDifficulty={true}
                showDroptimizerFilters={true}
                showClassFilter={true}
                showSlotFilter={true}
                showArmorTypeFilter={true}
            />

            {/* New Droptimizer Dialog Trigger, above the filter icon */}
            <div className="fixed bottom-24 right-6">
                <DroptimizerNewDialog />
            </div>
        </div>
    )
}
