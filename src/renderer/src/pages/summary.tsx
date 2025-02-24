import TiersetInfo from '@renderer/components/tierset-info'
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
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRosterSummary } from '@renderer/lib/tanstack-query/players'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'

import { useMemo, useState, type JSX } from 'react'

export default function SummaryPage(): JSX.Element {
    const [searchQuery, setSearchQuery] = useState('')

    const characterQuery = useQuery({
        queryKey: [queryKeys.characters],
        queryFn: fetchRosterSummary
    })

    // Filter players based on the search query
    const filteredPlayers = useMemo(() => {
        if (!characterQuery.data) return []
        return characterQuery.data
            .filter((summary) => {
                const isMain = summary.character.main
                const playerMatches = summary.character.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())

                return isMain && playerMatches
            })
            .sort((a, b) => parseFloat(b.itemLevel) - parseFloat(a.itemLevel)) // sort player by item level
    }, [characterQuery.data, searchQuery])

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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md"
                />
            </div>

            <Table className="w-full cursor-pointer">
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
                    {filteredPlayers.map((summary) => {
                        return (
                            <TableRow
                                key={summary.character.id}
                                className={`  cursor-pointer  hover:bg-gray-700 `}
                            >
                                <TableCell className="p-1 rounded-l-md group-hover:border-l group-hover:border-t group-hover:border-b group-hover:border-white relative">
                                    <div className="flex items-center space-x-3">
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
                                </TableCell>
                                <TableCell className="p-1">
                                    <TiersetInfo tierset={summary.tierset} />
                                </TableCell>
                                <TableCell className="rounded-r-md">
                                    <div className="flex space-x-1">
                                        {summary.weeklyChest.map((gear) => (
                                            <WowGearIcon key={gear.item.id} gearItem={gear} />
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell className="p-1">
                                    <div className="flex space-x-1">
                                        {summary.currencies
                                            .sort((a, b) => a.id - b.id)
                                            .map((currency) => (
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
                                        {summary.warnDroptimizer.type === 'not-imported' && (
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
                                <TableCell className="p-1 rounded-r-md">
                                    <div className="flex flex-col space-y-2">
                                        {summary.warnWowAudit.type === 'not-tracked' && (
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
        </div>
    )
}
