import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { deleteRaidSession } from '@renderer/lib/tanstack-query/raid'
import { RaidSession } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { type JSX } from 'react'
import { useNavigate } from 'react-router'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogTitle
} from './ui/dialog'

type SessionDeleteDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    raidSession: RaidSession
}

export default function SessionDeleteDialog({
    isOpen,
    onOpenChange,
    raidSession
}: SessionDeleteDialogProps): JSX.Element {
    const navigate = useNavigate()

    const deleteMutation = useMutation({
        mutationFn: deleteRaidSession,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.raidSessions] })
            navigate(`/raid-session`) // go to main session page
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: `Unable to delete the raid session. Error: ${error.message}`
            })
        }
    })

    const handleDeleteSession = () => {
        console.log(`Deleting session with ID: ${raidSession.id}`)
        deleteMutation.mutate(raidSession.id)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Session</DialogTitle>
                    <DialogDescription>
                        The raid session <strong>{raidSession.name}</strong> and relative loot data
                        will be permanently deleted from the database
                    </DialogDescription>
                    <Button
                        variant="destructive"
                        disabled={deleteMutation.isPending}
                        onClick={handleDeleteSession}
                    >
                        {deleteMutation.isPending ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            'Confirm'
                        )}
                    </Button>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
