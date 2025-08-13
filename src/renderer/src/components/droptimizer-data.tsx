import { Droptimizer, WowItemEquippedSlotKey } from '@shared/types/types'
import { WowGearIcon } from './ui/wowgear-icon'
import BaseGearSlot, { createGearSlotMapping } from './ui/wowcharacter-paperdoll-gearslot'
import CharacterPaperdoll from './ui/wowcharacter-paperdoll'

export default function DroptimizerData({ data }: { data: Droptimizer }) {
    const gearBySlot = createGearSlotMapping(data.itemsEquipped)

    const renderGearSlot = (slotKey: WowItemEquippedSlotKey, options?: { rightSide?: boolean }) => {
        const equippedItem = gearBySlot[slotKey]

        return (
            <BaseGearSlot
                equippedItem={equippedItem}
                showExtendedInfo={true}
                showTierBanner={true}
                rightSide={options?.rightSide}
                flipExtendedInfo={options?.rightSide}
            />
        )
    }

    return (
        <div className="w-full space-y-8">
            <CharacterPaperdoll
                renderGearSlot={renderGearSlot}
            />

            {/* Tier Set Section */}
            {data.tiersetInfo.length > 0 && (
                <div className="bg-background/50 rounded-lg p-6">
                    <h3 className="font-bold mb-4">Tier Set Pieces</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {data.tiersetInfo.map(tierItem => (
                            <div key={tierItem.item.id} className="flex flex-col items-center gap-2">
                                <WowGearIcon
                                    gearItem={tierItem}
                                    showTiersetLine={false}
                                    iconClassName="rounded-lg h-12 w-12 border border-orange-500/50 shadow-md"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
