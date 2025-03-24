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
    const [selectedSlot, setSelectedSlot] = useState<WowItemSlotKey | 'tokens'>(ITEM_SLOTS_KEY[0])

    const lootCounts = loots.reduce(
        (acc, loot) => {
            const slot = loot.gearItem.item.slotKey
            acc[slot] = acc[slot] || { total: 0, assigned: 0 }
            acc[slot].total++
            if (loot.assignedCharacter) acc[slot].assigned++
            return acc
        },
        {} as Record<WowItemSlotKey, { total: number; assigned: number }>
    )

    const tokensLoots = loots.filter(loot => loot.gearItem.item.tierset || loot.gearItem.item.token)
    const tokensCount = tokensLoots.reduce(
        (acc, loot) => {
            acc.total++
            if (loot.assignedCharacter) acc.assigned++
            return acc
        },
        { total: 0, assigned: 0 }
    )

    const filteredLoots =
        selectedSlot === 'tokens'
            ? tokensLoots.sort(
                  (a, b) =>
                      a.gearItem.item.name.localeCompare(b.gearItem.item.name) ||
                      b.gearItem.itemLevel - a.gearItem.itemLevel
              )
            : loots
                  .filter(loot => loot.gearItem.item.slotKey === selectedSlot)
                  .sort(
                      (a, b) =>
                          a.gearItem.item.name.localeCompare(b.gearItem.item.name) ||
                          b.gearItem.itemLevel - a.gearItem.itemLevel
                  )

    const SlotButton = ({
        slot,
        count
    }: {
        slot: WowItemSlotKey | 'tokens'
        count: { total: number; assigned: number }
    }) => (
        <div className="flex flex-col items-center">
            <span
                className={`text-xs font-bold ${count.assigned === count.total ? 'text-green-500' : 'text-white'}`}
            >
                {count.assigned}/{count.total}
            </span>
            <button
                onClick={() => setSelectedSlot(slot)}
                className={`flex flex-col items-center gap-1 p-1 border-b-2 transition-transform ${selectedSlot === slot ? 'border-primary' : 'border-transparent'}`}
            >
                <img
                    src={
                        slot === 'tokens'
                            ? 'https://wow.zamimg.com/images/wow/icons/large/inv_axe_2h_nerubianraid_d_01_nv.jpg'
                            : itemSlotIcon.get(slot)
                    }
                    alt={slot}
                    className="w-8 h-8 hover:scale-125 transition-transform cursor-pointer rounded-sm"
                    title={slot === 'tokens' ? 'Tokens' : formatWowSlotKey(slot)}
                />
            </button>
        </div>
    )

    return (
        <div>
            <div className="flex flex-wrap gap-2 pb-2">
                {wowItemSlotKeySchema.options.map(
                    slot =>
                        lootCounts[slot]?.total > 0 && (
                            <SlotButton key={slot} slot={slot} count={lootCounts[slot]} />
                        )
                )}
                {tokensCount.total > 0 && <SlotButton slot="tokens" count={tokensCount} />}
            </div>
            <div className="bg-muted p-4 rounded-lg shadow-md mt-2">
                {filteredLoots.length === 0 ? (
                    <p className="text-gray-400">No loot in this category</p>
                ) : (
                    filteredLoots.map(loot => (
                        <div
                            key={loot.id}
                            className={`flex flex-row justify-between border border-transparent hover:border-white py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md ${selectedLoot?.id === loot.id ? 'bg-gray-700' : ''}`}
                            onClick={e => {
                                e.preventDefault()
                                setSelectedLoot(loot)
                            }}
                        >
                            <WowGearIcon
                                gearItem={loot.gearItem}
                                showSlot={selectedSlot === 'tokens'}
                                showTierBanner
                                showExtendedInfo
                                convertItemTrackToRaidDiff={true}
                                showArmorType={selectedSlot !== 'tokens'}
                            />
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
