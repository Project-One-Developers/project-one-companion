import * as Tabs from '@radix-ui/react-tabs'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { queryClient } from '@renderer/lib/tanstack-query/client'
import { searchItems } from '@renderer/lib/tanstack-query/items'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { addLootsFromMrt, addLootsFromRc, addLootsManual } from '@renderer/lib/tanstack-query/loots'
import { RAID_DIFF } from '@shared/consts/wow.consts'
import { Item, NewLootManual, RaidSessionWithRoster, WowRaidDifficulty } from '@shared/types/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle, X } from 'lucide-react'
import { useState, type JSX } from 'react'
import { toast } from './hooks/use-toast'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Textarea } from './ui/text-area'
import { WowItemIcon } from './ui/wowitem-icon'

export default function SessionLootNewDialog({
    isOpen,
    setOpen,
    raidSession
}: {
    isOpen: boolean
    setOpen: (open: boolean) => void
    raidSession: RaidSessionWithRoster
}): JSX.Element {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedItems, setSelectedItems] = useState<NewLootManual[]>([])
    const [rcCsvData, setRcInputData] = useState('')
    const [mrtData, setMrtData] = useState('')

    const { data: items, isLoading } = useQuery({
        queryKey: [queryKeys.itemSearch, searchTerm],
        queryFn: () => searchItems(searchTerm),
        enabled: searchTerm.length > 2
    })

    const addManualLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, loots }: { raidSessionId: string; loots: NewLootManual[] }) =>
            addLootsManual(raidSessionId, loots),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            setSelectedItems([])
            setOpen(false)
            toast({ title: 'Loots added', description: 'Loots successfully added.' })
        },
        onError: error => {
            toast({ title: 'Error', description: `Failed to add loots. ${error.message}` })
        }
    })

    const addRcLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, csv }: { raidSessionId: string; csv: string }) =>
            addLootsFromRc(raidSessionId, csv),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            setRcInputData('')
            setOpen(false)
            toast({ title: 'RCLoot CSV imported', description: 'Loots successfully imported.' })
        },
        onError: error => {
            toast({ title: 'Error', description: `Failed to import RC. ${error.message}` })
        }
    })

    const addMrtLootsMutation = useMutation({
        mutationFn: ({ raidSessionId, text }: { raidSessionId: string; text: string }) =>
            addLootsFromMrt(raidSessionId, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [queryKeys.lootsBySession, raidSession.id] })
            setMrtData('')
            setOpen(false)
            toast({ title: 'MRT loots imported', description: 'Loots successfully imported.' })
        },
        onError: error => {
            toast({ title: 'Error', description: `Failed to import MRT. ${error.message}` })
        }
    })

    const handleItemSelect = (item: Item) => {
        const newloot: NewLootManual = {
            itemId: item.id,
            raidDifficulty: 'Heroic',
            hasSocket: false,
            hasAvoidance: false,
            hasLeech: false,
            hasSpeed: false
        }
        setSelectedItems([...selectedItems, newloot])
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
                            className="px-4 py-2 flex-1 text-center hover:bg-muted"
                        >
                            Manual Entry
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="rcloot"
                            className="px-4 py-2 flex-1 text-center hover:bg-muted"
                        >
                            RCLoot CSV
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="mrt"
                            className="px-4 py-2 flex-1 text-center hover:bg-muted"
                        >
                            MRT
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="manual" className="p-4">
                        <Input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search for an item..."
                        />
                        {isLoading && <LoaderCircle className="animate-spin text-5xl" />}
                        {items && (
                            <ul className="mt-2 max-h-60 overflow-y-auto">
                                {items.map(item => (
                                    <li
                                        key={item.id}
                                        className="cursor-pointer hover:bg-muted p-2"
                                        onClick={e => {
                                            e.preventDefault()
                                            handleItemSelect(item)
                                        }}
                                    >
                                        <WowItemIcon
                                            item={item}
                                            iconOnly={false}
                                            raidDiff="Mythic"
                                            showIlvl={false}
                                            className="mt-2"
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="space-y-2 mt-2">
                            {selectedItems.map((selectedItem, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 p-2 border rounded"
                                >
                                    <div className="flex">
                                        <WowItemIcon
                                            item={selectedItem.itemId}
                                            iconOnly={false}
                                            raidDiff={selectedItem.raidDifficulty}
                                            className=""
                                        />
                                    </div>

                                    {/* Raid Difficulty Selection */}
                                    <div className="flex">
                                        <Select
                                            value={selectedItem.raidDifficulty}
                                            onValueChange={(value: WowRaidDifficulty) => {
                                                const updatedItems = [...selectedItems]
                                                updatedItems[index].raidDifficulty = value
                                                setSelectedItems(updatedItems)
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select difficulty" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {RAID_DIFF.map(difficulty => (
                                                    <SelectItem key={difficulty} value={difficulty}>
                                                        {difficulty}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Item bonus */}
                                    <div className="flex">
                                        <ToggleGroup.Root
                                            type="multiple"
                                            className="flex gap-2"
                                            value={Object.keys(selectedItem).filter(
                                                key => selectedItem[key]
                                            )}
                                            onValueChange={values => {
                                                const updatedItems = [...selectedItems]
                                                updatedItems[index] = {
                                                    ...updatedItems[index],
                                                    hasSocket: values.includes('hasSocket'),
                                                    hasAvoidance: values.includes('hasAvoidance'),
                                                    hasLeech: values.includes('hasLeech'),
                                                    hasSpeed: values.includes('hasSpeed')
                                                }
                                                setSelectedItems(updatedItems)
                                            }}
                                        >
                                            <ToggleGroup.Item
                                                value="hasSocket"
                                                className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-gray-500 opacity-50 hover:opacity-80 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:opacity-100 transition"
                                            >
                                                Socket
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item
                                                value="hasAvoidance"
                                                className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-gray-500 opacity-50 hover:opacity-80 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:opacity-100 transition"
                                            >
                                                A
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item
                                                value="hasLeech"
                                                className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-gray-500 opacity-50 hover:opacity-80 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:opacity-100 transition"
                                            >
                                                L
                                            </ToggleGroup.Item>
                                            <ToggleGroup.Item
                                                value="hasSpeed"
                                                className="px-3 py-1 rounded-md border border-gray-700 bg-gray-900 text-gray-500 opacity-50 hover:opacity-80 data-[state=on]:bg-green-600 data-[state=on]:text-white data-[state=on]:opacity-100 transition"
                                            >
                                                S
                                            </ToggleGroup.Item>
                                        </ToggleGroup.Root>
                                    </div>

                                    <div className="flex ml-auto">
                                        <Button
                                            variant="ghost"
                                            onClick={() =>
                                                setSelectedItems(
                                                    selectedItems.filter((_, i) => i !== index)
                                                )
                                            }
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            className="w-full mt-4"
                            onClick={() =>
                                addManualLootsMutation.mutate({
                                    raidSessionId: raidSession.id,
                                    loots: selectedItems
                                })
                            }
                        >
                            Add Loots
                        </Button>
                    </Tabs.Content>
                    <Tabs.Content value="rcloot" className="p-4">
                        <Textarea
                            value={rcCsvData}
                            onChange={e => setRcInputData(e.target.value)}
                            placeholder="Paste RCLoot CSV data here..."
                            rows={10}
                        />
                        <Button
                            className="w-full mt-4"
                            onClick={() =>
                                addRcLootsMutation.mutate({
                                    raidSessionId: raidSession.id,
                                    csv: rcCsvData
                                })
                            }
                        >
                            Import Loots
                        </Button>
                    </Tabs.Content>
                    <Tabs.Content value="mrt" className="p-4">
                        <Textarea
                            value={mrtData}
                            onChange={e => setMrtData(e.target.value)}
                            placeholder="Paste MRT data here..."
                            rows={10}
                        />
                        <Button
                            className="w-full mt-4"
                            onClick={() =>
                                addMrtLootsMutation.mutate({
                                    raidSessionId: raidSession.id,
                                    text: mrtData
                                })
                            }
                        >
                            Import Loots
                        </Button>
                    </Tabs.Content>
                </Tabs.Root>
            </DialogContent>
        </Dialog>
    )
}
