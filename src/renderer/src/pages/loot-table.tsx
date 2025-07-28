import ItemManagementDialog from '@renderer/components/item-management-dialog'
import { Input } from '@renderer/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { fetchBisList } from '@renderer/lib/tanstack-query/bis-list'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { BisList, BossWithItems, Item } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Edit, LoaderCircle } from 'lucide-react'

import { useEffect, useMemo, useState, type JSX } from 'react'

//const slotBis: WowItemSlotKey[] = ['finger', 'neck', 'trinket', 'main_hand', 'off_hand']

// Boss Card Component
type BossPanelProps = {
    boss: BossWithItems
    bisLists: BisList[]
    onEdit: (item: Item) => void
}

const BossPanel = ({ boss, bisLists, onEdit }: BossPanelProps) => {
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
                    .filter(i => !i.token && !i.tierset)
                    .sort((a, b) => {
                        const aHasBis = bisLists.some(bis => bis.itemId === a.id)
                        const bHasBis = bisLists.some(bis => bis.itemId === b.id)
                        if (aHasBis && !bHasBis) return -1
                        if (!aHasBis && bHasBis) return 1
                        return 0
                    })
                    .map(item => {
                        const bisForItem = bisLists.filter(bis => bis.itemId === item.id)
                        const allSpecIds = bisForItem.flatMap(bis => bis.specIds)
                        // const uniqueClasses = Array.from(
                        //     new Set(allSpecIds.map((specId) => getWowClassBySpecId(specId)?.name))
                        // )

                        return (
                            <div
                                key={item.id}
                                className={clsx(
                                    'flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer relative group',
                                    !allSpecIds.length && 'opacity-30'
                                )}
                                onClick={e => {
                                    e.preventDefault()
                                    onEdit(item)
                                }}
                            >
                                <WowItemIcon
                                    item={item}
                                    iconOnly={false}
                                    raidDiff={'Mythic'}
                                    tierBanner={true}
                                    showIlvl={false}
                                    showRoleIcons={true}
                                    iconClassName=""
                                />

                                <div className="flex flex-col items-center">
                                    <div className="text-xs text-gray-400">
                                        {allSpecIds.length ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        {' '}
                                                        {allSpecIds.length} spec
                                                        {allSpecIds.length > 1 && 's'}
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    className="TooltipContent"
                                                    sideOffset={5}
                                                >
                                                    <div className="flex flex-col gap-y-1">
                                                        {allSpecIds.map(s => (
                                                            <WowSpecIcon
                                                                key={s}
                                                                specId={s}
                                                                className="object-cover object-top rounded-md full h-5 w-5 border border-background"
                                                            />
                                                        ))}
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </div>
                                </div>

                                <button className="absolute -bottom-2 -right-2 hidden group-hover:flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full">
                                    <Edit size={14} />
                                </button>
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

export default function LootTable(): JSX.Element {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [selectedItem, setSelectedItem] = useState<ItemWithBisSpecs | null>(null)

    const bossesWithItemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, CURRENT_RAID_ID],
        queryFn: () => fetchRaidLootTable(CURRENT_RAID_ID)
    })

    const bisRes = useQuery({
        queryKey: [queryKeys.bisList],
        queryFn: () => fetchBisList()
    })

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim())
        }, 300)

        return () => clearTimeout(handler)
    }, [searchQuery])

    // Memoized filtering logic
    const filteredBosses: BossWithItems[] = useMemo(() => {
        if (!bossesWithItemRes.data) return []
        if (!debouncedSearchQuery) return bossesWithItemRes.data

        return bossesWithItemRes.data
            .map(boss => ({
                ...boss,
                items: boss.items.filter(item =>
                    item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
                )
            }))
            .filter(boss => boss.items.length > 0) // Remove bosses with no matching items
    }, [bossesWithItemRes.data, debouncedSearchQuery])

    if (bossesWithItemRes.isLoading || bisRes.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const bisLists = bisRes.data ?? []

    const handleEditClick = (item: Item) => {
        const selectedBis = bisLists.find(b => b.itemId === item.id)
        setSelectedItem({ item: item, specs: selectedBis?.specIds ?? [] })
        setIsEditDialogOpen(true)
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Search Bar */}
            <div className="w-full mb-4 p-3">
                <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 rounded-md"
                />
            </div>

            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4">
                {filteredBosses
                    .sort((a, b) => a.order - b.order)
                    .map(boss => (
                        <BossPanel
                            key={boss.id}
                            boss={boss}
                            bisLists={bisLists}
                            onEdit={handleEditClick}
                        />
                    ))}
            </div>
            {selectedItem && (
                <ItemManagementDialog
                    isOpen={isEditDialogOpen}
                    setOpen={setIsEditDialogOpen}
                    itemAndSpecs={selectedItem}
                />
            )}
        </div>
    )
}
