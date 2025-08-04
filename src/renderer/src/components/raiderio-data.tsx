import { CharacterRaiderio } from '@shared/schemas/raiderio.schemas'
import { WowItemEquippedSlotKey } from '@shared/types/types'
import CharacterPaperdoll from './ui/wowcharacter-paperdoll'
import BaseGearSlot, { createGearSlotMapping } from './ui/wowcharacter-paperdoll-gearslot'

export default function RaiderioData({ data }: { data: CharacterRaiderio }) {
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
            <CharacterPaperdoll renderGearSlot={renderGearSlot} />

            {/* Raid Progress Section - Unique to RaiderIO */}
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
