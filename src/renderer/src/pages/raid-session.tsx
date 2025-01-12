import * as Dialog from '@radix-ui/react-dialog'
import NewSessionForm from '@renderer/components/new-session-form'
import { Calendar, PlusCircle, Users } from 'lucide-react'
import type { JSX } from 'react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Mock data for raid sessions
const mockSessions = [
    { id: 1, name: 'Weekly Raid - Aberrus', date: '2023-06-15', participants: 20 },
    { id: 2, name: 'Heroic Progress Run', date: '2023-06-18', participants: 25 },
    { id: 3, name: 'Alt Run - Normal', date: '2023-06-20', participants: 15 }
]

interface RaidSession {
    id: number
    name: string
    date: string
    participants: number
}

interface Character {
    id: number
    name: string
    class: string
}

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
            <span>{session.participants} participants</span>
        </div>
    </div>
)

export default function RaidSession(): JSX.Element {
    const [sessions, setSessions] = useState<RaidSession[]>(mockSessions)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const navigate = useNavigate()

    const handleNewSession = (name: string, characters: number[]) => {
        const newSession: RaidSession = {
            id: sessions.length + 1,
            name,
            date: new Date().toISOString().split('T')[0],
            participants: characters.length
        }
        setSessions([...sessions, newSession])
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
                {sessions.map((session) => (
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
