import { WowClassIcon } from '@renderer/components/ui/wowclass-icon'
import { LootWithItemAndAssigned } from '@shared/types/types'
import { WowGearIcon } from './ui/wowgear-icon'

type LootItemProps = {
    loot: LootWithItemAndAssigned
    isSelected: boolean
    setSelectedLoot: (loot: LootWithItemAndAssigned) => void
}

const LootItem = ({ loot, isSelected, setSelectedLoot }: LootItemProps) => {
    const shouldShowSlot = (slot) => {
        if (slot === 'finger' || slot === 'back') {
            return true
        }
        return false
    }
    return (
        <div
            className={`flex flex-row justify-between border-b border-gray-700 py-2 cursor-pointer hover:bg-gray-700 p-2 rounded-md ${isSelected ? 'bg-gray-700' : ''}`}
            onClick={(e) => {
                e.preventDefault()
                setSelectedLoot(loot)
            }}
        >
            <WowGearIcon
                item={loot.gearItem}
                showSlot={shouldShowSlot(loot.item.slotKey)}
                showExtendedInfo={true}
                showArmorType={true}
            />

            {loot.assignedCharacter && (
                <div className="flex flex-row space-x-4 items-center ">
                    <p className="text-sm -mr-2">{loot.assignedCharacter.name}</p>
                    <WowClassIcon
                        wowClassName={loot.assignedCharacter.class}
                        charname={loot.assignedCharacter.name}
                        className="h-8 w-8 border-2 border-background rounded-lg"
                    />
                </div>
            )}
        </div>
    )
}

export default LootItem
