import { CharacterWowAudit, WowItemEquippedSlotKey } from '@shared/types/types'
import WowCharacterPaperdoll from './ui/wowcharacter-paperdoll'
import {
    default as BaseGearSlot,
    default as WowCharacterPaperdollGearSlot
} from './ui/wowcharacter-paperdoll-gearslot'

export default function WowAuditData({ data: wowAudit }: { data: CharacterWowAudit }) {
    // Create a mapping of slot keys to items
    const gearBySlot = wowAudit.itemsEquipped.reduce(
        (acc, gearItem) => {
            if (gearItem.equippedInSlot) {
                acc[gearItem.equippedInSlot] = gearItem
            }
            return acc
        },
        {} as Record<string, any>
    )

    /*
    const bestGearBySlot = wowAudit.bestItemsEquipped.reduce(
        (acc, gearItem) => {
            if (gearItem.equippedInSlot) {
                acc[gearItem.equippedInSlot] = gearItem
            }
            return acc
        },
        {} as Record<string, any>
    )
*/

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
            {/* Character Paperdoll Layout */}
            <WowCharacterPaperdoll renderGearSlot={renderGearSlot} />

            {/* Tier Set Section */}
            {wowAudit.tiersetInfo.length > 0 && (
                <div className="bg-background/50 rounded-lg p-6">
                    <h3 className="font-bold mb-4">Tier Set Pieces</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {wowAudit.tiersetInfo.map(tierItem => (
                            <WowCharacterPaperdollGearSlot
                                key={tierItem.item.id}
                                equippedItem={tierItem}
                                showExtendedInfo={true}
                                showTierBanner={false}
                                iconClassName="rounded-lg h-12 w-12 border border-orange-500/50 shadow-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
