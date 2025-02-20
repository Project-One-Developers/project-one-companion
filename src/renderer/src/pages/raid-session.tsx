import * as Separator from '@radix-ui/react-separator'
import SessionDeleteDialog from '@renderer/components/session-delete-dialog'
import RaidSessionDialog from '@renderer/components/session-dialog'
import SessionLootNewDialog from '@renderer/components/session-loot-new-dialog'
import { SessionLootsPanel } from '@renderer/components/session-loots-panel'
import { Button } from '@renderer/components/ui/button'
import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { cloneRaidSession, fetchRaidSession } from '@renderer/lib/tanstack-query/raid'
import { formaUnixTimestampToItalianDate } from '@renderer/lib/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    Calendar,
    Copy,
    Edit,
    LoaderCircle,
    PlusIcon,
    ShoppingBag,
    Trash2
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const RaidSessionPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()

    // dialog
    const [isAddLootDialogOpen, setIsAddLootDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { data: raidSession, isLoading } = useQuery({
        queryKey: [queryKeys.raidSession, raidSessionId],
        queryFn: () => fetchRaidSession(raidSessionId),
        enabled: !!raidSessionId
    })

    const cloneSessionMutation = useMutation({
        mutationFn: (id: string) => cloneRaidSession(id),
        onSuccess: (clonedSession) => {
            navigate(`/raid-session/${clonedSession.id}`)
        }
    })

    if (!raidSession) return null

    if (isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    // prepare data
    const tanks = raidSession.roster
        .filter((character) => character.role === 'Tank')
        .sort((a, b) => a.class.localeCompare(b.class))

    const healers = raidSession.roster
        .filter((character) => character.role === 'Healer')
        .sort((a, b) => a.class.localeCompare(b.class))

    const dps = raidSession.roster
        .filter((character) => character.role === 'DPS')
        .sort((a, b) => a.class.localeCompare(b.class))

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 p-8 relative">
            {/* Back to Raid Sessions */}
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 hover:bg-gray-800">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            {/* Page Header */}
            <div className="bg-muted rounded-lg p-6 mb-2 shadow-lg flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2 text-blue-400">{raidSession.name}</h1>
                    <div className="flex items-center text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>{formaUnixTimestampToItalianDate(raidSession.raidDate)}</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    {/* Edit Session */}
                    <Button
                        variant="secondary"
                        className="hover:bg-blue-700"
                        onClick={() => {
                            setIsEditDialogOpen(true)
                        }}
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit Session
                    </Button>
                    <RaidSessionDialog
                        isOpen={isEditDialogOpen}
                        setOpen={setIsEditDialogOpen}
                        existingSession={raidSession}
                    />
                    {/* Clone Session */}
                    <Button
                        variant="secondary"
                        className="hover:bg-blue-700"
                        onClick={() => cloneSessionMutation.mutate(raidSession.id)}
                        disabled={cloneSessionMutation.isPending}
                    >
                        <Copy className="mr-2 h-4 w-4" /> Clone Session
                    </Button>
                    {/* Delete Session */}
                    <Button
                        variant="destructive"
                        className="hover:bg-red-700"
                        onClick={() => {
                            setIsDeleteDialogOpen(true)
                        }}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                    <SessionDeleteDialog
                        isOpen={isDeleteDialogOpen}
                        setOpen={setIsDeleteDialogOpen}
                        raidSession={raidSession}
                    />
                </div>
            </div>

            {/* Roster Panel */}
            <div className="bg-muted p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-2">
                        <div className="flex flex-wrap gap-2">
                            {tanks.map((character) => (
                                <div
                                    key={character.id}
                                    className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                >
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        charname={character.name}
                                        className="h-8 w-8 border-2 border-background rounded-lg"
                                    />
                                </div>
                            ))}

                            <Separator.Root
                                className="h-8 mr-3 ml-3 w-[1px] bg-gray-400"
                                decorative
                                orientation="vertical"
                            />

                            {healers.map((character) => (
                                <div
                                    key={character.id}
                                    className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                >
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        charname={character.name}
                                        className="h-8 w-8 border-2 border-background rounded-lg"
                                    />
                                </div>
                            ))}
                            <Separator.Root
                                className="h-8 mr-3 ml-3 w-[1px] bg-gray-400"
                                decorative
                                orientation="vertical"
                            />

                            {dps.map((character) => (
                                <div
                                    key={character.id}
                                    className="flex flex-col items-center rounded-lg cursor-pointer transition-transform hover:scale-110"
                                >
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        charname={character.name}
                                        className="h-8 w-8 border-2 border-background rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Looted items Panel */}
            <div className="bg-muted p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center text-yellow-400">
                        <ShoppingBag className="mr-2" /> Loots
                    </h2>
                    <Button
                        variant="outline"
                        className="bg-primary text-background hover:bg-primary/80"
                        onClick={() => setIsAddLootDialogOpen(true)}
                    >
                        <PlusIcon className="mr-2 h-4 w-4" /> Add Loot
                    </Button>
                </div>
                <SessionLootsPanel raidSessionId={raidSession.id} />
            </div>

            <SessionLootNewDialog
                isOpen={isAddLootDialogOpen}
                setOpen={setIsAddLootDialogOpen}
                raidSession={raidSession}
            />
        </div>
    )
}
