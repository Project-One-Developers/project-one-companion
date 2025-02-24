import { itemSlotIcon } from '@renderer/lib/wow-icon'
import { ITEM_SLOTS_KEY } from '@shared/consts/wow.consts'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import { wowItemSlotKeySchema } from '@shared/schemas/wow.schemas'
import { LootWithAssigned, WowItemSlotKey } from '@shared/types/types'
import { useState } from 'react'
import { WowClassIcon } from './ui/wowclass-icon'
import { WowGearIcon } from './ui/wowgear-icon'

type LootsTabsProps = {
    loots: LootWithAssigned[]
    selectedLoot: LootWithAssigned | null
    setSelectedLoot: (loot: LootWithAssigned) => void
}

const LootsList = ({ loots, selectedLoot, setSelectedLoot }: LootsTabsProps) => {
    const [selectedSlot, setSelectedSlot] = useState<WowItemSlotKey>(ITEM_SLOTS_KEY[0])

    const lootCounts = loots.reduce(
        (acc, loot) => {
            const slot = loot.gearItem.item.slotKey
            if (!acc[slot]) acc[slot] = { total: 0, assigned: 0 }
            acc[slot].total++
            if (loot.assignedCharacter) acc[slot].assigned++
            return acc
        },
        {} as Record<WowItemSlotKey, { total: number; assigned: number }>
    )

    const filteredLoots = loots
        .filter((loot) => loot.gearItem.item.slotKey === selectedSlot)
        .sort((a, b) => {
            if (a.gearItem.item.token !== b.gearItem.item.token)
                return a.gearItem.item.token ? -1 : 1
            if (a.gearItem.item.armorType !== b.gearItem.item.armorType) {
                if (a.gearItem.item.armorType === null) return 1
                if (b.gearItem.item.armorType === null) return -1
                return a.gearItem.item.armorType.localeCompare(b.gearItem.item.armorType)
            }
            return b.gearItem.item.id - a.gearItem.item.id || a.id.localeCompare(b.id)
        })

    return (
        <div>
            <div className="flex flex-wrap gap-2 pb-2">
                {wowItemSlotKeySchema.options.map((slot) => {
                    const count = lootCounts[slot]
                    if (!count || count.total === 0) return null
                    const isFullyAssigned = count.assigned === count.total

                    return (
                        <div key={slot} className="flex flex-col items-center">
                            <span
                                className={`text-xs font-bold ${isFullyAssigned ? 'text-green-500' : 'text-white'}`}
                            >
                                {count.assigned}/{count.total}
                            </span>
                            <button
                                onClick={() => setSelectedSlot(slot)}
                                className={`flex flex-col items-center gap-1 p-1 border-b-2 transition-transform ${
                                    selectedSlot === slot ? 'border-primary' : 'border-transparent'
                                }`}
                            >
                                <img
                                    src={itemSlotIcon.get(slot)}
                                    alt={slot}
                                    className="w-8 h-8 hover:scale-125 transition-transform cursor-pointer rounded-sm"
                                    title={formatWowSlotKey(slot)}
                                />
                            </button>
                        </div>
                    )
                })}
            </div>

            <div className="bg-muted p-4 rounded-lg shadow-md mt-2">
                {filteredLoots.length === 0 ? (
                    <p className="text-gray-400">No loot in this category</p>
                ) : (
                    filteredLoots.map((loot) => (
                        <div
                            key={loot.id}
                            className={`flex flex-row justify-between border border-transparent hover:border-white py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md ${
                                selectedLoot?.id === loot.id ? 'bg-gray-700' : ''
                            }`}
                            onClick={(e) => {
                                e.preventDefault()
                                setSelectedLoot(loot)
                            }}
                        >
                            {/* Loot */}
                            <WowGearIcon
                                gearItem={loot.gearItem}
                                showSlot={false}
                                showTierBanner={true}
                                showExtendedInfo={true}
                                showArmorType={true}
                            />

                            {/* Assigned to Char */}
                            {loot.assignedCharacter && (
                                <div className="flex flex-row space-x-4 items-center">
                                    <p className="text-sm -mr-2">{loot.assignedCharacter.name}</p>
                                    <WowClassIcon
                                        wowClassName={loot.assignedCharacter.class}
                                        charname={loot.assignedCharacter.name}
                                        className="h-8 w-8 border-2 border-background rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default LootsList
