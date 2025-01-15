import PlayerDeleteDialog from '@renderer/components/player-delete-dialog'
import PlayerForm from '@renderer/components/player-new-form'
import { AnimatedTooltip } from '@renderer/components/ui/animated-tooltip'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

import type { JSX } from 'react'

export default function RosterPage(): JSX.Element {
    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    return (
        <>
            {isLoading ? (
                <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                    <LoaderCircle className="animate-spin text-5xl" />
                </div>
            ) : (
                <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
                    <div className="flex flex-wrap gap-x-4 gap-y-4">
                        {data?.map((player) => (
                            <div
                                key={player.id}
                                className="flex flex-col justify-between p-6 bg-muted h-[150px] w-[300px] rounded-lg relative"
                            >
                                <PlayerDeleteDialog player={player} />
                                <h2 className="font-black text-2xl">{player.name}</h2>
                                {player.characters ? (
                                    <AnimatedTooltip
                                        player={player}
                                        items={[...player.characters]}
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                    <div className="absolute bottom-6 right-6">
                        <PlayerForm />
                    </div>
                </div>
            )}
        </>
    )
}
