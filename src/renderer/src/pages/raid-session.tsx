import SessionDeleteDialog from '@renderer/components/session-delete-dialog'
import RaidSessionDialog from '@renderer/components/session-dialog'
import SessionLootNewDialog from '@renderer/components/session-loot-new-dialog'
import { SessionLootsPanel } from '@renderer/components/session-loots-panel'
import SessionRosterImportDialog from '@renderer/components/session-roster-dialog'
import { Button } from '@renderer/components/ui/button'
import { WowCharacterIcon } from '@renderer/components/ui/wowcharacter-icon'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { cloneRaidSession, fetchRaidSessionWithRoster } from '@renderer/lib/tanstack-query/raid'
import { formaUnixTimestampToItalianDate } from '@shared/libs/date/date-utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
    ArrowLeft,
    Calendar,
    Copy,
    Edit,
    LoaderCircle,
    LucideMedal,
    PlusIcon,
    ShoppingBag,
    Trash2,
    Users
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const RaidSessionPage = () => {
    const { raidSessionId } = useParams<{ raidSessionId: string }>()
    const navigate = useNavigate()

    // dialog
    const [isAddLootDialogOpen, setIsAddLootDialogOpen] = useState(false)
    const [isImportRosterDialogOpen, setIsImportRosterDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const { data: raidSession, isLoading } = useQuery({
        queryKey: [queryKeys.raidSession, raidSessionId],
        queryFn: () => fetchRaidSessionWithRoster(raidSessionId),
        enabled: !!raidSessionId
    })

    const cloneSessionMutation = useMutation({
        mutationFn: (id: string) => cloneRaidSession(id),
        onSuccess: clonedSession => {
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
        .filter(character => character.role === 'Tank')
        .sort((a, b) => a.class.localeCompare(b.class))

    const healers = raidSession.roster
        .filter(character => character.role === 'Healer')
        .sort((a, b) => a.class.localeCompare(b.class))

    const dps = raidSession.roster
        .filter(character => character.role === 'DPS')
        .sort((a, b) => a.class.localeCompare(b.class))

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-5 p-8 relative">
            {/* Page Header with integrated back button */}
            <div className="bg-muted rounded-lg p-6 shadow-lg flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {/* Back button integrated into header */}
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="hover:bg-gray-800 p-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold mb-2 text-blue-400">
                            {raidSession.name}
                        </h1>
                        <div className="flex items-center text-gray-400">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>{formaUnixTimestampToItalianDate(raidSession.raidDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            <span>
                                {raidSession.roster.length} ({tanks.length}/{healers.length}/
                                {dps.length})
                            </span>
                        </div>
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
                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-x-10">
                        {[
                            { characters: tanks, label: 'Tanks' },
                            { characters: healers, label: 'Healers' },
                            { characters: dps, label: 'DPS' }
                        ].map(({ characters }, index) => (
                            <div key={index} className="flex gap-2">
                                {characters.map(character => (
                                    <WowCharacterIcon key={character.id} character={character} />
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-x-2">
                        {/* Import roster by spreadsheet */}
                        <Button
                            variant="secondary"
                            className="hover:bg-blue-700"
                            onClick={() => setIsImportRosterDialogOpen(true)}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Import
                        </Button>
                    </div>
                </div>
                <SessionRosterImportDialog
                    isOpen={isImportRosterDialogOpen}
                    setOpen={setIsImportRosterDialogOpen}
                    raidSession={raidSession}
                />
            </div>

            {/* Looted items Panel */}
            <div className="bg-muted p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold flex items-center text-yellow-400">
                        <ShoppingBag className="mr-2" /> Loots
                    </h2>
                    <div className="flex items-center gap-x-2">
                        {/* Go to loot assign */}
                        <Button
                            variant="secondary"
                            className="hover:bg-blue-700"
                            onClick={() => {
                                navigate(`/assign?sessionId=${raidSession.id}`)
                            }}
                        >
                            <LucideMedal className="mr-2 h-4 w-4" /> Assign
                        </Button>
                        {/* Add new loots */}
                        <Button
                            variant="secondary"
                            className="hover:bg-blue-700"
                            onClick={() => setIsAddLootDialogOpen(true)}
                        >
                            <PlusIcon className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>
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
