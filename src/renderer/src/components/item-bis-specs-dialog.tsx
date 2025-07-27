
import * as Tabs from '@radix-ui/react-tabs'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { updateItemBisSpecs } from '@renderer/lib/tanstack-query/bis-list'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { WOW_CLASS_WITH_SPECS } from '@shared/libs/spec-parser/spec-utils.schemas'
import { Item } from '@shared/types/types'
import { useMutation } from '@tanstack/react-query'
import { Loader2, Users, StickyNote } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowSpecIcon } from './ui/wowspec-icon'
import { Textarea } from './ui/text-area'

type ItemWithBisSpecs = {
    item: Item
    specs: number[]
}

type ItemBisSpecsDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    itemAndSpecs: ItemWithBisSpecs | null
}

// Mock data for character inventory - replace with actual data fetching
const mockCharactersWithItem = [
    { name: "Paladin Tank", class: "paladin", spec: "Protection", hasItem: true },
    { name: "Warrior DPS", class: "warrior", spec: "Fury", hasItem: true },
    { name: "Mage Fire", class: "mage", spec: "Fire", hasItem: false }
]

export default function ItemBisSpecsDialog({
                                               isOpen,
                                               setOpen,
                                               itemAndSpecs
                                           }: ItemBisSpecsDialogProps): JSX.Element {
    const [selectedSpecs, setSelectedSpecs] = useState<number[]>([])
    const [itemNote, setItemNote] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>('bis-specs')

    // Sync selectedSpecs when itemAndSpecs changes
    useEffect(() => {
        if (itemAndSpecs) {
            setSelectedSpecs(itemAndSpecs.specs)
            // Load item note from storage or API
            setItemNote('') // Replace with actual note loading
        }
    }, [itemAndSpecs])

    const editMutation = useMutation({
        mutationFn: ({ itemId, specIds }: { itemId: number; specIds: number[] }) =>
            updateItemBisSpecs(itemId, specIds),
        onSuccess: () => {
            toast({ title: 'Success', description: 'BiS specs updated successfully' })
            queryClient.invalidateQueries({ queryKey: [queryKeys.bisList] })
            setOpen(false)
        },
        onError: error => {
            toast({ title: 'Error', description: `Failed to update BiS specs. ${error.message}` })
        }
    })

    const saveNote = () => {
        // TODO: Implement note saving logic
        toast({ title: 'Success', description: 'Note saved successfully' })
    }

    if (!itemAndSpecs) return <p>No Item selected</p>

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Item Management - {itemAndSpecs.item.name}</DialogTitle>
                    <DialogDescription>
                        Manage BiS specs, view character inventory, and add notes for this item
                    </DialogDescription>
                </DialogHeader>

                <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <Tabs.List className="grid w-full grid-cols-3 mb-4">
                        <Tabs.Trigger
                            value="bis-specs"
                            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary/80 transition-colors"
                        >
                            BiS Specs
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="inventory"
                            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                        >
                            <Users size={16} />
                            Character Inventory
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="notes"
                            className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                        >
                            <StickyNote size={16} />
                            Notes
                        </Tabs.Trigger>
                    </Tabs.List>

                    {/* Tab 1: BiS Specs (existing logic) */}
                    <Tabs.Content value="bis-specs" className="mt-4">
                        <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                            {WOW_CLASS_WITH_SPECS.map((classWithSpecs, index) => (
                                <div key={index} className="flex flex-row items-center">
                                    <div className="flex">
                                        <WowClassIcon
                                            wowClassName={classWithSpecs.name}
                                            className="h-8 w-8 border-2 border-background rounded-lg"
                                        />
                                        <ToggleGroup.Root
                                            type="multiple"
                                            className="flex ml-4 gap-2"
                                            value={selectedSpecs.map(String)}
                                            onValueChange={values => setSelectedSpecs(values.map(Number))}
                                        >
                                            {classWithSpecs.specs.map(wowSpec => (
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
                            {editMutation.isPending ? <Loader2 className="animate-spin" /> : 'Save BiS Specs'}
                        </Button>
                    </Tabs.Content>


                    {/* Tab 2: Character Inventory */}
                    <Tabs.Content value="inventory" className="mt-4">
                        <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                            <h3 className="text-lg font-semibold mb-2">Characters with this item:</h3>
                            {mockCharactersWithItem.filter(char => char.hasItem).length === 0 ? (
                                <p className="text-muted-foreground">No characters currently have this item.</p>
                            ) : (
                                mockCharactersWithItem
                                    .filter(char => char.hasItem)
                                    .map((character, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                                            <WowClassIcon
                                                wowClassName={character.class}
                                                className="h-8 w-8 border-2 border-background rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{character.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {character.class} - {character.spec}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )}

                            <h3 className="text-lg font-semibold mt-4 mb-2">All characters:</h3>
                            {mockCharactersWithItem.map((character, index) => (
                                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${character.hasItem ? 'bg-green-900/20' : 'bg-muted'}`}>
                                    <WowClassIcon
                                        wowClassName={character.class}
                                        className="h-8 w-8 border-2 border-background rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <div className="font-medium">{character.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {character.class} - {character.spec}
                                        </div>
                                    </div>
                                    <div className={`text-sm font-medium ${character.hasItem ? 'text-green-400' : 'text-muted-foreground'}`}>
                                        {character.hasItem ? 'Has Item' : 'No Item'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tabs.Content>

                    {/* Tab 3: Notes */}
                    <Tabs.Content value="notes" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Textarea
                                    placeholder="Add any notes about this item (priority, special considerations, etc.)"
                                    value={itemNote}
                                    onChange={(e) => setItemNote(e.target.value)}
                                    className="min-h-[200px] resize-none"
                                />
                            </div>
                            <Button onClick={saveNote} className="w-full">
                                Save Note
                            </Button>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
