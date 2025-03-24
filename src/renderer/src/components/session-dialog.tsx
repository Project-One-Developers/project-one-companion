import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addRaidSession, editRaidSession } from '@renderer/lib/tanstack-query/raid'
import { NewRaidSession, RaidSessionWithRoster } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { type JSX } from 'react'
import { toast } from './hooks/use-toast'
import SessionForm from './session-form'
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './ui/dialog'

type RaidSessionDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    existingSession?: RaidSessionWithRoster
}

export default function RaidSessionDialog({
    isOpen,
    setOpen,
    existingSession
}: RaidSessionDialogProps): JSX.Element {
    const isEditing = existingSession != null
    if (isEditing) {
        console.log(`Editing session with ID: ${existingSession.id}`)
    }

    const addMutation = useMutation({
        mutationFn: addRaidSession,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.raidSessions] })
            setOpen(false)
            toast({
                title: 'Raid Session added',
                description: `Raid session ${arg.name} created successfully`
            })
        },
        onError: error => {
            toast({
                title: 'Errore',
                description: `Unable to create raid session. Errore: ${error.message}`
            })
        }
    })

    const editMutation = useMutation({
        mutationFn: editRaidSession,
        onSuccess: (_, arg) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.raidSession, arg.id]
            })
            setOpen(false)
            toast({
                title: 'Raid Session edited',
                description: `Raid session ${arg.name} edited successfully`
            })
        },
        onError: error => {
            toast({
                title: 'Error',
                description: `Unable to edit the raid session. Error: ${error.message}`
            })
        }
    })

    const handleSubmit = (editedSession: NewRaidSession) => {
        if (isEditing) {
            editMutation.mutate({ id: existingSession.id, ...editedSession })
        } else {
            addMutation.mutate(editedSession)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="sm:max-w-[425px] min-w-[900px]">
                    <DialogTitle className="text-2xl font-bold mb-4">
                        {isEditing ? 'Edit Raid Session' : 'Create Raid Session'}
                    </DialogTitle>
                    {/* <DialogDescription>
                        Insert raid info and the initial raid composition
                    </DialogDescription> */}
                    <SessionForm existingSession={existingSession} onSubmit={handleSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
