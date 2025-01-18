import PlayerDeleteDialog from '@renderer/components/player-delete-dialog'
import PlayerDialog from '@renderer/components/player-dialog'
import { AnimatedTooltip } from '@renderer/components/ui/animated-tooltip'
import { Button } from '@renderer/components/ui/button'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchPlayers } from '@renderer/lib/tanstack-query/players'
import { Player } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { LoaderCircle, PlusIcon, X } from 'lucide-react'

import { useState, type JSX } from 'react'

export default function RosterPage(): JSX.Element {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const handleDeleteClick = (player: Player) => {
        setSelectedPlayer(player)
        setIsDeleteDialogOpen(true)
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {data?.map((player) => (
                    // Player Card
                    <div
                        key={player.id}
                        className="flex flex-col justify-between p-6 bg-muted h-[150px] w-[300px] rounded-lg relative"
                    >
                        {/* Top Right Menu */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-2"
                            onClick={() => handleDeleteClick(player)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <h2 className="font-black text-2xl">{player.name}</h2>
                        {player.characters ? (
                            <AnimatedTooltip player={player} items={[...player.characters]} />
                        ) : null}
                    </div>
                ))}
            </div>

            {/* Bottom Right Plus Icon */}
            <div className="absolute bottom-6 right-6">
                <div
                    className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <PlusIcon
                        className={clsx('w-5 h-5 hover:rotate-45 ease-linear transition-transform')}
                    />
                </div>
            </div>

            {/* Page Dialogs */}
            {selectedPlayer ? (
                <PlayerDeleteDialog
                    isOpen={isDeleteDialogOpen}
                    setOpen={setIsDeleteDialogOpen}
                    player={selectedPlayer}
                />
            ) : null}
            <PlayerDialog isOpen={isAddDialogOpen} setOpen={setIsAddDialogOpen} />
        </div>
    )
}
