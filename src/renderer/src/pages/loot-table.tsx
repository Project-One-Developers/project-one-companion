import { FiltersPanel } from '@renderer/components/filter-panel'
import ItemManagementDialog from '@renderer/components/item-management-dialog'
import { Input } from '@renderer/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { WowSpecIcon } from '@renderer/components/ui/wowspec-icon'
import { LootFilter } from '@renderer/lib/filters'
import { fetchBisList } from '@renderer/lib/tanstack-query/bis-list'
import { fetchRaidLootTable } from '@renderer/lib/tanstack-query/bosses'
import { fetchAllItemNotes } from '@renderer/lib/tanstack-query/items'
import { queryKeys } from '@renderer/lib/tanstack-query/keys'
import { encounterIcon } from '@renderer/lib/wow-icon'
import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { getWowClassBySpecId } from '@shared/libs/spec-parser/spec-utils'
import { BisList, BossWithItems, Item, ItemNote, WowClassName } from '@shared/types/types'
import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Edit, Filter, LoaderCircle, X } from 'lucide-react'

import { useEffect, useMemo, useState, type JSX } from 'react'

// Boss Card Component
type BossPanelProps = {
    boss: BossWithItems
    bisLists: BisList[]
    itemNotes: ItemNote[]
    onEdit: (item: Item, note: string) => void
    filter: LootFilter
}

const BossPanel = ({ boss, bisLists, itemNotes, onEdit, filter }: BossPanelProps) => {
    // Filter items based on the selected classes, slots, and armor types
    const filteredItems = useMemo(() => {
        return boss.items.filter(item => {
            const bisForItem = bisLists.filter(bis => bis.itemId === item.id)
            const allSpecIds = bisForItem.flatMap(bis => bis.specIds)

            // If no class filter is selected, show all items
            if (
                filter.selectedWowClassName.length === 0 &&
                filter.selectedSlots.length === 0 &&
                filter.selectedArmorTypes.length === 0
            ) {
                return true
            }

            let passesClassFilter = true
            let passesSlotFilter = true
            let passesArmorTypeFilter = true

            // Class filter - check if any BIS specs match selected classes
            if (filter.selectedWowClassName.length > 0) {
                const itemClasses = allSpecIds
                    .map(specId => {
                        try {
                            return getWowClassBySpecId(specId)?.name
                        } catch {
                            return null
                        }
                    })
                    .filter(Boolean)

                passesClassFilter = itemClasses.some(className =>
                    filter.selectedWowClassName.includes(className as WowClassName)
                )
            }

            // Slot filter
            if (filter.selectedSlots.length > 0) {
                passesSlotFilter = filter.selectedSlots.includes(item.slotKey)
            }

            // Armor type filter
            if (filter.selectedArmorTypes.length > 0) {
                passesArmorTypeFilter = item.armorType
                    ? filter.selectedArmorTypes.includes(item.armorType)
                    : false
            }

            return passesClassFilter && passesSlotFilter && passesArmorTypeFilter
        })
    }, [boss.items, bisLists, filter])

    return (
        <div className="flex flex-col bg-muted rounded-lg overflow-hidden min-w-[350px]">
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
                {filteredItems
                    .sort((a, b) => {
                        const aHasBis = bisLists.some(bis => bis.itemId === a.id)
                        const bHasBis = bisLists.some(bis => bis.itemId === b.id)
                        if (aHasBis && !bHasBis) return -1
                        if (!aHasBis && bHasBis) return 1
                        return a.id - b.id
                    })
                    .map(item => {
                        const bisForItem = bisLists.filter(bis => bis.itemId === item.id)
                        const allSpecIds = bisForItem.flatMap(bis => bis.specIds)
                        const itemNote = itemNotes.find(note => note.itemId === item.id)?.note || ''

                        return (
                            <div
                                key={item.id}
                                className={clsx(
                                    'flex flex-row gap-x-8 justify-between items-center p-1 hover:bg-gray-700 transition-colors duration-200 rounded-md cursor-pointer relative group',
                                    !allSpecIds.length && 'opacity-30'
                                )}
                                onClick={e => {
                                    e.preventDefault()
                                    onEdit(item, itemNote)
                                }}
                            >
                                <WowItemIcon
                                    item={item}
                                    iconOnly={false}
                                    raidDiff={'Mythic'}
                                    tierBanner={true}
                                    showIlvl={false}
                                    showRoleIcons={true}
                                />

                                <div className="flex flex-col items-center">
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
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

                                        {/* Note indicator */}
                                        {itemNote && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="text-blue-400">
                                                        <Edit size={12} />
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="TooltipContent max-w-xs" sideOffset={5}>
                                                    <div className="text-xs">{itemNote}</div>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

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
    note: string
}

export default function LootTable(): JSX.Element {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
    const [selectedItem, setSelectedItem] = useState<ItemWithBisSpecs | null>(null)

    // Filter state - using LootFilter but with only the filters we need
    const [filter, setFilter] = useState<LootFilter>({
        selectedRaidDiff: 'Mythic',
        onlyUpgrades: false,
        minUpgrade: 0,
        showMains: true,
        showAlts: true,
        hideIfNoUpgrade: false,
        selectedSlots: [],
        selectedArmorTypes: [],
        selectedWowClassName: []
    })

    const bossesWithItemRes = useQuery({
        queryKey: [queryKeys.raidLootTable, CURRENT_RAID_ID],
        queryFn: () => fetchRaidLootTable(CURRENT_RAID_ID)
    })

    const bisRes = useQuery({
        queryKey: [queryKeys.bisList],
        queryFn: () => fetchBisList()
    })

    const itemNotesRes = useQuery({
        queryKey: [queryKeys.allItemNotes],
        queryFn: () => fetchAllItemNotes()
    })

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery.trim())
        }, 300)

        return () => clearTimeout(handler)
    }, [searchQuery])

    const updateFilter = (key: keyof LootFilter, value: any): void => {
        setFilter(prev => ({ ...prev, [key]: value }))
    }

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return (
            filter.selectedSlots.length > 0 ||
            filter.selectedArmorTypes.length > 0 ||
            filter.selectedWowClassName.length > 0
        )
    }, [filter])

    // Memoized filtering logic with search query
    const filteredBosses: BossWithItems[] = useMemo(() => {
        if (!bossesWithItemRes.data) return []

        return bossesWithItemRes.data
            .map(boss => ({
                ...boss,
                items: boss.items.filter(item => {
                    // Apply search filter first
                    if (
                        debouncedSearchQuery &&
                        !item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
                    ) {
                        return false
                    }
                    return true
                })
            }))
            .filter(boss => boss.items.length > 0) // Remove bosses with no matching items
    }, [bossesWithItemRes.data, debouncedSearchQuery])

    if (bossesWithItemRes.isLoading || bisRes.isLoading || itemNotesRes.isLoading) {
        return (
            <div className="flex flex-col items-center w-full justify-center mt-10 mb-10">
                <LoaderCircle className="animate-spin text-5xl" />
            </div>
        )
    }

    const bisLists = bisRes.data ?? []
    const itemNotes = itemNotesRes.data ?? []

    const handleEditClick = (item: Item, note: string) => {
        const selectedBis = bisLists.find(b => b.itemId === item.id)
        setSelectedItem({ item: item, specs: selectedBis?.specIds ?? [], note })
        setIsEditDialogOpen(true)
    }

    return (
        <div className="w-dvw h-dvh overflow-y-auto flex flex-col gap-y-8 items-center p-8 relative">
            {/* Search Bar */}
            <div className="w-full max-w-md mb-4">
                <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Boss List */}
            <div className="flex flex-wrap gap-x-4 gap-y-4 justify-center">
                {filteredBosses
                    .sort((a, b) => a.order - b.order)
                    .map(boss => (
                        <BossPanel
                            key={boss.id}
                            boss={boss}
                            bisLists={bisLists}
                            itemNotes={itemNotes}
                            onEdit={handleEditClick}
                            filter={filter}
                        />
                    ))}
            </div>

            {/* Floating Filter Button */}
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={clsx(
                    'fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center z-50',
                    hasActiveFilters
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                )}
                title="Toggle Filters"
            >
                {isFilterOpen ? <X size={24} /> : <Filter size={24} />}
                {hasActiveFilters && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
            </button>

            {/* Filter Panel Overlay */}
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsFilterOpen(false)}
                    />

                    {/* Filter Panel */}
                    <div className="fixed bottom-24 right-6 z-50 max-w-md w-100">
                        <FiltersPanel
                            filter={filter}
                            updateFilter={updateFilter}
                            showRaidDifficulty={false}
                            showDroptimizerFilters={false}
                            showMainsAlts={false}
                            showClassFilter={true}
                            showSlotFilter={true}
                            showArmorTypeFilter={true}
                            className="shadow-2xl"
                        />
                    </div>
                </>
            )}

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
