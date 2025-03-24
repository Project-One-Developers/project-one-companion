import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { importRosterInRaidSession } from '@renderer/lib/tanstack-query/raid'
import { RaidSessionWithRoster } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { useState, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/text-area'

export default function SessionRosterImportDialog({
    isOpen,
    setOpen,
    raidSession
}: {
    isOpen: boolean
    setOpen: (open: boolean) => void
    raidSession: RaidSessionWithRoster
}): JSX.Element {
    const [rosterData, setRosterData] = useState('')

    const addMrtLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, text }: { raidSessionId: string; text: string }) =>
            importRosterInRaidSession(raidSessionId, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.raidSession, raidSession.id] })
            setRosterData('')
            setOpen(false)
            toast({ title: 'Roster imported', description: 'Roster successfully imported.' })
        },
        onError: error => {
            toast({ title: 'Error', description: `Failed to import Roster. ${error.message}` })
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Roster</DialogTitle>
                    <DialogDescription>
                        Paste roster composition here, each row is a CharacterName-ServerName or
                        CharacterName
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    value={rosterData}
                    onChange={e => setRosterData(e.target.value)}
                    placeholder="Paste Roster data here..."
                    rows={20}
                    spellCheck="false"
                />
                <Button
                    className="w-full mt-4"
                    onClick={() =>
                        addMrtLootsMutation.mutate({
                            raidSessionId: raidSession.id,
                            text: rosterData
                        })
                    }
                >
                    Import Roster
                </Button>
            </DialogContent>
        </Dialog>
    )
}
