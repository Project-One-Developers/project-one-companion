import CharacterDialog from '@renderer/components/character-dialog'
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
    const [isNewCharDialogOpen, setIsNewCharDialogOpen] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

    const characterQuery = useQuery({
        queryKey: [queryKeys.players],
        queryFn: fetchPlayers
    })

    if (characterQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const players = characterQuery.data ?? []

    const handleDeleteClick = (player: Player) => {
        setSelectedPlayer(player)
        setIsDeleteDialogOpen(true)
    }

    const handleNewCharClick = (player: Player) => {
        setSelectedPlayer(player)
        setIsNewCharDialogOpen(true)
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {players.map((player) => (
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
                        <div className="flex flex-row items-center">
                            {player.characters && (
                                <AnimatedTooltip items={[...player.characters]} />
                            )}
                            <div className="ml-5" onClick={() => handleNewCharClick(player)}>
                                <PlusIcon className="w-5 h-5 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Right Icons */}
            <div className="fixed bottom-6 right-6 space-y-2">
                <div
                    className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <img
                        src="https://cdn.raiderio.net/images/mstile-150x150.png"
                        title="Sync Raider.io"
                        className=" hover:scale-125 ease-linear transition-transform "
                    ></img>
                </div>
                <div
                    className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    onClick={() => window.api.syncWowAudit()}
                >
                    <img
                        src="https://data.wowaudit.com/img/new-logo-icon.svg"
                        title="Sync WowAudit"
                        className=" hover:scale-125 ease-linear transition-transform "
                    ></img>
                </div>
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
            {selectedPlayer && (
                <>
                    <PlayerDeleteDialog
                        isOpen={isDeleteDialogOpen}
                        setOpen={setIsDeleteDialogOpen}
                        player={selectedPlayer}
                    />
                    <CharacterDialog
                        isOpen={isNewCharDialogOpen}
                        setOpen={setIsNewCharDialogOpen}
                        mode="add"
                        player={selectedPlayer}
                    />
                </>
            )}
            <PlayerDialog isOpen={isAddDialogOpen} setOpen={setIsAddDialogOpen} />
        </div>
    )
}
