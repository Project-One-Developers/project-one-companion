import { zodResolver } from '@hookform/resolvers/zod'
import * as Tabs from '@radix-ui/react-tabs'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { searchItems } from '@renderer/lib/tanstack-query/items'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addLootsFromRc, addLootsManual } from '@renderer/lib/tanstack-query/loots'
import { newLootSchema } from '@shared/schemas/loot.schema'
import { Item, RaidSession } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, LoaderCircle, X } from 'lucide-react'
import { useState, type JSX } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Checkbox } from './ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/text-area'
import { WowItemIcon } from './ui/wowitem-icon'

type SessionLootNewDialogProps = {
    isOpen: boolean
    setOpen: (open: boolean) => void
    raidSession: RaidSession
}

const manualFormSchema = z.object({
    items: z.array(newLootSchema)
})

const rcLootFormSchema = z.object({
    csvData: z.string().min(1, 'CSV data is required')
})

type ManualFormValues = z.infer<typeof manualFormSchema>
type RcLootFormValues = z.infer<typeof rcLootFormSchema>

export default function SessionLootNewDialog({
    isOpen,
    setOpen,
    raidSession
}: SessionLootNewDialogProps): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItems, setSelectedItems] = useState<Item[]>([])

    const manualForm = useForm<ManualFormValues>({
        resolver: zodResolver(manualFormSchema),
        defaultValues: {
            items: []
        }
    })

    const rcLootForm = useForm<RcLootFormValues>({
        resolver: zodResolver(rcLootFormSchema),
        defaultValues: {
            csvData: ''
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: manualForm.control,
        name: 'items'
    })

    const { data: items, isLoading } = useQuery({
        queryKey: [queryKeys.itemSearch, searchTerm],
        queryFn: () => searchItems(searchTerm),
        enabled: searchTerm.length > 2
    })

    const addManualLootsMutation = useMutation({
        mutationFn: addLootsManual,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            manualForm.reset()
            setSelectedItems([])
            setOpen(false)
            toast({
                title: 'Loots added',
                description: 'The loots have been successfully added to the raid session.'
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Unable to add the loots. Error: ${error.message}`
            })
        }
    })

    const addRcLootsMutation = useMutation({
        mutationFn: addLootsFromRc,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            rcLootForm.reset()
            setOpen(false)
            toast({
                title: 'RCLoot CSV imported',
                description:
                    'The loots from RCLoot CSV have been successfully added to the raid session.'
            })
        },
        onError: (error: Error) => {
            toast({
                title: 'Error',
                description: `Unable to import RCLoot CSV. Error: ${error.message}`
            })
        }
    })

    function onManualSubmit(values: ManualFormValues): void {
        addManualLootsMutation.mutate({ raidSessionId: raidSession.id, loots: values.items })
    }

    function onRcLootSubmit(values: RcLootFormValues): void {
        addRcLootsMutation.mutate({ raidSessionId: raidSession.id, csv: values.csvData })
    }

    const handleItemSelect = (item: Item) => {
        setSelectedItems([...selectedItems, item])
        append({ itemId: item.id, bonusString: '', socket: false, raidDifficulty: 'Normal' })
        setSearchTerm('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>New Loots</DialogTitle>
                    <DialogDescription>
                        Add new loots manually or import from RCLoot
                    </DialogDescription>
                </DialogHeader>
                <Tabs.Root defaultValue="manual" className="w-full">
                    <Tabs.List className="flex border-b mb-4">
                        <Tabs.Trigger
                            value="manual"
                            className="px-4 py-2 flex-1 text-center hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            Manual Entry
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="rcloot"
                            className="px-4 py-2 flex-1 flex items-center justify-center space-x-2 hover:bg-muted data-[state=active]:border-b-2 data-[state=active]:border-primary"
                        >
                            <img
                                className="w-6 h-6"
                                src="https://c10.patreonusercontent.com/4/patreon-media/p/campaign/2992019/d12a606658904befb227df7926aa076d/eyJoIjoxMDgwLCJ3IjoxMDgwfQ%3D%3D/1.png?token-time=1738540800&token-hash=lk4XeKgnSfqKBtsVG1iAHy5m4MtFdo-lr3cYMcjeego%3D"
                                alt="RCLoot CSV"
                            />
                            <span>RCLoot CSV</span>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="manual" className="p-4">
                        <Form {...manualForm}>
                            <form
                                onSubmit={manualForm.handleSubmit(onManualSubmit)}
                                className="space-y-4"
                            >
                                <div>
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search for an item..."
                                    />
                                    {isLoading && (
                                        <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                                            <LoaderCircle className="animate-spin text-5xl" />
                                        </div>
                                    )}
                                    {items && (
                                        <ul className="mt-2 max-h-60 overflow-y-auto">
                                            {items.map((item) => (
                                                <li
                                                    key={item.id}
                                                    className="cursor-pointer hover:bg-muted p-2"
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        handleItemSelect(item)
                                                    }}
                                                >
                                                    <WowItemIcon
                                                        item={item}
                                                        iconOnly={false}
                                                        raidDiff="Heroic"
                                                        className="mt-2"
                                                        iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="flex items-center space-x-2 p-2 border rounded"
                                        >
                                            <WowItemIcon
                                                item={selectedItems[index]}
                                                iconOnly={false}
                                                raidDiff="Heroic"
                                                className="mt-2"
                                                iconClassName="object-cover object-top rounded-full h-10 w-10 border border-background"
                                            />

                                            <FormField
                                                control={manualForm.control}
                                                name={`items.${index}.socket`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
                                                        </FormControl>
                                                        <FormLabel>Socket</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={manualForm.control}
                                                name={`items.${index}.bonusString`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                value={field.value || ''}
                                                                onChange={(e) =>
                                                                    field.onChange(
                                                                        e.target.value || null
                                                                    )
                                                                }
                                                                placeholder="Item Bonus (optional)"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={manualForm.control}
                                                name={`items.${index}.raidDifficulty`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Raid Difficulty" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="Normal">
                                                                    Normal
                                                                </SelectItem>
                                                                <SelectItem value="Heroic">
                                                                    Heroic
                                                                </SelectItem>
                                                                <SelectItem value="Mythic">
                                                                    Mythic
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={() => remove(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={addManualLootsMutation.isPending}
                                >
                                    {addManualLootsMutation.isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Add Loots'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </Tabs.Content>
                    <Tabs.Content value="rcloot" className="p-4">
                        <Form {...rcLootForm}>
                            <form
                                onSubmit={rcLootForm.handleSubmit(onRcLootSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={rcLootForm.control}
                                    name="csvData"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>RCLoot CSV Data</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Paste your RCLoot CSV data here..."
                                                    rows={10}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={addRcLootsMutation.isPending}
                                >
                                    {addRcLootsMutation.isPending ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        'Import Loots'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
