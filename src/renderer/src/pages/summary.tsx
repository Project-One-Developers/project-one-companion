import TiersetInfo from '@renderer/components/tierset-info'
import { FiltersPanel } from '@renderer/components/filter-panel'
import { Input } from '@renderer/components/ui/input'
import { Checkbox } from '@renderer/components/ui/checkbox'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@renderer/components/ui/table'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { WowCurrencyIcon } from '@renderer/components/ui/wowcurrency-icon'
import { WowGearIcon } from '@renderer/components/ui/wowgear-icon'
import { LootFilter } from '@renderer/lib/filters'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterSummary } from '@renderer/lib/tanstack-query/players'
import { DroptimizerWarn, WowAuditWarn, TierSetCompletion } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Filter, LoaderCircle, X } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'
import { useNavigate } from 'react-router'
import clsx from 'clsx'

// Constants
const DEFAULT_FILTER: LootFilter = {
    selectedRaidDiff: 'Mythic',
    onlyUpgrades: false,
    minUpgrade: 0,
    showMains: true,
    showAlts: false,
    hideIfNoUpgrade: false,
    selectedSlots: [],
    selectedArmorTypes: [],
    selectedWowClassName: []
}

const DEFAULT_TIER_COMPLETION_FILTER = {
    [TierSetCompletion.None]: true,
    [TierSetCompletion.OnePiece]: true,
    [TierSetCompletion.TwoPiece]: true,
    [TierSetCompletion.ThreePiece]: true,
    [TierSetCompletion.FourPiece]: true,
    [TierSetCompletion.FivePiece]: true
}

// Types
type TierCompletionFilterType = { [key in TierSetCompletion]: boolean }

// Utility functions
const hasVaultTierPieces = (weeklyChest: any[]): boolean => {
    return weeklyChest.some(gear => gear.item.tierset)
}

const formatTierCompletion = (completion: TierSetCompletion): string => {
    return `${completion}/5 pieces`
}

const getTierCompletionStyle = (tierCompletion: TierSetCompletion): string => {
    return clsx(
        "px-2 py-1 rounded-full text-xs font-bold",
        tierCompletion >= TierSetCompletion.FourPiece ? "bg-green-900/50 text-green-400" :
            tierCompletion >= TierSetCompletion.TwoPiece ? "bg-yellow-900/50 text-yellow-400" :
                "bg-red-900/50 text-red-400"
    )
}

const sortPlayersByItemLevel = (a: any, b: any) => parseFloat(b.itemLevel) - parseFloat(a.itemLevel)

// Components
const LoadingSpinner = () => (
    <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
        <LoaderCircle className="animate-spin text-5xl" />
    </div>
)

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
        <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
        />
    </svg>
)

const WarningBadge = ({ label }: { label: string }) => (
    <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full flex items-center space-x-1 border border-yellow-400/50">
        <WarningIcon />
        <span>{label}</span>
    </span>
)

const TierCompletionCheckbox = ({
                                    completion,
                                    checked,
                                    onChange
                                }: {
    completion: TierSetCompletion
    checked: boolean
    onChange: () => void
}) => (
    <label className="flex items-center space-x-1 cursor-pointer">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <span className="text-sm text-gray-300">{completion}p</span>
    </label>
)

const SearchBar = ({ searchQuery, onSearchChange }: {
    searchQuery: string
    onSearchChange: (value: string) => void
}) => (
    <Input
        type="text"
        placeholder="Search players or characters..."
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-md"
    />
)

const FilterControls = ({
                            tierCompletionFilter,
                            onTierToggle,
                            showOnlyWithVaultTier,
                            onVaultFilterChange
                        }: {
    tierCompletionFilter: TierCompletionFilterType
    onTierToggle: (completion: TierSetCompletion) => void
    showOnlyWithVaultTier: boolean
    onVaultFilterChange: (checked: boolean) => void
}) => (
    <div className="flex flex-wrap gap-4 items-center">
        <div className="flex flex-wrap gap-2 items-center">
            {Object.values(TierSetCompletion)
                .filter(v => typeof v === 'number')
                .map((completion) => (
                    <TierCompletionCheckbox
                        key={completion}
                        completion={completion as TierSetCompletion}
                        checked={tierCompletionFilter[completion as TierSetCompletion]}
                        onChange={() => onTierToggle(completion as TierSetCompletion)}
                    />
                ))}
        </div>

        <div className="flex items-center space-x-2">
            <Checkbox
                checked={showOnlyWithVaultTier}
                onCheckedChange={(checked) => onVaultFilterChange(checked === true)}
            />
            <span className="text-sm text-gray-300">Show only with vault tier</span>
        </div>
    </div>
)

const PlayerRow = ({ summary, navigate }: { summary: any, navigate: any }) => {
    const tierCompletion = summary.tierset.length

    return (
        <TableRow className="hover:bg-gray-700">
            <TableCell className="p-1 rounded-l-md">
                <div className="flex space-x-10">
                    <div
                        className="flex items-center space-x-3 cursor-pointer"
                        onClick={() => navigate(`/roster/${summary.character.id}`)}
                    >
                        <WowClassIcon
                            wowClassName={summary.character.class}
                            charname={summary.character.name}
                            className="h-8 w-8 border-2 border-background rounded-lg"
                        />
                        <div>
                            <h1 className="font-bold text-gray-100">{summary.character.name}</h1>
                            <p className="text-xs text-gray-400">{summary.itemLevel}</p>
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell className="p-1">
                <TiersetInfo tierset={summary.tierset} />
            </TableCell>

            <TableCell className="p-1">
                <span className={getTierCompletionStyle(tierCompletion)}>
                    {formatTierCompletion(tierCompletion)}
                </span>
            </TableCell>

            <TableCell className="rounded-r-md">
                <div className="flex space-x-1 relative">
                    {summary.weeklyChest.map(gear => (
                        <WowGearIcon
                            key={gear.item.id}
                            gearItem={gear}
                            showTiersetLine={false}
                            showTiersetRibbon={true}
                        />
                    ))}
                </div>
            </TableCell>

            <TableCell className="p-1">
                <div className="flex space-x-1">
                    {summary.currencies
                        .sort((a, b) => a.id - b.id)
                        .map(currency => (
                            <WowCurrencyIcon
                                key={currency.id}
                                currency={currency}
                                iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                            />
                        ))}
                </div>
            </TableCell>

            <TableCell className="p-1">
                {summary.warnDroptimizer !== DroptimizerWarn.None && (
                    <WarningBadge label={summary.warnDroptimizer.toUpperCase()} />
                )}
            </TableCell>

            <TableCell className="p-1 rounded-r-md">
                {summary.warnWowAudit === WowAuditWarn.NotTracked && (
                    <WarningBadge label="MISSING" />
                )}
            </TableCell>
        </TableRow>
    )
}

const FloatingFilterButton = ({
                                  isOpen,
                                  hasActiveFilters,
                                  onClick
                              }: {
    isOpen: boolean
    hasActiveFilters: boolean
    onClick: () => void
}) => (
    <button
        onClick={onClick}
        className={clsx(
            'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
            hasActiveFilters
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        )}
        title="Change Difficulty"
    >
        {isOpen ? <X size={24} /> : <Filter size={24} />}
        {hasActiveFilters && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
        )}
    </button>
)

// Main component
export default function SummaryPage(): JSX.Element {
    // State
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filter, setFilter] = useState<LootFilter>(DEFAULT_FILTER)
    const [tierCompletionFilter, setTierCompletionFilter] = useState<TierCompletionFilterType>(
        DEFAULT_TIER_COMPLETION_FILTER
    )
    const [showOnlyWithVaultTier, setShowOnlyWithVaultTier] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const navigate = useNavigate()

    // Query
    const characterQuery = useQuery({
        queryKey: [queryKeys.charactersSummary],
        queryFn: fetchRosterSummary
    })

    // Handlers
    const updateFilter = (key: keyof LootFilter, value: any): void => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    const toggleTierCompletion = (completion: TierSetCompletion) => {
        setTierCompletionFilter(prev => ({
            ...prev,
            [completion]: !prev[completion]
        }))
    }

    const toggleFilterPanel = () => setIsFilterOpen(!isFilterOpen)

    // Computed values
    const hasActiveFilters = useMemo(() => {
        const hasTierFilter = !Object.values(tierCompletionFilter).every(v => v)
        return !filter.showMains || hasTierFilter || showOnlyWithVaultTier
    }, [filter, tierCompletionFilter, showOnlyWithVaultTier])

    const filteredPlayers = useMemo(() => {
        if (!characterQuery.data) return []

        return characterQuery.data
            .filter(summary => {
                const isMain = summary.character.main
                const playerMatches = summary.character.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())

                const passesMainAltFilter = (filter.showMains && isMain) || (filter.showAlts && !isMain)
                const tierCompletion = summary.tierset.length
                const passesTierFilter = tierCompletionFilter[tierCompletion]
                const passesVaultFilter = !showOnlyWithVaultTier || hasVaultTierPieces(summary.weeklyChest)

                return playerMatches && passesMainAltFilter && passesTierFilter && passesVaultFilter
            })
            .sort(sortPlayersByItemLevel)
    }, [characterQuery.data, searchQuery, filter.showMains, filter.showAlts, tierCompletionFilter, showOnlyWithVaultTier])

    if (characterQuery.isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Search and Filters */}
            <div className="w-full mb-4 space-y-4">
                <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                <FilterControls
                    tierCompletionFilter={tierCompletionFilter}
                    onTierToggle={toggleTierCompletion}
                    showOnlyWithVaultTier={showOnlyWithVaultTier}
                    onVaultFilterChange={setShowOnlyWithVaultTier}
                />
            </div>

            {/* Players Table */}
            <Table className="w-full">
                <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800">
                        <TableHead className="text-gray-300 font-semibold">Name</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Tierset</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Completion</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Vault</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Currency</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Droptimizer</TableHead>
                        <TableHead className="text-gray-300 font-semibold">WoW Audit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPlayers.map(summary => (
                        <PlayerRow
                            key={summary.character.id}
                            summary={summary}
                            navigate={navigate}
                        />
                    ))}
                </TableBody>
            </Table>

            {/* Floating Filter Button */}
            <FloatingFilterButton
                isOpen={isFilterOpen}
                hasActiveFilters={hasActiveFilters}
                onClick={toggleFilterPanel}
            />

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
                            showRaidDifficulty={false}
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
