import { Checkbox, CheckedState } from '@radix-ui/react-checkbox'
import { LootFilter } from '@renderer/lib/filters'
import { armorTypesIcon, classIcon, itemSlotIcon, raidDiffIcon } from '@renderer/lib/wow-icon'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import {
    wowArmorTypeSchema,
    wowClassNameSchema,
    wowItemSlotKeySchema
} from '@shared/schemas/wow.schemas'
import { WowArmorType, WowClassName, WowItemSlotKey, WowRaidDifficulty } from '@shared/types/types'
import { Check } from 'lucide-react'

type FiltersPanelProps = {
    filter: LootFilter
    updateFilter: (key: keyof LootFilter, value: any) => void
    className?: string
    showRaidDifficulty?: boolean
    showDroptimizerFilters?: boolean
    showClassFilter?: boolean
    showSlotFilter?: boolean
    showArmorTypeFilter?: boolean
}

export const FiltersPanel = ({
    filter,
    updateFilter,
    className,
    showRaidDifficulty = true,
    showDroptimizerFilters = true,
    showClassFilter = true,
    showSlotFilter = true,
    showArmorTypeFilter = true
}: FiltersPanelProps) => {
    const toggleSlot = (slotName: WowItemSlotKey) => {
        const newSelectedSlots = filter.selectedSlots.includes(slotName)
            ? filter.selectedSlots.filter(slot => slot !== slotName)
            : [...filter.selectedSlots, slotName]
        updateFilter('selectedSlots', newSelectedSlots)
    }

    const toggleArmorType = (armorType: WowArmorType) => {
        const newSelectedArmorTypes = filter.selectedArmorTypes.includes(armorType)
            ? filter.selectedArmorTypes.filter(type => type !== armorType)
            : [...filter.selectedArmorTypes, armorType]
        updateFilter('selectedArmorTypes', newSelectedArmorTypes)
    }

    const toggleWowClass = (wowClassName: WowClassName) => {
        const newSelectedWowClassName = filter.selectedWowClassName.includes(wowClassName)
            ? filter.selectedWowClassName.filter(type => type !== wowClassName)
            : [...filter.selectedWowClassName, wowClassName]
        updateFilter('selectedWowClassName', newSelectedWowClassName)
    }

    const selectDifficulty = (difficulty: WowRaidDifficulty) => {
        updateFilter('selectedRaidDiff', difficulty)
    }

    const renderContent = () => (
        <div className="space-y-6">
            {/* Raid Difficulty Selector */}
            {showRaidDifficulty && (
                <fieldset className="border-t border-gray-700 pt-4">
                    <legend className="text-lg font-semibold text-white mb-1">Difficulty</legend>
                    <div className="flex flex-wrap gap-4">
                        {(['Normal', 'Heroic', 'Mythic'] as WowRaidDifficulty[]).map(difficulty => (
                            <div
                                key={difficulty}
                                className={`cursor-pointer transition-transform hover:scale-110 rounded-lg overflow-hidden ${
                                    filter.selectedRaidDiff.includes(difficulty)
                                        ? 'ring-2 ring-blue-500 shadow-lg'
                                        : 'opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
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
                </fieldset>
            )}

            {/* Class Filter */}
            {showClassFilter && (
                <fieldset className="border-t border-gray-700 pt-4">
                    <legend className="text-lg font-semibold text-white mb-1">Class</legend>
                    <div className="flex flex-wrap gap-2">
                        {wowClassNameSchema.options.map(wowClassName => (
                            <div
                                key={wowClassName}
                                className={`cursor-pointer transition-transform hover:scale-125 rounded-full ${
                                    filter.selectedWowClassName.includes(wowClassName)
                                        ? 'ring-2 ring-blue-500'
                                        : 'opacity-50 grayscale'
                                }`}
                                onClick={() => toggleWowClass(wowClassName)}
                            >
                                <img
                                    src={classIcon.get(wowClassName)}
                                    alt={wowClassName}
                                    className="w-8 h-8 object-cover rounded-full"
                                    title={wowClassName}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}

            {/* Item Slot Filter */}
            {showSlotFilter && (
                <fieldset className="border-t border-gray-700 pt-4">
                    <legend className="text-lg font-semibold text-white mb-1">Item Slot</legend>
                    <div className="flex flex-wrap gap-2">
                        {wowItemSlotKeySchema.options.map(slotName => (
                            <div
                                key={slotName}
                                className={`cursor-pointer transition-transform hover:scale-125 rounded-md ${
                                    filter.selectedSlots.includes(slotName)
                                        ? 'ring-2 ring-blue-500'
                                        : 'opacity-50 grayscale'
                                }`}
                                onClick={() => toggleSlot(slotName)}
                            >
                                <img
                                    src={itemSlotIcon.get(slotName)}
                                    alt={formatWowSlotKey(slotName)}
                                    className="w-8 h-8 object-cover"
                                    title={formatWowSlotKey(slotName)}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}

            {/* Armor Type Filter */}
            {showArmorTypeFilter && (
                <fieldset className="border-t border-gray-700 pt-4">
                    <legend className="text-lg font-semibold text-white mb-1">Armor Type</legend>
                    <div className="flex flex-wrap gap-2">
                        {wowArmorTypeSchema.options.map(armorType => (
                            <div
                                key={armorType}
                                className={`cursor-pointer transition-transform hover:scale-125 rounded-md ${
                                    filter.selectedArmorTypes.includes(armorType)
                                        ? 'ring-2 ring-blue-500'
                                        : 'opacity-50 grayscale'
                                }`}
                                onClick={() => toggleArmorType(armorType)}
                            >
                                <img
                                    src={armorTypesIcon.get(armorType)}
                                    alt={armorType}
                                    className="w-8 h-8 object-cover"
                                    title={armorType}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>
            )}

            {/* Droptimizer-specific filters */}
            {showDroptimizerFilters && (
                <fieldset className="border-t border-gray-700 pt-4">
                    <legend className="text-lg font-semibold text-white mb-1">Droptimizer</legend>
                    <div className="space-y-4">
                        {/* Ignore droptimizer older than */}
                        <div className="flex flex-row items-center gap-3">
                            <Checkbox
                                id="older-than-days"
                                checked={filter.hideOlderThanDays as CheckedState}
                                onCheckedChange={checked =>
                                    updateFilter('hideOlderThanDays', !!checked)
                                }
                                className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                            >
                                {filter.hideOlderThanDays && (
                                    <Check className="text-white w-4 h-4" />
                                )}
                            </Checkbox>
                            <label htmlFor="older-than-days" className="text-sm font-semibold">
                                Ignore droptimizer older than
                            </label>
                            <input
                                id="older-than-days-input"
                                type="number"
                                min="1"
                                step="1"
                                value={filter.maxDays}
                                onChange={e => updateFilter('maxDays', Number(e.target.value))}
                                disabled={!filter.hideOlderThanDays}
                                className={`border rounded-md p-2 bg-gray-700 text-white w-20 ${!filter.hideOlderThanDays ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                            <span className="text-sm font-semibold">days</span>
                        </div>

                        {/* Upgrades only and Minimum Upgrade Amount in the same row */}
                        <div className="flex flex-row items-center gap-3">
                            <Checkbox
                                id="only-upgrades"
                                checked={filter.onlyUpgrades as CheckedState}
                                onCheckedChange={checked => updateFilter('onlyUpgrades', !!checked)}
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
                                onChange={e => updateFilter('minUpgrade', Number(e.target.value))}
                                disabled={!filter.onlyUpgrades}
                                className={`border rounded-md p-2 bg-gray-700 text-white w-24 ${!filter.onlyUpgrades ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>

                        {/* Hide Alts / No upgrades*/}
                        <div className="flex flex-row items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="hide-alts"
                                    checked={filter.hideAlts as CheckedState}
                                    onCheckedChange={checked => updateFilter('hideAlts', !!checked)}
                                    className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                                >
                                    {filter.hideAlts && <Check className="text-white w-4 h-4" />}
                                </Checkbox>
                                <label htmlFor="hide-alts" className="text-sm font-semibold">
                                    Hide alts
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="hide-no-upgrades"
                                    checked={filter.hideIfNoUpgrade as CheckedState}
                                    onCheckedChange={checked =>
                                        updateFilter('hideIfNoUpgrade', !!checked)
                                    }
                                    className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                                >
                                    {filter.hideIfNoUpgrade && (
                                        <Check className="text-white w-4 h-4" />
                                    )}
                                </Checkbox>
                                <label htmlFor="hide-no-upgrades" className="text-sm font-semibold">
                                    Hide if no upgrade
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
        </div>
    )

    return (
        <div className={`bg-gray-800 text-white p-6 rounded-lg shadow-xl ${className}`}>
            {renderContent()}
        </div>
    )
}
