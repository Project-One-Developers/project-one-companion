import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { WowItemIcon } from '@renderer/components/ui/wowitem-icon'
import { Character, LootWithItem } from '@shared/types/types'

type LootItemProps = {
    loot: LootWithItem
    isSelected: boolean
    setSelectedLoot: (loot: LootWithItem) => void
    roster: Character[]
}

const LootItem = ({ loot, isSelected, setSelectedLoot, roster }: LootItemProps) => {
    const getCharacterDetails = (characterId: string | null): Character | null => {
        return roster.find((c) => c.id === characterId) ?? null
    }

    const shouldShowSlot = (slot) => {
        if (slot === 'finger' || slot === 'back') {
            return true
        }
        return false
    }

    const characterDetails = getCharacterDetails(loot.assignedCharacterId)

    return (
        <div
            className={`flex flex-row justify-between border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md ${isSelected ? 'bg-gray-700' : ''}`}
            onClick={(e) => {
                e.preventDefault()
                setSelectedLoot(loot)
            }}
        >
            <WowItemIcon
                item={loot.item}
                iconOnly={false}
                showSlot={shouldShowSlot(loot.item.slotKey)}
                raidDiff={loot.raidDifficulty}
                bonusString={loot.bonusString}
                socketBanner={loot.socket}
                tierBanner={true}
                iconClassName="object-cover object-top rounded-lg h-7 w-7 border border-background"
            />

            {characterDetails && (
                <div className="flex flex-row space-x-4 items-center ">
                    <p className="text-sm -mr-2">{characterDetails.name}</p>
                    <WowClassIcon
                        wowClassName={characterDetails.class}
                        charname={characterDetails.name}
                        className="h-8 w-8 border-2 border-background rounded-lg"
                    />
                </div>
            )}
        </div>
    )
}

export default LootItem
