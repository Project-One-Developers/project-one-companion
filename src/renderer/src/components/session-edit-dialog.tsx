import { NewRaidSession, RaidSession } from '@shared/types/types'
import { type JSX } from 'react'
import SessionForm from './session-form'
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './ui/dialog'

type SessionEditDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    existingSession: RaidSession
    onSubmit: (editedSession: NewRaidSession) => void
}

export default function SessionEditDialog({
    isOpen,
    onOpenChange,
    existingSession,
    onSubmit
}: SessionEditDialogProps): JSX.Element {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle className="text-2xl font-bold mb-4">Edit Session</DialogTitle>
                    <SessionForm existingSession={existingSession} onSubmit={onSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
