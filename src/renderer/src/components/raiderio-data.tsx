import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { WowGearIcon } from './ui/wowgear-icon'
import { WowItemEquippedSlotKey } from '@shared/types/types'

export default function RaiderioData({ data }: { data: CharacterRaiderio }) {
    // Create a mapping of slot keys to items
    const gearBySlot = data.itemsEquipped.reduce((acc, gearItem) => {
        if (gearItem.equippedInSlot) {
            acc[gearItem.equippedInSlot] = gearItem
        }
        return acc
    }, {} as Record<string, any>)

    const GearSlot = ({ slotKey, className = "", rightSide=false }: { slotKey: WowItemEquippedSlotKey, className?: string, rightSide?: boolean }) => {
        const equippedItem = gearBySlot[slotKey]

        return (
            <div className={`flex flex-col items-center gap-2 ${className}`}>
{/*                <span className="text-xs font-medium text-muted-foreground">
                    {formatWowEquippedSlotKey(slotKey)}
                </span>*/}
                <div className="relative">
                    {equippedItem ? (
                        <WowGearIcon
                            gearItem={equippedItem}
                            showExtendedInfo={true}
                            flipExtendedInfo={rightSide}
                            showTierBanner={true}
                            iconClassName="rounded-lg h-16 w-16 border-2 border-background shadow-lg"
                        />
                    ) : (
                        <div className="rounded-lg h-16 w-16 border-2 border-dashed border-muted bg-muted/20" />
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full space-y-8">
            {/* Character Paperdoll Layout */}
            <div className="relative">
                {/*<h3 className="text-lg font-bold mb-6 text-center">Equipped Gear</h3>*/}

                {/* Armory-style Layout */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Middle Section */}
                    <div className="flex justify-between items-center mb-8">
                        {/* Left Side */}
                        <div className="flex flex-col gap-6 items-start">
                            <GearSlot slotKey="head" />
                            <GearSlot slotKey="neck" />
                            <GearSlot slotKey="shoulder" />
                            <GearSlot slotKey="back" />
                            <GearSlot slotKey="chest" />
                            <GearSlot slotKey="wrist" />
                        </div>

                         {/*Center - Character Space*/}
{/*                        <div className="flex-1 flex justify-center">
                            <div className="w-48 h-64 bg-muted/20 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
                                <span className="text-muted-foreground text-sm">Character Model</span>
                            </div>
                        </div>*/}

                        {/* Right Side */}
                        <div className="flex flex-col gap-6 items-end">
                            <GearSlot slotKey="hands" rightSide={true} />
                            <GearSlot slotKey="waist" rightSide={true} />
                            <GearSlot slotKey="legs" rightSide={true}/>
                            <GearSlot slotKey="feet" rightSide={true}/>
                            <GearSlot slotKey="finger1" rightSide={true}/>
                            <GearSlot slotKey="finger2" rightSide={true}/>
                        </div>

                    </div>

                    {/* Bottom Row - Weapons */}
                    <div className="flex justify-center items-start gap-12">
                        <GearSlot slotKey="main_hand" />
                        <GearSlot slotKey="off_hand" />
                        <GearSlot slotKey="trinket1" />
                        <GearSlot slotKey="trinket2" />
                    </div>
                </div>
            </div>

            {/* Raid Progress Section */}
            {data.progress && (
                <div className="bg-background/50 rounded-lg p-6">
                    <h3 className="font-bold mb-4">Raid Progress</h3>
                    <div className="space-y-3">
                        {data.progress.raidProgress.map(raid => (
                            <div key={raid.raid} className="flex items-center justify-between">
                                <span className="font-medium">{raid.raid}</span>
                                <div className="flex gap-2 text-sm">
                                    {raid.encountersDefeated.normal && (
                                        <span className="px-2 py-1 bg-green-500/20 text-green-700 rounded">
                                            N: {raid.encountersDefeated.normal.length}
                                        </span>
                                    )}
                                    {raid.encountersDefeated.heroic && (
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-700 rounded">
                                            H: {raid.encountersDefeated.heroic.length}
                                        </span>
                                    )}
                                    {raid.encountersDefeated.mythic && (
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-700 rounded">
                                            M: {raid.encountersDefeated.mythic.length}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
