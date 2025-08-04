import { formatWowEquippedSlotKey } from '@shared/libs/items/item-slot-utils'
import { CharacterWowAudit } from '@shared/types/types'
import { WowGearIcon } from './ui/wowgear-icon'

export default function WowAuditData({ data: wowAudit }: { data: CharacterWowAudit }) {
    // Create a mapping of slot keys to items
    const gearBySlot = wowAudit.itemsEquipped.reduce((acc, gearItem) => {
        if (gearItem.equippedInSlot) {
            acc[gearItem.equippedInSlot] = gearItem
        }
        return acc
    }, {} as Record<string, any>)

    const bestGearBySlot = wowAudit.bestItemsEquipped.reduce((acc, gearItem) => {
        if (gearItem.equippedInSlot) {
            acc[gearItem.equippedInSlot] = gearItem
        }
        return acc
    }, {} as Record<string, any>)

    const GearSlot = ({ slotKey, className = "" }: { slotKey: string, className?: string }) => {
        const equippedItem = gearBySlot[slotKey]
        const bestItem = bestGearBySlot[slotKey]
        const showBestItem = bestItem && bestItem.item.id !== equippedItem?.item.id

        const tiesetInSlot = wowAudit.tiersetInfo.some(
            t => t.item.slotKey === equippedItem?.item.slotKey
        )

        return (
            <div className={`flex flex-col items-center gap-2 ${className}`}>
                <span className="text-xs font-medium text-muted-foreground">
                    {formatWowEquippedSlotKey(slotKey)}
                </span>
                <div className="relative">
                    {equippedItem ? (
                        <WowGearIcon
                            gearItem={equippedItem}
                            showTierBanner={tiesetInSlot}
                            iconClassName="rounded-lg h-16 w-16 border-2 border-background shadow-lg"
                        />
                    ) : (
                        <div className="rounded-lg h-16 w-16 border-2 border-dashed border-muted bg-muted/20" />
                    )}
                </div>
                {showBestItem && (
                    <div className="relative -mt-1">
                        <span className="text-xs text-green-500 font-medium mb-1 block">Best Available</span>
                        <WowGearIcon
                            gearItem={bestItem}
                            showTierBanner={false}
                            iconClassName="rounded-lg h-12 w-12 border border-green-500/50 shadow-md"
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="w-full space-y-8">
            {/* Character Paperdoll Layout */}
            <div className="relative">
                <h3 className="text-lg font-bold mb-6 text-center">Equipped Gear</h3>

                {/* Armory-style Layout */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Top Row */}
                    <div className="flex justify-center items-start gap-8 mb-8">
                        <GearSlot slotKey="HEAD" />
                        <GearSlot slotKey="NECK" />
                        <GearSlot slotKey="SHOULDER" />
                    </div>

                    {/* Middle Section */}
                    <div className="flex justify-between items-center mb-8">
                        {/* Left Side */}
                        <div className="flex flex-col gap-8">
                            <GearSlot slotKey="SHIRT" />
                            <GearSlot slotKey="CHEST" />
                            <GearSlot slotKey="WAIST" />
                            <GearSlot slotKey="LEGS" />
                            <GearSlot slotKey="FEET" />
                        </div>

                        {/* Center - Character Space */}
                        <div className="flex-1 flex justify-center">
                            <div className="w-48 h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">Character Model</span>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col gap-8">
                            <GearSlot slotKey="TABARD" />
                            <GearSlot slotKey="WRIST" />
                            <GearSlot slotKey="HANDS" />
                            <GearSlot slotKey="FINGER_1" />
                            <GearSlot slotKey="FINGER_2" />
                        </div>
                    </div>

                    {/* Bottom Row - Weapons */}
                    <div className="flex justify-center items-start gap-12">
                        <GearSlot slotKey="MAIN_HAND" />
                        <GearSlot slotKey="OFF_HAND" />
                        <GearSlot slotKey="RANGED" />
                    </div>

                    {/* Trinkets Row */}
                    <div className="flex justify-center items-start gap-8 mt-8">
                        <GearSlot slotKey="TRINKET_1" />
                        <GearSlot slotKey="TRINKET_2" />
                    </div>
                </div>
            </div>

            {/* Tier Set Section */}
            {wowAudit.tiersetInfo.length > 0 && (
                <div className="bg-background/50 rounded-lg p-6">
                    <h3 className="font-bold mb-4">Tier Set Pieces</h3>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {wowAudit.tiersetInfo.map(tierItem => (
                            <div key={tierItem.item.id} className="flex flex-col items-center gap-2">
                                <WowGearIcon
                                    gearItem={tierItem}
                                    showTierBanner={false}
                                    iconClassName="rounded-lg h-12 w-12 border border-orange-500/50 shadow-md"
                                />
                                <span className="text-xs text-center text-muted-foreground">
                                    {formatWowEquippedSlotKey(tierItem.item.slotKey)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
