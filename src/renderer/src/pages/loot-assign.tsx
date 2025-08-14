
import LootsEligibleChars from '@renderer/components/loots-eligible-chars'
import LootsTabs from '@renderer/components/loots-tab'
import LootsTradeHelperDialog from '@renderer/components/loots-trade-helper'
import SessionCard from '@renderer/components/session-card'
import DownloadCSV from '@renderer/components/shared/download-as-csv'
import { Button } from '@renderer/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { generateLootFilename, prepareLootData, prepareStatsData } from '@renderer/lib/loots-utils'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { getLootsWithAssignedBySessions } from '@renderer/lib/tanstack-query/loots'
import { fetchRaidSessionsWithSummary } from '@renderer/lib/tanstack-query/raid'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { LootWithAssigned } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, BarChart, DownloadIcon, Eye, LoaderCircle, MoreVertical, ZapIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export default function LootAssign() {
    const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set())
    const [selectedLoot, setSelectedLoot] = useState<LootWithAssigned | null>(null)
    const [showAllSessions, setShowAllSessions] = useState(false)

    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const defaultSessionId = searchParams.get('sessionId')

    const raidLootTable = useQuery({
        queryKey: [queryKeys.raidLootTable, CURRENT_RAID_ID],
        queryFn: () => fetchRaidLootTable(CURRENT_RAID_ID)
    })

    const toggleSession = (sessionId: string) => {
        const newSelectedSessions = new Set(selectedSessions)
        if (newSelectedSessions.has(sessionId)) {
            newSelectedSessions.delete(sessionId)
        } else {
            newSelectedSessions.add(sessionId)
        }
        setSelectedSessions(newSelectedSessions)
    }

    useEffect(() => {
        if (defaultSessionId) {
            toggleSession(defaultSessionId)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultSessionId])

    // dialog
    const [lootHelperDialogOpen, setLootHelperDialogOpen] = useState(false)

    const raidSessionsQuery = useQuery({
        queryKey: [queryKeys.raidSessionsWithLoots],
        queryFn: fetchRaidSessionsWithSummary
    })

    const lootsQuery = useQuery({
        queryKey: [queryKeys.lootsBySession, Array.from(selectedSessions)],
        queryFn: () => getLootsWithAssignedBySessions(Array.from(selectedSessions)),
        enabled: selectedSessions.size > 0,
        refetchInterval: 60000 // Refetch every min
    })

    // Update selectedLoot.assignedCharacterId if changed in backend
    useEffect(() => {
        if (!selectedLoot || !lootsQuery.data) return

        // Find the latest version of the selected loot
        const updatedLoot = lootsQuery.data.find(loot => loot.id === selectedLoot.id)
        if (!updatedLoot) {
            setSelectedLoot(null)
        } else if (updatedLoot.assignedCharacterId !== selectedLoot.assignedCharacterId) {
            setSelectedLoot(updatedLoot) // Update state with the latest data
        }
    }, [lootsQuery.data, selectedLoot])

    const sortedSessions = useMemo(
        () =>
            raidSessionsQuery.data
                ? [...raidSessionsQuery.data].sort((a, b) => b.raidDate - a.raidDate)
                : [],
        [raidSessionsQuery.data]
    )

    const loots = useMemo(() => lootsQuery.data ?? [], [lootsQuery.data])
    const visibleSessions = showAllSessions ? sortedSessions : sortedSessions.slice(0, 5)

    if (raidSessionsQuery.isLoading || lootsQuery.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 p-8 relative">
            {/* Page Header with integrated back button */}
            <div className="flex bg-muted rounded-lg p-6 mb-2 shadow-lg items-center relative">
                {/* Back button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="hover:bg-gray-800 p-2 mr-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                {/* Session cards */}
                <div className="flex flex-wrap flex-1">
                    {visibleSessions.map(session => (
                        <div key={session.id} onClick={() => toggleSession(session.id)}>
                            <SessionCard
                                session={session}
                                className={` ${selectedSessions.has(session.id) ? 'border border-primary' : ''}`}
                            />
                        </div>
                    ))}
                </div>

                <div className="absolute top-4 right-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="p-2 rounded hover:bg-gray-700"
                            aria-label="More options"
                        >
                            <MoreVertical className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2"
                                onClick={() => setShowAllSessions(!showAllSessions)}
                            >
                                <Eye className="h-4 w-4" />
                                <span>{showAllSessions ? 'Show less' : 'Show all sessions'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer flex items-center gap-2"
                                onClick={() => setLootHelperDialogOpen(true)}
                            >
                                <ZapIcon className="h-4 w-4" />
                                <span>Display Trade Helper</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                <DownloadIcon className="h-4 w-4" />
                                <DownloadCSV
                                    title="Export Loots CSV"
                                    filename={generateLootFilename(
                                        sortedSessions,
                                        selectedSessions,
                                        'loots'
                                    )}
                                    data={prepareLootData(loots, raidLootTable.data ?? [])}
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                                <BarChart className="h-4 w-4" />
                                <DownloadCSV
                                    title="Export Statistics"
                                    filename={generateLootFilename(
                                        sortedSessions,
                                        selectedSessions,
                                        'stats'
                                    )}
                                    data={prepareStatsData(loots, raidLootTable.data ?? [])}
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <LootsTradeHelperDialog
                    isOpen={lootHelperDialogOpen}
                    setOpen={setLootHelperDialogOpen}
                    loots={loots}
                />
            </div>

            {selectedSessions.size > 0 ? (
                <div className="flex w-full">
                    <div className="flex flex-col flex-grow max-w-[450px] pr-5">
                        <LootsTabs
                            loots={loots}
                            selectedLoot={selectedLoot}
                            setSelectedLoot={setSelectedLoot}
                        />
                    </div>
                    <div className="flex flex-col flex-grow bg-muted p-4 rounded-lg">
                        {selectedLoot ? (
                            <LootsEligibleChars
                                allLoots={loots}
                                selectedLoot={selectedLoot}
                                setSelectedLoot={setSelectedLoot}
                            />
                        ) : (
                            <p className="text-gray-400">Select a loot to start assigning</p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col w-full bg-muted p-4 rounded-lg">
                    <p className="text-gray-400">Select a session to start browsing loots</p>
                </div>
            )}
        </div>
    )
}
