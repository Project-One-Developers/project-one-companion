import CharacterDialog from '@renderer/components/character-dialog'
import PlayerDeleteDialog from '@renderer/components/player-delete-dialog'
import PlayerDialog from '@renderer/components/player-dialog'
import DownloadCSV from '@renderer/components/shared/download-as-csv'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { CharacterOverviewIcon } from '@renderer/components/ui/wowcharacter-overview-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { CharacterSummary, Player } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Download, LoaderCircle, PlusIcon, UserRoundPlus, X } from 'lucide-react'

import { useMemo, useState, type JSX } from 'react'
import { fetchRosterSummary } from '../lib/tanstack-query/players'

type PlayerWithCharactersSummary = {
    id: string
    name: string
    charsSummary: CharacterSummary[]
}

type ItemLevelStats = {
    mean: number
    standardDeviation: number
    threshold: number
}

export default function RosterPage(): JSX.Element {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isNewCharDialogOpen, setIsNewCharDialogOpen] = useState(false)
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const characterQuery = useQuery({
        queryKey: [queryKeys.charactersSummary],
        queryFn: fetchRosterSummary
    })

    // Memoize the players construction
    const players: PlayerWithCharactersSummary[] = useMemo(() => {
        return (
            characterQuery.data?.reduce((acc, charSummary) => {
                const player = charSummary.character.player

                // Find existing player in accumulator
                const existingPlayer = acc.find(p => p.id === player.id)

                if (existingPlayer) {
                    // Add character summary to existing player
                    existingPlayer.charsSummary.push(charSummary)
                } else {
                    // Create new player with this character summary
                    acc.push({
                        ...player,
                        charsSummary: [charSummary]
                    })
                }

                return acc
            }, [] as PlayerWithCharactersSummary[]) ?? []
        )
    }, [characterQuery.data])

    // Calculate item level statistics for all characters
    const itemLevelStats: ItemLevelStats = useMemo(() => {
        const allCharacters = players.flatMap(player => player.charsSummary)
        const validItemLevels = allCharacters
            .map(char => parseInt(char.itemLevel))
            .filter(level => !isNaN(level) && level > 0)

        if (validItemLevels.length === 0) {
            return { mean: 0, standardDeviation: 0, threshold: 0 }
        }

        // Calculate mean
        const mean = validItemLevels.reduce((sum, level) => sum + level, 0) / validItemLevels.length

        // Calculate standard deviation
        const variance =
            validItemLevels.reduce((sum, level) => sum + Math.pow(level - mean, 2), 0) /
            validItemLevels.length
        const standardDeviation = Math.sqrt(variance)

        // Define threshold: characters more than 1 standard deviation below mean are considered "low"
        // You can adjust this multiplier (1.0) to be more or less strict
        const threshold = mean - 1.0 * standardDeviation

        return { mean, standardDeviation, threshold }
    }, [players])

    // Function to determine if a character has low item level
    const isLowItemLevel = (itemLevel: string): boolean => {
        const level = parseInt(itemLevel)
        return !isNaN(level) && level < itemLevelStats.threshold
    }

    // Prepare CSV data
    const csvData = useMemo(() => {
        return players.flatMap(player =>
            player.charsSummary.map(charSummary => ({
                'Player Name': player.name,
                'Character Name': charSummary.character.name,
                'Character Realm': charSummary.character.realm,
                'Character Item Level': charSummary.itemLevel,
                'Tierset Set': charSummary.tierset.length,
                'Raider.io URL': `https://raider.io/characters/eu/${charSummary.character.realm}/${charSummary.character.name}`
            }))
        )
    }, [players])

    if (characterQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    // Filter players based on the search query
    const filteredPlayers = players
        .sort((a, b) => a.name.localeCompare(b.name)) // sort player by name
        .filter(player => {
            const playerMatches =
                player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                player.charsSummary
                    ?.map(cs => cs.character)
                    .some(character =>
                        character.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
            return playerMatches
        })

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
            {/* Search Bar with External Icons */}
            <div className="w-full mb-4 flex items-center gap-4">
                <Input
                    type="text"
                    placeholder="Search players or characters..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md"
                />

                {/* External Site Icons */}
                <div className="flex items-center gap-2">
                    {/* Raider.io */}
                    <a
                        href="https://raider.io/guilds/eu/pozzo-delleternit%C3%A0/Project%20One"
                        rel="noreferrer"
                        target="_blank"
                        className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    >
                        <img
                            src="https://cdn.raiderio.net/images/mstile-150x150.png"
                            title="ProjectOne Raider.io"
                            className="hover:scale-125 ease-linear transition-transform"
                        />
                    </a>

                    {/* WarcraftLogs */}
                    <a
                        href="https://www.warcraftlogs.com/guild/reports-list/633223"
                        rel="noreferrer"
                        target="_blank"
                        className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    >
                        <img
                            src="https://assets.rpglogs.com/img/warcraft/favicon.png?v=4"
                            title="WoW Progress Guild Page"
                            className="hover:scale-125 ease-linear transition-transform"
                        />
                    </a>

                    {/* WoW Audit */}
                    <a
                        href="https://wowaudit.com/eu/pozzo-delleternit%C3%A0/project-one/main/roster"
                        rel="noreferrer"
                        target="_blank"
                        className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
                    >
                        <img
                            src="https://data.wowaudit.com/img/new-logo-icon.svg"
                            title="WoW Audit Guild Page"
                            className="hover:scale-125 ease-linear transition-transform"
                        />
                    </a>
                </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredPlayers.map(player => (
                    // Player Card
                    <div
                        key={player.id}
                        className="flex flex-col justify-between p-6 bg-muted h-[150px] w-[250px] rounded-lg relative"
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

                        <h2 className="font-black text-2xl mb-2">{player.name}</h2>
                        <div className="flex flex-row items-center">
                            {player.charsSummary && (
                                <CharacterOverviewIcon
                                    charsWithSummary={player.charsSummary}
                                    isLowItemLevel={isLowItemLevel}
                                />
                            )}
                            <div className="ml-5" onClick={() => handleNewCharClick(player)}>
                                <PlusIcon className="w-5 h-5 cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Buttons */}
            <div className="fixed bottom-5 right-6 flex flex-col gap-3 z-50">
                {/* Export CSV Button */}
                <DownloadCSV
                    title={
                        <button
                            className="w-14 h-14 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-lg transition-all duration-200 flex items-center justify-center"
                            title="Export Roster as CSV"
                        >
                            <Download className="w-6 h-6 hover:scale-110 ease-linear transition-transform" />
                        </button>
                    }
                    data={csvData}
                    filename="roster.csv"
                />

                {/* Add Player Button */}
                <button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="w-14 h-14 rounded-full bg-primary text-background hover:bg-primary/80 shadow-lg transition-all duration-200 flex items-center justify-center"
                    title="Add Player"
                >
                    <UserRoundPlus
                        className={clsx('w-6 h-6 hover:rotate-45 ease-linear transition-transform')}
                    />
                </button>
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
