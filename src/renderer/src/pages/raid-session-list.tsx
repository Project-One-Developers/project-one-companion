import RaidSessionDialog from '@renderer/components/session-dialog'
import SessionCard from '@renderer/components/session-card'
import { Input } from '@renderer/components/ui/input'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSessionsWithSummary } from '@renderer/lib/tanstack-query/raid'
import { unixTimestampToWowWeek } from '@shared/libs/date/date-utils'
import { RaidSessionWithSummary } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle, PlusIcon, Search } from 'lucide-react'
import type { JSX } from 'react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type GroupedSessions = {
    [wowWeek: number]: RaidSessionWithSummary[]
}

export default function RaidSessionListPage(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.raidSessions],
        queryFn: fetchRaidSessionsWithSummary
    })

    // Group and filter sessions by WoW week
    const { groupedSessions, weekNumbers } = useMemo(() => {
        if (!data) return { groupedSessions: {}, weekNumbers: [] }

        // First filter by search query if provided
        let filteredSessions = data
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filteredSessions = data.filter(session => {
                const nameMatch = session.name.toLowerCase().includes(query)
                const wowWeek = unixTimestampToWowWeek(session.raidDate)
                const weekMatch = wowWeek.toString().includes(query)
                return nameMatch || weekMatch
            })
        }

        // Group sessions by WoW week
        const grouped: GroupedSessions = {}
        filteredSessions.forEach(session => {
            const wowWeek = unixTimestampToWowWeek(session.raidDate)
            if (!grouped[wowWeek]) {
                grouped[wowWeek] = []
            }
            grouped[wowWeek].push(session)
        })

        // Sort sessions within each week by date (newest first)
        Object.keys(grouped).forEach(week => {
            grouped[Number(week)].sort((a, b) => b.raidDate - a.raidDate)
        })

        // Get sorted week numbers (newest weeks first)
        const weeks = Object.keys(grouped)
            .map(Number)
            .sort((a, b) => b - a)

        return { groupedSessions: grouped, weekNumbers: weeks }
    }, [data, searchQuery])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="w-dvw h-dvh flex flex-col gap-y-8 p-8 pr-4 relative">
            {/* Page Header */}
            <div className="bg-muted rounded-lg p-6 shadow-lg mr-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Raid Sessions</h1>
                </div>

                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by session name or WoW week..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Sessions Grouped by Week */}
            <div className="flex-1 overflow-y-auto pr-4">
                <div className="space-y-8">
                    {weekNumbers.map(weekNumber => (
                        <div key={weekNumber} className="space-y-4">
                            {/* Week Header */}
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/20 text-primary px-4 py-2 rounded-lg">
                                    <span className="font-semibold">WoW Week {weekNumber}</span>
                                </div>
                                <div className="h-px bg-gray-700 flex-1"></div>
                                <span className="text-sm text-gray-400">
                                    {groupedSessions[weekNumber].length} session
                                    {groupedSessions[weekNumber].length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Sessions Grid for this week */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {groupedSessions[weekNumber].map(session => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        onClick={() => navigate(`/raid-session/${session.id}`)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* No results message */}
                {weekNumbers.length === 0 && searchQuery.trim() && (
                    <div className="text-center text-gray-400 mt-8">
                        No sessions found matching "{searchQuery}"
                    </div>
                )}

                {/* No sessions message */}
                {weekNumbers.length === 0 && !searchQuery.trim() && data?.length === 0 && (
                    <div className="text-center text-gray-400 mt-8">
                        No raid sessions yet. Create your first session!
                    </div>
                )}

                {/* Bottom padding to ensure content doesn't get hidden behind floating button */}
                <div className="pb-20"></div>
            </div>

            {/* Bottom Right Plus Icon */}
            <div className="fixed bottom-6 right-6 z-10">
                <div
                    className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg"
                    onClick={() => setIsDialogOpen(true)}
                >
                    <PlusIcon className="w-5 h-5 hover:rotate-45 ease-linear transition-transform" />
                </div>
            </div>

            {/* Page Dialogs */}
            <RaidSessionDialog isOpen={isDialogOpen} setOpen={setIsDialogOpen} />
        </div>
    )
}
