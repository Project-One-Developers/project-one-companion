import { Loader2 } from 'lucide-react'

import { type JSX } from 'react'
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
    onDelete: () => void
    isDeleting: boolean
}

export default function SessionDeleteDialog({
    isOpen,
    onOpenChange,
    onDelete,
    isDeleting
}: SessionDeleteDialogProps): JSX.Element {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>Delete Session</DialogTitle>
                    <DialogDescription>
                        The raid session and relative loot data will be permanently deleted from the
                        database
                    </DialogDescription>
                    <Button variant="destructive" disabled={isDeleting} onClick={onDelete}>
                        {isDeleting ? <Loader2 className="animate-spin" /> : 'Confirm'}
                    </Button>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}
