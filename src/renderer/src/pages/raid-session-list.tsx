import RaidSessionDialog from '@renderer/components/session-dialog'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { formatUnixTimestampForDisplay } from '@renderer/lib/utils'
import { RaidSession } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Calendar, LoaderCircle, PlusIcon, Users } from 'lucide-react'
import type { JSX } from 'react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionCard: React.FC<{ session: RaidSession; onClick: () => void }> = ({
    session,
    onClick
}) => (
    <div
        className="bg-muted p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={onClick}
    >
        <h3 className="text-xl font-bold mb-2">{session.name}</h3>
        <div className="flex items-center text-gray-400 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formatUnixTimestampForDisplay(session.raidDate)}</span>
        </div>
        <div className="flex items-center text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>{session.roster.length} participants</span>
        </div>
    </div>
)

export default function RaidSessionListPage(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const { data, isLoading } = useQuery({
        queryKey: [queryKeys.raidSessions],
        queryFn: fetchRaidSessions
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
                {data?.map((session) => (
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
