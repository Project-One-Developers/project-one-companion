import { GlobalFilterUI } from '@renderer/components/global-filter-ui'
import TiersetInfo from '@renderer/components/tierset-info'
import { Checkbox } from '@renderer/components/ui/checkbox'
import { Input } from '@renderer/components/ui/input'
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
import { useFilterContext } from '@renderer/lib/filter-context'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterSummary } from '@renderer/lib/tanstack-query/players'
import {
    CharacterSummary,
    DroptimizerWarn,
    TierSetCompletion,
    WowAuditWarn
} from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { AlertTriangle, CheckCircle, LoaderCircle, XCircle } from 'lucide-react'
import { useMemo, useState, type JSX } from 'react'
import { NavigateFunction, useNavigate } from 'react-router'

// Constants
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
        'px-2 py-1 rounded-full text-xs font-bold',
        tierCompletion >= TierSetCompletion.FourPiece
            ? 'bg-green-900/50 text-green-400'
            : tierCompletion >= TierSetCompletion.TwoPiece
              ? 'bg-yellow-900/50 text-yellow-400'
              : 'bg-red-900/50 text-red-400'
    )
}

const sortPlayersByItemLevel = (a: CharacterSummary, b: CharacterSummary) =>
    parseFloat(b.itemLevel) - parseFloat(a.itemLevel)

// Components
const LoadingSpinner = () => (
    <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
        <LoaderCircle className="animate-spin text-5xl" />
    </div>
)

const StatusIndicator = ({
    status,
    label
}: {
    status: 'success' | 'warning' | 'error' | 'none'
    label?: string
}) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'success':
                return {
                    icon: CheckCircle,
                    className: 'bg-green-900/30 text-green-400 border-green-500/30',
                    label: label || 'OK'
                }
            case 'warning':
                return {
                    icon: AlertTriangle,
                    className: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30',
                    label: label || 'Warning'
                }
            case 'error':
                return {
                    icon: XCircle,
                    className: 'bg-red-900/30 text-red-400 border-red-500/30',
                    label: label || 'Error'
                }
            case 'none':
            default:
                return {
                    icon: null,
                    className: 'bg-gray-800/50 text-gray-500 border-gray-600/30',
                    label: '—'
                }
        }
    }

    const config = getStatusConfig()
    const Icon = config.icon

    return (
        <div
            className={clsx(
                'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium border',
                config.className
            )}
        >
            {Icon && <Icon size={12} />}
            <span>{config.label}</span>
        </div>
    )
}

const DroptimizerStatus = ({ warn }: { warn: DroptimizerWarn }) => {
    const getDroptimizerStatus = (warn: DroptimizerWarn) => {
        switch (warn) {
            case DroptimizerWarn.None:
                return { status: 'success' as const, label: 'Synced' }
            case DroptimizerWarn.NotImported:
                return { status: 'warning' as const, label: 'Not Imported' }
            case DroptimizerWarn.Outdated:
                return { status: 'warning' as const, label: 'Out of Date' }
            default:
                return { status: 'error' as const, label: 'Unknown' }
        }
    }

    const { status, label } = getDroptimizerStatus(warn)
    return <StatusIndicator status={status} label={label} />
}

const WowAuditStatus = ({ warn }: { warn: WowAuditWarn }) => {
    const getWowAuditStatus = (warn: WowAuditWarn) => {
        switch (warn) {
            case WowAuditWarn.None:
                return { status: 'success' as const, label: 'Tracked' }
            case WowAuditWarn.NotTracked:
                return { status: 'error' as const, label: 'Missing' }
            default:
                return { status: 'error' as const, label: 'Unknown' }
        }
    }

    const { status, label } = getWowAuditStatus(warn)
    return <StatusIndicator status={status} label={label} />
}

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

const SearchBar = ({
    searchQuery,
    onSearchChange
}: {
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
                .map(completion => (
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
                onCheckedChange={checked => onVaultFilterChange(checked === true)}
            />
            <span className="text-sm text-gray-300">Tierset in vault</span>
        </div>
    </div>
)

const PlayerRow = ({
    summary,
    navigate
}: {
    summary: CharacterSummary
    navigate: NavigateFunction
}) => {
    const tierCompletion = summary.tierset.length

    return (
        <TableRow className="hover:bg-gray-700">
            <TableCell className="p-3">
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

            <TableCell className="p-3">
                <TiersetInfo tierset={summary.tierset} />
            </TableCell>

            <TableCell className="p-3">
                <span className={getTierCompletionStyle(tierCompletion)}>
                    {formatTierCompletion(tierCompletion)}
                </span>
            </TableCell>

            <TableCell className="p-3">
                <div className="flex space-x-1 relative">
                    {summary.weeklyChest.length > 0 ? (
                        summary.weeklyChest.map(gear => (
                            <WowGearIcon
                                key={gear.item.id}
                                gearItem={gear}
                                showTiersetLine={false}
                                showTiersetRibbon={true}
                            />
                        ))
                    ) : (
                        <span className="text-xs text-gray-500 italic">No vault items</span>
                    )}
                </div>
            </TableCell>

            <TableCell className="p-3">
                <div className="flex space-x-1">
                    {summary.currencies.length > 0 ? (
                        summary.currencies
                            .sort((a, b) => a.id - b.id)
                            .map(currency => (
                                <WowCurrencyIcon
                                    key={currency.id}
                                    currency={currency}
                                    iconClassName="object-cover object-top rounded-lg h-8 w-8 border border-background"
                                />
                            ))
                    ) : (
                        <span className="text-xs text-gray-500 italic">No currencies</span>
                    )}
                </div>
            </TableCell>

            <TableCell className="p-3">
                <DroptimizerStatus warn={summary.warnDroptimizer} />
            </TableCell>

            <TableCell className="p-3">
                <WowAuditStatus warn={summary.warnWowAudit} />
            </TableCell>
        </TableRow>
    )
}

// Main component
export default function SummaryPage(): JSX.Element {
    // Get global filter context
    const { filter } = useFilterContext()

    // Local state for page-specific filters
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
    const toggleTierCompletion = (completion: TierSetCompletion) => {
        setTierCompletionFilter(prev => ({
            ...prev,
            [completion]: !prev[completion]
        }))
    }

    const filteredPlayers = useMemo(() => {
        if (!characterQuery.data) return []

        return characterQuery.data
            .filter(summary => {
                const isMain = summary.character.main
                const playerMatches = summary.character.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())

                const passesMainAltFilter =
                    (filter.showMains && isMain) || (filter.showAlts && !isMain)
                const tierCompletion = summary.tierset.length
                const passesTierFilter = tierCompletionFilter[tierCompletion]
                const passesVaultFilter =
                    !showOnlyWithVaultTier || hasVaultTierPieces(summary.weeklyChest)

                return playerMatches && passesMainAltFilter && passesTierFilter && passesVaultFilter
            })
            .sort(sortPlayersByItemLevel)
    }, [
        characterQuery.data,
        searchQuery,
        filter.showMains,
        filter.showAlts,
        tierCompletionFilter,
        showOnlyWithVaultTier
    ])

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

            {/* Bottom Right Filter button */}
            <GlobalFilterUI
                showRaidDifficulty={false}
                showDroptimizerFilters={false}
                showClassFilter={false}
                showSlotFilter={false}
                showArmorTypeFilter={false}
            />
        </div>
    )
}
