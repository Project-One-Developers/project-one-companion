import * as Dialog from '@radix-ui/react-dialog'
import NewSessionForm from '@renderer/components/new-session-form'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { fetchRaidSessions } from '@renderer/lib/tanstack-query/raid'
import { NewRaidSession, RaidSession } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { Calendar, PlusCircle, Users } from 'lucide-react'
import type { JSX } from 'react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SessionCard: React.FC<{ session: RaidSession; onClick: () => void }> = ({
    session,
    onClick
}) => (
    <div
        className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-700 transition-colors"
        onClick={onClick}
    >
        <h3 className="text-xl font-bold mb-2">{session.name}</h3>
        <div className="flex items-center text-gray-400 mb-1">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{session.date}</span>
        </div>
        <div className="flex items-center text-gray-400">
            <Users className="w-4 h-4 mr-2" />
            <span>20 participants</span>
        </div>
    </div>
)

export default function RaidSessionPage(): JSX.Element {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const { data } = useQuery({
        queryKey: [queryKeys.raidSessions],
        queryFn: fetchRaidSessions
    })

    const navigate = useNavigate()

    const handleNewSession = (newSession: NewRaidSession) => {
        console.log(newSession)
        setIsDialogOpen(false)
    }

    return (
        <div className="flex flex-col mt-10 p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Raid Sessions</h1>
                <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <Dialog.Trigger asChild>
                        <button className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            New Session
                        </button>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl">
                            <Dialog.Title className="text-2xl font-bold mb-4">
                                Create New Session
                            </Dialog.Title>
                            <NewSessionForm onSubmit={handleNewSession} />
                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
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
        </div>
    )
}
