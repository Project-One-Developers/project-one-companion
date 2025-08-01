import * as Tabs from '@radix-ui/react-tabs'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { updateItemBisSpecs } from '@renderer/lib/tanstack-query/bis-list'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { WOW_CLASS_WITH_SPECS } from '@shared/libs/spec-parser/spec-utils.schemas'
import { CharacterWithGears, Item } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, StickyNote, Users } from 'lucide-react'
import { useEffect, useState, type JSX } from 'react'
import { fetchCharactersWithItem, fetchItemNote, updateItemNote } from '../lib/tanstack-query/items'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/text-area'
import { WowCharacterIcon } from './ui/wowcharacter-icon'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowGearIcon } from './ui/wowgear-icon'
import { WowSpecIcon } from './ui/wowspec-icon'

type ItemWithBisSpecs = {
    item: Item
    specs: number[]
}

type ItemManagementDiaogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    itemAndSpecs: ItemWithBisSpecs | null
}

export default function ItemManagementDialog({
    isOpen,
    setOpen,
    itemAndSpecs
}: ItemManagementDiaogProps): JSX.Element {
    const [selectedSpecs, setSelectedSpecs] = useState<number[]>([])
    const [itemNote, setItemNote] = useState<string>('')
    const [activeTab, setActiveTab] = useState<string>('bis-specs')
    const [hasLoadedInventory, setHasLoadedInventory] = useState(false)

    // Track when inventory tab is accessed for the first time
    useEffect(() => {
        if (activeTab === 'inventory' && !hasLoadedInventory) {
            setHasLoadedInventory(true)
        }
    }, [activeTab, hasLoadedInventory])

    const editBisMutation = useMutation({
        mutationFn: ({ itemId, specIds }: { itemId: number; specIds: number[] }) =>
            updateItemBisSpecs(itemId, specIds),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'BiS specs updated successfully'
            })
            queryClient.invalidateQueries({ queryKey: [queryKeys.bisList] })
            setOpen(false)
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to update BiS specs: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    const itemNoteQuery = useQuery({
        queryKey: [queryKeys.itemNote, itemAndSpecs?.item.id],
        queryFn: () => fetchItemNote(itemAndSpecs!.item.id),
        enabled: !!itemAndSpecs?.item.id
    })

    // Replace saveNote with editItemNoteMutation
    const editItemNoteMutation = useMutation({
        mutationFn: ({ itemId, note }: { itemId: number; note: string }) =>
            updateItemNote(itemId, note),
        onSuccess: () => {
            toast({
                title: 'Success',
                description: 'Item note updated successfully'
            })
            queryClient.invalidateQueries({ queryKey: [queryKeys.itemNote, itemAndSpecs?.item.id] })
            queryClient.invalidateQueries({ queryKey: [queryKeys.allItemNotes] })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Failed to update item note: ${error.message}`,
                variant: 'destructive'
            })
        }
    })

    // Sync selectedSpecs when itemAndSpecs changes
    useEffect(() => {
        if (itemAndSpecs) {
            setSelectedSpecs(itemAndSpecs.specs)
        }
        if (itemNoteQuery.data !== undefined) {
            setItemNote(itemNoteQuery.data)
        }
    }, [itemAndSpecs, itemNoteQuery.data])

    const handleSaveNote = () => {
        if (!itemAndSpecs) return

        editItemNoteMutation.mutate({
            itemId: itemAndSpecs.item.id,
            note: itemNote
        })
    }

    const handleBisSave = () => {
        if (!itemAndSpecs) return

        editBisMutation.mutate({
            itemId: itemAndSpecs.item.id,
            specIds: selectedSpecs
        })
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
                            {WOW_CLASS_WITH_SPECS.map((classWithSpecs, index) => {
                                // Filter specs based on itemAndSpecs.item.specIds
                                const filteredSpecs =
                                    itemAndSpecs.item.specIds &&
                                    itemAndSpecs.item.specIds.length > 0
                                        ? classWithSpecs.specs.filter(spec =>
                                              itemAndSpecs.item.specIds!.includes(spec.id)
                                          )
                                        : classWithSpecs.specs

                                // Only render the class if it has specs to show
                                if (filteredSpecs.length === 0) {
                                    return null
                                }

                                return (
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
                                                onValueChange={values =>
                                                    setSelectedSpecs(values.map(Number))
                                                }
                                            >
                                                {filteredSpecs.map(wowSpec => (
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
                                )
                            })}
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={handleBisSave}
                            disabled={editBisMutation.isPending}
                        >
                            {editBisMutation.isPending ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                'Save BiS Specs'
                            )}
                        </Button>
                    </Tabs.Content>

                    {/* Tab 2: Character Inventory - Now with lazy loading */}
                    <Tabs.Content value="inventory" className="mt-4">
                        {hasLoadedInventory ? (
                            <CharacterInventoryContent itemId={itemAndSpecs.item.id} />
                        ) : (
                            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                                Click to load character inventory...
                            </div>
                        )}
                    </Tabs.Content>

                    {/* Tab 3: Notes */}
                    <Tabs.Content value="notes" className="mt-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <Textarea
                                    placeholder="Add any notes about this item (priority, special considerations, etc.)"
                                    value={itemNote}
                                    onChange={e => setItemNote(e.target.value)}
                                    className="min-h-[200px] resize-none"
                                />
                            </div>
                            <Button
                                onClick={handleSaveNote}
                                disabled={editItemNoteMutation.isPending}
                                className="w-full"
                            >
                                {editItemNoteMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Note'
                                )}
                            </Button>
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}

// Lazy component for Character Inventory
function CharacterInventoryContent({ itemId }: { itemId: number }) {
    const characterInventoryQuery = useQuery({
        queryKey: [queryKeys.characterInventory, itemId],
        queryFn: () => fetchCharactersWithItem(itemId),
        enabled: !!itemId
    })

    if (characterInventoryQuery.isLoading) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                <Loader2 className="animate-spin h-8 w-8" />
                <span className="ml-2">Loading character inventory...</span>
            </div>
        )
    }

    if (characterInventoryQuery.error) {
        return (
            <div className="flex items-center justify-center h-[200px] text-red-500">
                Error loading character inventory
            </div>
        )
    }

    const charactersWithGears: CharacterWithGears[] | undefined = characterInventoryQuery.data
    if (!charactersWithGears) {
        return (
            <div className="flex items-center justify-center h-[200px]">
                No inventory data available
            </div>
        )
    }

    // Split characters into two groups
    const charactersWithMatchingItem = charactersWithGears.filter(
        char => char.gears && char.gears.some(gear => gear.item.id === itemId)
    )

    const charactersWithoutMatchingItem = charactersWithGears.filter(
        char => !char.gears || !char.gears.some(gear => gear.item.id === itemId)
    )

    return (
        <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto">
            {/* Characters WITH the item */}
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-green-400">
                    Characters with this item ({charactersWithMatchingItem.length})
                </h3>
                {charactersWithMatchingItem.length === 0 ? (
                    <p className="text-muted-foreground">No characters currently have this item.</p>
                ) : (
                    charactersWithMatchingItem.map(character => {
                        // Get all gears that match the item ID
                        const matchingGears =
                            character.gears?.filter(gear => gear.item.id === itemId) || []

                        return (
                            <div
                                key={character.id}
                                className="flex flex-col gap-2 p-3 bg-green-900/20 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    <div>
                                        <WowClassIcon
                                            wowClassName={character.class}
                                            className="h-8 w-8 border-2 border-background rounded-lg"
                                        />
                                        <div className="text-xs">{character.name}</div>
                                    </div>
                                    <div className="flex">
                                        {matchingGears.map((gear, index) => (
                                            <div
                                                key={index}
                                                className="flex text-xs text-muted-foreground bg-muted/50 p-2 rounded"
                                            >
                                                <WowGearIcon
                                                    gearItem={gear}
                                                    showTierBanner={true}
                                                    showItemTrackDiff={true}
                                                />
                                                {/* {gear.source && (
                                                    <div className="text-xs opacity-75 capitalize">
                                                        {gear.source}
                                                    </div>
                                                )} */}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Separator */}
            <div className="border-t border-muted-foreground/20 my-2"></div>

            {/* Characters WITHOUT the item */}
            <div className="flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-muted-foreground">
                    Characters without this item ({charactersWithoutMatchingItem.length})
                </h3>
                <div className="flex flex-wrap gap-x-5 gap-y-5">
                    {' '}
                    {charactersWithoutMatchingItem
                        .sort((a, b) => Number(b.main) - Number(a.main))
                        .map(character => (
                            <div key={character.id} className="flex gap-2">
                                <WowCharacterIcon key={character.id} character={character} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}
