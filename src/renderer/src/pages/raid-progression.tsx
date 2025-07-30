import { FiltersPanel } from '@renderer/components/filter-panel'
import { Input } from '@renderer/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { LootFilter } from '@renderer/lib/filters'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterProgression } from '@renderer/lib/tanstack-query/raid'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { CharacterBossProgressionResponse } from '@shared/schemas/raiderio.schemas'
import { BossWithItems, WowRaidDifficulty } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Filter, LoaderCircle, X } from 'lucide-react'
import { useEffect, useMemo, useState, type JSX } from 'react'

type BossPanelProps = {
    boss: BossWithItems
    rosterProgression: CharacterBossProgressionResponse[]
    selectedDifficulty: WowRaidDifficulty
    searchQuery: string
}

const BossPanel = ({
    boss,
    rosterProgression,
    selectedDifficulty,
    searchQuery
}: BossPanelProps) => {
    // Get characters who have defeated this boss at the selected difficulty
    const charactersWithProgress = useMemo(() => {
        return rosterProgression
            .map(characterData => {
                const { character, characterRaidProgress } = characterData

                // Apply search filter to character names
                if (
                    searchQuery &&
                    !character.name.toLowerCase().includes(searchQuery.toLowerCase())
                ) {
                    return null
                }

                // Find the current tier raid progress
                const currentRaidProgress = characterRaidProgress.raidProgress.find(
                    raidProgress => raidProgress.tier.ordinal === 33 // Current TWW tier
                )

                if (!currentRaidProgress) return null

                // Get encounters for the selected difficulty
                const difficultyKey =
                    selectedDifficulty.toLowerCase() as keyof typeof currentRaidProgress.encountersDefeated
                const encounters = currentRaidProgress.encountersDefeated[difficultyKey] || []

                // Check if this boss was defeated
                const bossDefeated = encounters.find(encounter => encounter.slug === boss.slug)

                return bossDefeated
                    ? {
                          character,
                          encounter: bossDefeated
                      }
                    : null
            })
            .filter(Boolean)
    }, [boss.slug, rosterProgression, selectedDifficulty, searchQuery])

    return (
        <div className="flex flex-col bg-muted rounded-lg overflow-hidden min-w-[250px]">
            {/* Boss header: cover + name */}
            <div className="flex flex-col gap-y-2">
                <img
                    src={encounterIcon.get(boss.id)}
                    alt={`${boss.name} icon`}
                    className="w-full h-32 object-scale-down"
                />
                <h2 className="text-center text-xs font-bold">{boss.name}</h2>
            </div>

            {/* Character progression */}
            <div className="flex flex-col gap-y-2 p-4">
                <div className="text-xs text-center text-gray-400 mb-2">
                    {charactersWithProgress.length} / {rosterProgression.length} defeated
                </div>

                {charactersWithProgress.length > 0 ? (
                    <div className="flex flex-col gap-y-1">
                        {charactersWithProgress.map(({ character, encounter }) => (
                            <Tooltip key={character.id}>
                                <TooltipTrigger asChild>
                                    <div className="flex flex-row items-center justify-between p-2 bg-gray-700 rounded text-xs hover:bg-gray-600 transition-colors">
                                        <span className="font-medium text-white">
                                            {character.name}
                                        </span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-green-400">
                                                {encounter.numKills} kills
                                            </span>
                                            {encounter.firstDefeated && (
                                                <span className="text-gray-400 text-[10px]">
                                                    {new Date(
                                                        encounter.firstDefeated
                                                    ).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent className="TooltipContent" sideOffset={5}>
                                    <div className="flex flex-col gap-1">
                                        <div>Character: {character.name}</div>
                                        <div>Kills: {encounter.numKills}</div>
                                        <div>Item Level: {encounter.itemLevel}</div>
                                        {encounter.firstDefeated && (
                                            <div>
                                                First Kill:{' '}
                                                {new Date(
                                                    encounter.firstDefeated
                                                ).toLocaleDateString()}
                                            </div>
                                        )}
                                        {encounter.lastDefeated && (
                                            <div>
                                                Last Kill:{' '}
                                                {new Date(
                                                    encounter.lastDefeated
                                                ).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-sm py-4">
                        No defeats on {selectedDifficulty}
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

    // Filter state - only difficulty filter is needed
    const [filter, setFilter] = useState<LootFilter>({
        selectedRaidDiff: 'Mythic',
        onlyUpgrades: false,
        minUpgrade: 0,
        hideOlderThanDays: false,
        hideAlts: false,
        hideIfNoUpgrade: false,
        maxDays: 7,
        selectedSlots: [],
        selectedArmorTypes: [],
        selectedWowClassName: []
    })

    // Fetch bosses data using consistent pattern
    const bossesQuery = useQuery({
        queryKey: [queryKeys.raidLootTable, CURRENT_RAID_ID],
        queryFn: () => fetchRaidLootTable(CURRENT_RAID_ID)
    })

    // Fetch roster progression data using consistent pattern
    const rosterProgressionQuery = useQuery({
        queryKey: [queryKeys.raidProgression],
        queryFn: fetchRosterProgression
    })

    // Debounce search input - consistent with loot-table.tsx
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim())
        }, 300)

        return () => clearTimeout(handler)
    }, [searchQuery])

    const updateFilter = (key: keyof LootFilter, value: any): void => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    // Check if difficulty filter is active (different from default Mythic)
    const hasActiveFilters = useMemo(() => {
        return filter.selectedRaidDiff !== 'Mythic'
    }, [filter])

    // Memoized filtering logic with search query - consistent with loot-table.tsx
    const filteredBosses = useMemo(() => {
        if (!bossesQuery.data) return []

        return bossesQuery.data
            .filter(boss => {
                if (!debouncedSearchQuery) return true
                return boss.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            })
            .sort((a, b) => a.order - b.order)
    }, [bossesQuery.data, debouncedSearchQuery])

    if (bossesQuery.isLoading || rosterProgressionQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const rosterProgression = rosterProgressionQuery.data || []

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold">Raid Progression</h1>
                <p className="text-gray-400">
                    Showing {filter.selectedRaidDiff} difficulty progression for{' '}
                    {rosterProgression.length} characters
                </p>
            </div>

            {/* Search Bar - consistent with loot-table.tsx */}
            <div className="w-full max-w-md mb-4">
                <Input
                    type="text"
                    placeholder="Search bosses or characters..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredBosses.map(boss => (
                    <BossPanel
                        key={boss.id}
                        boss={boss}
                        rosterProgression={rosterProgression}
                        selectedDifficulty={filter.selectedRaidDiff}
                        searchQuery={debouncedSearchQuery}
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

            {/* Filter Panel Overlay - Only shows raid difficulty */}
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />

                    {/* Filter Panel */}
                    <div className="fixed bottom-24 right-6 z-50 max-w-md w-80">
                        <FiltersPanel
                            filter={filter}
                            updateFilter={updateFilter}
                            showRaidDifficulty={true}
                            showDroptimizerFilters={false}
                            showClassFilter={false}
                            showSlotFilter={false}
                            showArmorTypeFilter={false}
                            collapsible={false}
                            className="shadow-2xl"
                        />
                    </div>
                </>
            )}
        </div>
    )
}
