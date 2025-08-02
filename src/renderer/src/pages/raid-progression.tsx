import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'
import { FiltersPanel } from '@renderer/components/filter-panel'
import { Input } from '@renderer/components/ui/input'
import { WowCharacterIcon } from '@renderer/components/ui/wowcharacter-icon'
import { LootFilter } from '@renderer/lib/filters'
import { fetchBosses } from '@renderer/lib/tanstack-query/bosses'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterProgression } from '@renderer/lib/tanstack-query/raid'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import {
    CharacterBossProgressionResponse,
    RaiderioEncounter
} from '@shared/schemas/raiderio.schemas'
import { Boss, Character, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Filter, LoaderCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState, type JSX } from 'react'

// Constants
const ROLE_PRIORITIES = {
    tank: 1,
    healer: 2,
    dps: 3,
    default: 4
} as const

const ROLE_COLORS = {
    tanks: 'text-blue-400',
    healers: 'text-green-400',
    dps: 'text-red-400'
} as const

// Types
type CharacterWithProgress = {
    character: Character
    encounter: RaiderioEncounter
}

type BossPanelProps = {
    boss: Boss
    rosterProgression: CharacterBossProgressionResponse[]
    selectedDifficulty: WowRaidDifficulty
    filteredPlayerNames: string[]
}

// Utility functions
const getRolePriority = (role: string): number => {
    return (
        ROLE_PRIORITIES[role.toLowerCase() as keyof typeof ROLE_PRIORITIES] ||
        ROLE_PRIORITIES.default
    )
}

const sortCharactersByRoleAndClass = <T extends { character: { role: string; class: string } }>(
    items: T[]
): T[] => {
    return items.sort((a, b) => {
        const rolePriorityA = getRolePriority(a.character.role)
        const rolePriorityB = getRolePriority(b.character.role)

        if (rolePriorityA !== rolePriorityB) {
            return rolePriorityA - rolePriorityB
        }

        return a.character.class.localeCompare(b.character.class)
    })
}

const groupCharactersByRole = <T extends { character: { role: string; class: string } }>(
    characters: T[]
): { tanks: T[]; healers: T[]; dps: T[] } => {
    const sorted = sortCharactersByRoleAndClass(characters)

    return {
        tanks: sorted.filter(char => char.character.role === 'Tank'),
        healers: sorted.filter(char => char.character.role === 'Healer'),
        dps: sorted.filter(char => char.character.role === 'DPS')
    }
}

const filterCharactersByBossProgress = (
    rosterProgression: CharacterBossProgressionResponse[],
    boss: Boss,
    selectedDifficulty: WowRaidDifficulty,
    filteredPlayerNames: string[],
    hasProgress: boolean
) => {
    return rosterProgression
        .map(characterData => {
            const { character, characterRaidProgress } = characterData

            // Filter by player names if search is active
            if (filteredPlayerNames?.length > 0 && !filteredPlayerNames.includes(character.name)) {
                return null
            }

            // Find the current tier raid progress
            const currentRaidProgress = characterRaidProgress.raidProgress.find(
                raidProgress => raidProgress.raid === boss.raiderioRaidSlug
            )

            if (!currentRaidProgress) {
                return hasProgress ? null : { character }
            }

            // Get encounters for the selected difficulty - now safe because we checked for undefined
            const difficultyKey =
                selectedDifficulty.toLowerCase() as keyof typeof currentRaidProgress.encountersDefeated
            const encounters = currentRaidProgress.encountersDefeated[difficultyKey] || []

            // Check if this boss was defeated
            const bossDefeated = encounters.find(
                encounter => encounter.slug === boss.raiderioEncounterSlug
            )

            const shouldInclude = hasProgress ? !!bossDefeated : !bossDefeated

            if (!shouldInclude) return null

            return hasProgress && bossDefeated
                ? { character, encounter: bossDefeated }
                : { character }
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
}

// Components
const CharacterTooltip = ({
    character,
    encounter
}: {
    character: Character
    encounter?: RaiderioEncounter | WowRaidDifficulty
}) => (
    <div className="flex flex-col gap-1 p-2 bg-gray-800 rounded text-xs">
        <div className="font-medium text-white">{character.name}</div>
        {encounter && typeof encounter === 'object' ? (
            <>
                <div className="text-green-400">Kills: {encounter.numKills}</div>
                <div className="text-gray-300">First kill ilvl: {encounter.itemLevel}</div>
                {encounter.firstDefeated && (
                    <div className="text-gray-400">
                        First Kill: {new Date(encounter.firstDefeated).toLocaleDateString()}
                    </div>
                )}
                {encounter.lastDefeated && (
                    <div className="text-gray-400">
                        Last Kill: {new Date(encounter.lastDefeated).toLocaleDateString()}
                    </div>
                )}
            </>
        ) : (
            <div className="text-red-400">Not defeated on {encounter}</div>
        )}
    </div>
)

const CharacterGrid = ({
    characters,
    title,
    color,
    selectedDifficulty,
    showRoleBadges = false,
    hasDefeatedBoss = false
}: {
    characters: CharacterWithProgress[] | Character[]
    title: string
    color: string
    selectedDifficulty?: WowRaidDifficulty
    showRoleBadges?: boolean
    hasDefeatedBoss?: boolean
}) => {
    if (characters.length === 0) return null

    return (
        <div>
            <h4 className={`text-xs font-semibold ${color} mb-2`}>{title}</h4>
            <div className="grid grid-cols-8 gap-2">
                {characters.map(item => {
                    const character = 'character' in item ? item.character : item
                    const encounter = 'encounter' in item ? item.encounter : undefined

                    return (
                        <Tooltip key={character.id}>
                            <TooltipTrigger asChild>
                                <div className="flex justify-center">
                                    <WowCharacterIcon
                                        character={character}
                                        showName={false}
                                        showTooltip={false}
                                        showMainIndicator={false}
                                        showRoleBadges={showRoleBadges && !hasDefeatedBoss} // Hide badges if they defeated the boss
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent className="TooltipContent" sideOffset={5}>
                                <CharacterTooltip
                                    character={character}
                                    encounter={encounter || selectedDifficulty}
                                />
                            </TooltipContent>
                        </Tooltip>
                    )
                })}
            </div>
        </div>
    )
}

const BossPanel = ({
    boss,
    rosterProgression,
    selectedDifficulty,
    filteredPlayerNames
}: BossPanelProps) => {
    // Get characters who have defeated this boss
    const charactersWithProgress = useMemo(() => {
        const characters = filterCharactersByBossProgress(
            rosterProgression,
            boss,
            selectedDifficulty,
            filteredPlayerNames,
            true
        ) as CharacterWithProgress[]

        return sortCharactersByRoleAndClass(characters)
    }, [boss, rosterProgression, selectedDifficulty, filteredPlayerNames])

    // Get characters who have NOT defeated this boss
    const charactersWithoutProgress = useMemo(() => {
        const characters = filterCharactersByBossProgress(
            rosterProgression,
            boss,
            selectedDifficulty,
            filteredPlayerNames,
            false
        )

        return sortCharactersByRoleAndClass(characters).map(item =>
            'character' in item ? item.character : item
        ) as Character[]
    }, [boss, rosterProgression, selectedDifficulty, filteredPlayerNames])

    // Group characters with progress by role
    const groupedCharactersWithProgress = useMemo(() => {
        return groupCharactersByRole(charactersWithProgress)
    }, [charactersWithProgress])

    // Calculate total roster size
    const totalRosterSize = useMemo(() => {
        if (filteredPlayerNames?.length > 0) {
            return rosterProgression.filter(({ character }) =>
                filteredPlayerNames.includes(character.name)
            ).length
        }
        return rosterProgression.length
    }, [rosterProgression, filteredPlayerNames])

    return (
        <div className="flex flex-col bg-muted rounded-lg overflow-hidden min-w-[280px]">
            {/* Boss header */}
            <div className="flex flex-col gap-y-2">
                <img
                    src={encounterIcon.get(boss.id)}
                    alt={`${boss.name} icon`}
                    className="w-full h-32 object-scale-down"
                />
                <h2 className="text-center text-xs font-bold">{boss.name}</h2>
            </div>

            {/* Character progression */}
            <div className="flex flex-col gap-y-3 p-4">
                <div className="text-xs text-center text-gray-400 mb-2">
                    {charactersWithProgress.length} / {totalRosterSize} defeated
                </div>

                {/* Characters who have defeated the boss - grouped by role */}
                {charactersWithProgress.length > 0 && (
                    <div className="flex flex-col gap-y-3">
                        <CharacterGrid
                            characters={groupedCharactersWithProgress.tanks}
                            title="Tanks"
                            color={ROLE_COLORS.tanks}
                            showRoleBadges={true}
                            hasDefeatedBoss={true} // These characters defeated the boss, so hide role badges
                        />
                        <CharacterGrid
                            characters={groupedCharactersWithProgress.healers}
                            title="Healers"
                            color={ROLE_COLORS.healers}
                            showRoleBadges={true}
                            hasDefeatedBoss={true} // These characters defeated the boss, so hide role badges
                        />
                        <CharacterGrid
                            characters={groupedCharactersWithProgress.dps}
                            title="DPS"
                            color={ROLE_COLORS.dps}
                            showRoleBadges={true}
                            hasDefeatedBoss={true} // These characters defeated the boss, so hide role badges
                        />
                    </div>
                )}

                {/* Characters who have NOT defeated the boss */}
                {charactersWithoutProgress.length > 0 && (
                    <div className="flex flex-col gap-y-2 mt-4">
                        <h3 className="text-xs font-semibold text-red-400">Not Defeated</h3>
                        <div className="grid grid-cols-8 gap-2 opacity-60">
                            {charactersWithoutProgress.map(character => (
                                <Tooltip key={character.id}>
                                    <TooltipTrigger asChild>
                                        <div className="flex justify-center grayscale">
                                            <WowCharacterIcon
                                                character={character}
                                                showTooltip={false}
                                                showRoleBadges={true} // Show role badges for characters who haven't defeated the boss
                                                showName={true}
                                                showMainIndicator={false}
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="TooltipContent" sideOffset={5}>
                                        <CharacterTooltip
                                            character={character}
                                            encounter={selectedDifficulty}
                                        />
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {charactersWithProgress.length === 0 && charactersWithoutProgress.length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-4">
                        No characters found
                    </div>
                )}
            </div>
        </div>
    )
}

export default function RaidProgressionPage(): JSX.Element {
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

    // Filter state
    const [filter, setFilter] = useState<LootFilter>({
        selectedRaidDiff: 'Mythic',
        onlyUpgrades: false,
        minUpgrade: 0,
        showMains: true,
        showAlts: false,
        hideIfNoUpgrade: false,
        selectedSlots: [],
        selectedArmorTypes: [],
        selectedWowClassName: []
    })

    // Queries
    const bossesQuery = useQuery({
        queryKey: [queryKeys.bosses, CURRENT_RAID_ID],
        queryFn: () => fetchBosses(CURRENT_RAID_ID)
    })

    const rosterProgressionQuery = useQuery({
        queryKey: [queryKeys.raidProgression, filter.showMains, filter.showAlts],
        queryFn: () => {
            // Convert the boolean filter states to the numeric parameter
            let filterParam = 0 // default: all characters
            if (filter.showMains && !filter.showAlts) {
                filterParam = 1 // only mains
            } else if (!filter.showMains && filter.showAlts) {
                filterParam = 2 // only alts
            }
            // If both showMains and showAlts are true, or both are false, use 0 (all characters)

            return fetchRosterProgression(filterParam)
        }
    })

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim())
        }, 300)

        return () => clearTimeout(handler)
    }, [searchQuery])

    const updateFilter = (key: keyof LootFilter, value: any): void => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    // Computed values
    const hasActiveFilters = useMemo(() => {
        return filter.selectedRaidDiff !== 'Mythic'
    }, [filter])

    const filteredPlayerNames = useMemo(() => {
        if (!debouncedSearchQuery || !rosterProgressionQuery.data) return []

        return rosterProgressionQuery.data
            .map(({ character }) => character.name)
            .filter(name => name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    }, [rosterProgressionQuery.data, debouncedSearchQuery])

    const orderedBosses = useMemo(() => {
        if (!bossesQuery.data) return []
        return bossesQuery.data.filter(b => b.id > 0).sort((a, b) => a.order - b.order)
    }, [bossesQuery.data])

    if (bossesQuery.isLoading || rosterProgressionQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Raid Progression</h1>
                <p className="text-gray-400">
                    Showing {filter.selectedRaidDiff} difficulty progression for{' '}
                    {(rosterProgressionQuery.data || []).length} characters
                    {debouncedSearchQuery && (
                        <span className="text-blue-400">
                            {' '}
                            (filtered by &quot;{debouncedSearchQuery}&quot;)
                        </span>
                    )}
                </p>
            </div>

            {/* Search Bar */}
            <div className="w-full max-w-md mb-4">
                <Input
                    type="text"
                    placeholder="Search player names..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4 justify-center">
                {orderedBosses.map(boss => (
                    <BossPanel
                        key={boss.id}
                        boss={boss}
                        rosterProgression={rosterProgressionQuery.data || []}
                        selectedDifficulty={filter.selectedRaidDiff}
                        filteredPlayerNames={filteredPlayerNames}
                    />
                ))}
            </div>

            {/* Floating Filter Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={clsx(
                    'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
                    hasActiveFilters
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                )}
                title="Change Difficulty"
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
                            showRaidDifficulty={true}
                            showDroptimizerFilters={false}
                            showClassFilter={false}
                            showSlotFilter={false}
                            showArmorTypeFilter={false}
                            className="shadow-2xl"
                        />
                    </div>
                </>
            )}
        </div>
    )
}
