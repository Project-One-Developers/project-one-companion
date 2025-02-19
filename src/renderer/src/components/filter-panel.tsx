import { Checkbox, CheckedState } from '@radix-ui/react-checkbox'
import * as Collapsible from '@radix-ui/react-collapsible'
import { LootFilter } from '@renderer/lib/filters'
import { armorTypesIcon, itemSlotIcon, raidDiffIcon } from '@renderer/lib/wow-icon'
import { wowArmorTypeSchema, wowItemSlotSchema } from '@shared/schemas/wow.schemas'
import { WowArmorType, WowItemSlot, WowRaidDifficulty } from '@shared/types/types'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type FiltersPanelProps = {
    filter: LootFilter
    updateFilter: (key: keyof LootFilter, value: any) => void
    className?: string
}

export const FiltersPanel = ({ filter: filter, updateFilter, className }: FiltersPanelProps) => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleSlot = (slotName: WowItemSlot) => {
        const newSelectedSlots = filter.selectedSlots.includes(slotName)
            ? filter.selectedSlots.filter((slot) => slot !== slotName)
            : [...filter.selectedSlots, slotName]
        updateFilter('selectedSlots', newSelectedSlots)
    }

    const toggleArmorType = (armorType: WowArmorType) => {
        const newSelectedArmorTypes = filter.selectedArmorTypes.includes(armorType)
            ? filter.selectedArmorTypes.filter((type) => type !== armorType)
            : [...filter.selectedArmorTypes, armorType]
        updateFilter('selectedArmorTypes', newSelectedArmorTypes)
    }

    const selectDifficulty = (difficulty: WowRaidDifficulty) => {
        updateFilter('selectedRaidDiff', difficulty)
    }

    return (
        <div className={`bg-gray-800 text-white p-6 rounded-lg ${className}`}>
            {/* Raid Difficulty Selector */}
            <div className="flex flex-col space-y-2 mb-4">
                {/* <label className="text-sm font-semibold">Raid Difficulty:</label> */}
                <div className="flex flex-wrap gap-4">
                    {(['Normal', 'Heroic', 'Mythic'] as WowRaidDifficulty[]).map((difficulty) => (
                        <div
                            key={difficulty}
                            className={`cursor-pointer transition-transform hover:scale-110 ${
                                filter.selectedRaidDiff.includes(difficulty)
                                    ? 'ring-2 ring-blue-500'
                                    : 'opacity-50 grayscale'
                            }`}
                            onClick={() => selectDifficulty(difficulty)}
                        >
                            <img
                                src={raidDiffIcon.get(difficulty)}
                                alt={difficulty}
                                className="w-16 h-16 object-cover"
                                title={difficulty}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <Collapsible.Root
                className="w-full"
                defaultOpen={false}
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                {/* Panel Header */}
                <Collapsible.Trigger className="flex items-center justify-between w-full text-lg font-bold mb-2 cursor-pointer">
                    More Filters
                    <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </Collapsible.Trigger>

                {/* Panel Content */}
                <Collapsible.Content className="mt-4 space-y-4">
                    {/* Ignore droptimizer older than */}
                    <div className="flex flex-row items-center gap-3">
                        <Checkbox
                            id="older-than-days"
                            checked={filter.hideOlderThanDays as CheckedState}
                            onCheckedChange={(checked) =>
                                updateFilter('hideOlderThanDays', !!checked)
                            }
                            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                        >
                            {filter.hideOlderThanDays && <Check className="text-white w-4 h-4" />}
                        </Checkbox>
                        <label htmlFor="older-than-days" className="text-sm font-semibold">
                            Ignore droptimizer older than days
                        </label>
                        <input
                            id="upgrade-amount"
                            type="number"
                            min="1"
                            step="1"
                            value={filter.maxDays}
                            onChange={(e) => updateFilter('maxDays', Number(e.target.value))}
                            disabled={!filter.hideOlderThanDays}
                            className={`border rounded-md p-2 bg-gray-700 text-white w-14 ${!filter.hideOlderThanDays ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Upgrades only and Minimum Upgrade Amount in the same row */}
                    <div className="flex flex-row items-center gap-3">
                        <Checkbox
                            id="only-upgrades"
                            checked={filter.onlyUpgrades as CheckedState}
                            onCheckedChange={(checked) => updateFilter('onlyUpgrades', !!checked)}
                            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                        >
                            {filter.onlyUpgrades && <Check className="text-white w-4 h-4" />}
                        </Checkbox>
                        <label htmlFor="only-upgrades" className="text-sm font-semibold">
                            Minimum upgrade
                        </label>
                        <input
                            id="upgrade-amount"
                            type="number"
                            min="0"
                            step="500"
                            value={filter.minUpgrade}
                            onChange={(e) => updateFilter('minUpgrade', Number(e.target.value))}
                            disabled={!filter.onlyUpgrades}
                            className={`border rounded-md p-2 bg-gray-700 text-white w-20 ${!filter.onlyUpgrades ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Hide Alts*/}
                    <div className="flex flex-row items-center gap-3">
                        <Checkbox
                            id="hide-alts"
                            checked={filter.hideAlts as CheckedState}
                            onCheckedChange={(checked) => updateFilter('hideAlts', !!checked)}
                            className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                        >
                            {filter.hideAlts && <Check className="text-white w-4 h-4" />}
                        </Checkbox>
                        <label htmlFor="hide-alts" className="text-sm font-semibold">
                            Hide alts
                        </label>
                    </div>

                    {/* Item Slot Toggles */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold">Item Slots:</label>
                        <div className="flex flex-wrap gap-2">
                            {wowItemSlotSchema.options.map((slot) => (
                                <div
                                    key={slot}
                                    className={`cursor-pointer transition-transform hover:scale-125 ${
                                        filter.selectedSlots.includes(slot)
                                            ? 'ring-2 ring-blue-500'
                                            : 'opacity-50 grayscale'
                                    }`}
                                    onClick={() => toggleSlot(slot)}
                                >
                                    <img
                                        src={itemSlotIcon.get(slot)}
                                        alt={slot}
                                        className="w-7 h-7"
                                        title={slot}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Armor Type Toggles */}
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-semibold">Armor Types:</label>
                        <div className="flex flex-wrap gap-2">
                            {wowArmorTypeSchema.options.map((armorType) => (
                                <div
                                    key={armorType}
                                    className={`cursor-pointer transition-transform hover:scale-125 ${
                                        filter.selectedArmorTypes.includes(armorType)
                                            ? 'ring-2 ring-blue-500'
                                            : 'opacity-50 grayscale'
                                    }`}
                                    onClick={() => toggleArmorType(armorType)}
                                >
                                    <img
                                        src={armorTypesIcon.get(armorType)}
                                        alt={armorType}
                                        className="w-7 h-7"
                                        title={armorType}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Collapsible.Content>
            </Collapsible.Root>
        </div>
    )
}
