import { NewRaidSession, RaidSession } from '@shared/types/types'
import { type JSX } from 'react'
import SessionForm from './session-form'
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from './ui/dialog'

type EditSessionDialogProps = {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    existingSession: RaidSession
    onSubmit: (editedSession: NewRaidSession) => void
}

export default function EditSessionDialog({
    isOpen,
    onOpenChange,
    existingSession,
    onSubmit
}: EditSessionDialogProps): JSX.Element {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
                <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl">
                    <DialogTitle className="text-2xl font-bold mb-4">Edit Session</DialogTitle>
                    <SessionForm existingSession={existingSession} onSubmit={onSubmit} />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
