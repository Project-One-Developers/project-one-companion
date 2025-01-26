import { getDroptimizerLastByCharAndDiff } from '@renderer/lib/tanstack-query/droptimizers'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { Character } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { DroptimizerCard } from './droptimizer-card'

type LastCharDroptimizersProps = {
    character: Character
}

export const LastCharDroptimizers = ({ character }: LastCharDroptimizersProps) => {
    const droptimizerHcQuery = useQuery({
        queryKey: [queryKeys.droptimizersLastByCharDiff, character.name, character.realm, 'Heroic'],
        queryFn: () => getDroptimizerLastByCharAndDiff(character.name, character.realm, 'Heroic')
    })
    const droptimizerMythicQuery = useQuery({
        queryKey: [queryKeys.droptimizersLastByCharDiff, character.name, character.realm, 'Mythic'],
        queryFn: () => getDroptimizerLastByCharAndDiff(character.name, character.realm, 'Mythic')
    })

    if (droptimizerHcQuery.isLoading || droptimizerMythicQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const hcDroptimizer = droptimizerHcQuery.data
    const mythicDroptimizer = droptimizerMythicQuery.data

    return (
        <div className="flex flex-col items-center relative">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {hcDroptimizer && <DroptimizerCard droptimizer={hcDroptimizer} />}
                {mythicDroptimizer && <DroptimizerCard droptimizer={mythicDroptimizer} />}
            </div>
        </div>
    )
}
