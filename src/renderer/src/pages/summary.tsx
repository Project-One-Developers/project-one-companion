import TiersetInfo from '@renderer/components/tierset-info'
import { FiltersPanel } from '@renderer/components/filter-panel'
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
import { LootFilter } from '@renderer/lib/filters'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterSummary } from '@renderer/lib/tanstack-query/players'
import { DroptimizerWarn, WowAuditWarn } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Filter, LoaderCircle, X } from 'lucide-react'

import { useMemo, useState, type JSX } from 'react'
import { useNavigate } from 'react-router'
import clsx from 'clsx'

export default function SummaryPage(): JSX.Element {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

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

    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const characterQuery = useQuery({
        queryKey: [queryKeys.charactersSummary],
        queryFn: fetchRosterSummary
    })

    const updateFilter = (key: keyof LootFilter, value: any): void => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    // Computed values
    const hasActiveFilters = useMemo(() => {
        return !filter.showMains
    }, [filter])

    // Filter players based on the search query and main/alt filter
    const filteredPlayers = useMemo(() => {
        if (!characterQuery.data) return []
        return characterQuery.data
            .filter(summary => {
                const isMain = summary.character.main
                const playerMatches = summary.character.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())

                // Apply main/alt filter
                const passesMainAltFilter =
                    (filter.showMains && isMain) || (filter.showAlts && !isMain)

                return playerMatches && passesMainAltFilter
            })
            .sort((a, b) => parseFloat(b.itemLevel) - parseFloat(a.itemLevel)) // sort player by item level
    }, [characterQuery.data, searchQuery, filter.showMains, filter.showAlts])

    if (characterQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Search Bar */}
            <div className="w-full mb-4">
                <Input
                    type="text"
                    placeholder="Search players or characters..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>

            <Table className="w-full">
                <TableHeader className="bg-gray-800">
                    <TableRow className="hover:bg-gray-800">
                        <TableHead className="text-gray-300 font-semibold">Name</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Tierset</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Vault</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Currency</TableHead>
                        <TableHead className="text-gray-300 font-semibold">Droptimizer</TableHead>
                        <TableHead className="text-gray-300 font-semibold">WoW Audit</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {filteredPlayers.map(summary => {
                        return (
                            <TableRow key={summary.character.id} className={` hover:bg-gray-700 `}>
                                <TableCell className="p-1 rounded-l-md group-hover:border-l group-hover:border-t group-hover:border-b group-hover:border-white relative">
                                    <div className="flex space-x-10">
                                        <div
                                            className="flex items-center space-x-3 cursor-pointer"
                                            onClick={() =>
                                                navigate(`/roster/${summary.character.id}`)
                                            }
                                        >
                                            <div className="relative">
                                                <WowClassIcon
                                                    wowClassName={summary.character.class}
                                                    charname={summary.character.name}
                                                    className="h-8 w-8 border-2 border-background rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <h1 className="font-bold text-gray-100">
                                                    {summary.character.name}
                                                </h1>
                                                <p className="text-xs text-gray-400">
                                                    {summary.itemLevel}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="p-1">
                                    <TiersetInfo tierset={summary.tierset} />
                                </TableCell>
                                <TableCell className="rounded-r-md">
                                    <div className="flex space-x-1">
                                        {summary.weeklyChest.map(gear => (
                                            <WowGearIcon key={gear.item.id} gearItem={gear} />
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
                                    <div className="flex flex-col space-y-2">
                                        {summary.warnDroptimizer !== DroptimizerWarn.None && (
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full flex items-center space-x-1 border border-yellow-400/50">
                                                    {/* Warning Icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>
                                                        {summary.warnDroptimizer.toUpperCase()}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="p-1 rounded-r-md">
                                    <div className="flex flex-col space-y-2">
                                        {summary.warnWowAudit === WowAuditWarn.NotTracked && (
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full flex items-center space-x-1 border border-yellow-400/50">
                                                    {/* Warning Icon */}
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-3 w-3"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                    <span>MISSING</span>
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

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
