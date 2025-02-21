import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { updateItemBisSpecs } from '@renderer/lib/tanstack-query/bis-list'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { WOW_CLASS_WITH_SPECS } from '@shared/libs/spec-parser/spec-utils.schemas'
import { Item } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useState, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type ItemWithBisSpecs = {
    item: Item
    specs: number[]
}
type ItemBisSpecsDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    itemAndSpecs: ItemWithBisSpecs | null
}

export default function ItemBisSpecsDialog({
    isOpen,
    setOpen,
    itemAndSpecs
}: ItemBisSpecsDialogProps): JSX.Element {
    const [selectedSpecs, setSelectedSpecs] = useState<number[]>(itemAndSpecs?.specs ?? [])

    const editMutation = useMutation({
        mutationFn: ({ itemId, specIds }: { itemId: number; specIds: number[] }) =>
            updateItemBisSpecs(itemId, specIds),
        onSuccess: () => {
            toast({ title: 'Success', description: 'BiS specs updated successfully' })
            queryClient.invalidateQueries({ queryKey: [queryKeys.bisList] })
            setOpen(false)
        },
        onError: (error) => {
            toast({ title: 'Error', description: `Failed to update BiS specs. ${error.message}` })
        }
    })

    if (!itemAndSpecs) return <p>No Item selected</p>

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Edit Best in Slot</DialogTitle>
                    <DialogDescription>
                        Add or remove the specs for which this item is BiS
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-1">
                    {WOW_CLASS_WITH_SPECS.map((classWithSpecs, index) => (
                        <div key={index} className="flex flex-row items-center">
                            <div className="flex">
                                <WowClassIcon
                                    wowClassName={classWithSpecs.name}
                                    className="h-8 w-8 border-2 border-background rounded-lg"
                                />
                                <ToggleGroup.Root
                                    type="multiple"
                                    className="flex ml-10 gap-2"
                                    value={selectedSpecs.map(String)}
                                    onValueChange={(values) => setSelectedSpecs(values.map(Number))}
                                >
                                    {classWithSpecs.specs.map((wowSpec) => (
                                        <ToggleGroup.Item
                                            key={wowSpec.id}
                                            value={String(wowSpec.id)}
                                            className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-gray-500 opacity-50 hover:opacity-80 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:opacity-100 transition"
                                        >
                                            <WowSpecIcon
                                                specId={wowSpec.id}
                                                className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                                title={wowSpec.name}
                                            />
                                        </ToggleGroup.Item>
                                    ))}
                                </ToggleGroup.Root>
                            </div>
                        </div>
                    ))}
                </div>
                <Button
                    className="w-full mt-4"
                    onClick={() =>
                        editMutation.mutate({
                            itemId: itemAndSpecs.item.id,
                            specIds: selectedSpecs
                        })
                    }
                    disabled={editMutation.isPending}
                >
                    {editMutation.isPending ? <Loader2 className="animate-spin" /> : 'Save'}
                </Button>
            </DialogContent>
        </Dialog>
    )
}
