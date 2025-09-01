import RaidSessionDialog from '@renderer/components/session-dialog'
import SessionCard from '@renderer/components/session-card'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSessionsWithSummary } from '@renderer/lib/tanstack-query/raid'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle, PlusIcon } from 'lucide-react'
import type { JSX } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RaidSessionListPage(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.raidSessions],
        queryFn: fetchRaidSessionsWithSummary
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <div className="flex flex-col mt-10 p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Raid Sessions</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data
                    ?.sort((a, b) => b.raidDate - a.raidDate)
                    .map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            onClick={() => navigate(`/raid-session/${session.id}`)}
                        />
                    ))}
            </div>
            {/* Bottom Right Plus Icon */}
            <div className="fixed bottom-6 right-6">
                <div
                    className="rounded-full bg-primary text-background hover:bg-primary/80 w-10 h-10 flex items-center justify-center cursor-pointer"
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
