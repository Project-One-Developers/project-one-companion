import ItemBisSpecsDialog from '@renderer/components/item-bis-specs-dialog'
import { Button } from '@renderer/components/ui/button'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { fetchBisList } from '@renderer/lib/tanstack-query/bis-list'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { BisList, BossWithItems, Item, WowItemSlotKey } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import { LoaderCircle, Pencil } from 'lucide-react'

import { useState, type JSX } from 'react'

const slotBis: WowItemSlotKey[] = ['finger', 'trinket']

// Boss Card Component
type BossPanelProps = {
    boss: BossWithItems
    bisLists: BisList[]
    editMode: boolean
    onEdit: (item: Item) => void
}

const BossPanel = ({ boss, bisLists, editMode, onEdit }: BossPanelProps) => {
    return (
        <div className="flex flex-col bg-muted rounded-lg overflow-hidden min-w-[250px]">
            {/* Boss header: cover + name */}
            <div className="flex flex-col gap-y-2">
                <img
                    src={encounterIcon.get(boss.id)}
                    alt={`${boss.name} icon`}
                    className="w-full h-32 object-scale-down"
                />
                <h2 className="text-center text-xs font-bold">{boss.name}</h2>
            </div>
            {/* Boss items */}
            <div className="flex flex-col gap-y-3 p-6">
                {boss.items
                    .filter((i) => i.veryRare || slotBis.includes(i.slotKey))
                    .map((item) => {
                        const bisForItem = bisLists.find((bis) => bis.itemId === item.id)

                        return (
                            <div
                                key={item.id}
                                className="flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer"
                            >
                                <WowItemIcon
                                    item={item}
                                    iconOnly={false}
                                    raidDiff={'Mythic'}
                                    tierBanner={true}
                                    showIlvl={false}
                                    iconClassName=""
                                />

                                <div className="flex flex-row items-center gap-x-1">
                                    {bisForItem &&
                                        bisForItem.specIds.map((s) => (
                                            <WowSpecIcon
                                                key={item.id + '-' + s}
                                                specId={s}
                                                className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                            />
                                        ))}
                                </div>

                                {editMode && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className=" h-5 w-5"
                                        onClick={() => onEdit(item)}
                                    >
                                        <Pencil />
                                    </Button>
                                )}
                            </div>
                        )
                    })}
            </div>
        </div>
    )
}

// Main Component

type ItemWithBisSpecs = {
    item: Item
    specs: number[]
}

export default function BisListPage(): JSX.Element {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState<ItemWithBisSpecs | null>(null)
    const itemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, CURRENT_RAID_ID],
        queryFn: () => fetchRaidLootTable(CURRENT_RAID_ID)
    })
    const bisRes = useQuery({
        queryKey: [queryKeys.bisList],
        queryFn: () => fetchBisList()
    })

    if (itemRes.isLoading || bisRes.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const items = itemRes.data ?? []
    const bisLists = bisRes.data ?? []

    const handleEditClick = (item: Item) => {
        const selectedBis = bisLists.find((b) => b.itemId === item.id)
        setSelectedItem({ item: item, specs: selectedBis?.specIds ?? [] })
        setIsEditDialogOpen(true)
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {items.map((boss) => (
                    <BossPanel
                        key={boss.id}
                        boss={boss}
                        bisLists={bisLists}
                        editMode={true}
                        onEdit={handleEditClick}
                    />
                ))}
            </div>
            {selectedItem && (
                <ItemBisSpecsDialog
                    isOpen={isEditDialogOpen}
                    setOpen={setIsEditDialogOpen}
                    itemAndSpecs={selectedItem}
                />
            )}
        </div>
    )
}
