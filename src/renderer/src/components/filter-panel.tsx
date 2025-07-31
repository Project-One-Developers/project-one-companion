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
        <>
            {/* Raid Difficulty Selector */}
            {showRaidDifficulty && (
                <div className="flex flex-col space-y-2 mb-4">
                    <div className="flex flex-wrap gap-4">
                        {(['Normal', 'Heroic', 'Mythic'] as WowRaidDifficulty[]).map(difficulty => (
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
            )}

            {/* Class Filter */}
            {showClassFilter && (
                <div className="flex flex-col space-y-2 mb-4">
                    <label className="text-sm font-semibold">Class:</label>
                    <div className="flex flex-wrap gap-2">
                        {wowClassNameSchema.options.map(wowClassName => (
                            <div
                                key={wowClassName}
                                className={`cursor-pointer transition-transform hover:scale-125 ${
                                    filter.selectedWowClassName.includes(wowClassName)
                                        ? 'ring-2 ring-blue-500'
                                        : 'opacity-50 grayscale'
                                }`}
                                onClick={() => toggleWowClass(wowClassName)}
                            >
                                <img
                                    src={classIcon.get(wowClassName)}
                                    alt={wowClassName}
                                    className="w-8 h-8 object-cover"
                                    title={wowClassName}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Item Slot Filter */}
            {showSlotFilter && (
                <div className="flex flex-col space-y-2 mb-4">
                    <label className="text-sm font-semibold">Item Slot:</label>
                    <div className="flex flex-wrap gap-2">
                        {wowItemSlotKeySchema.options.map(slotName => (
                            <div
                                key={slotName}
                                className={`cursor-pointer transition-transform hover:scale-125 ${
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
                </div>
            )}

            {/* Armor Type Filter */}
            {showArmorTypeFilter && (
                <div className="flex flex-col space-y-2 mb-4">
                    <label className="text-sm font-semibold">Armor Type:</label>
                    <div className="flex flex-wrap gap-2">
                        {wowArmorTypeSchema.options.map(armorType => (
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
                                    className="w-8 h-8 object-cover"
                                    title={armorType}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Droptimizer-specific filters */}
            {showDroptimizerFilters && (
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
                            onChange={e => updateFilter('maxDays', Number(e.target.value))}
                            disabled={!filter.hideOlderThanDays}
                            className={`border rounded-md p-2 bg-gray-700 text-white w-14 ${!filter.hideOlderThanDays ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
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
                            className={`border rounded-md p-2 bg-gray-700 text-white w-20 ${!filter.onlyUpgrades ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Hide Alts / No upgrades*/}
                    <div className="flex flex-row items-center gap-3">
                        <div className="flex gap-3">
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
                        <div className="flex gap-3">
                            <Checkbox
                                id="hide-no-upgrades"
                                checked={filter.hideIfNoUpgrade as CheckedState}
                                onCheckedChange={checked =>
                                    updateFilter('hideIfNoUpgrade', !!checked)
                                }
                                className="w-5 h-5 bg-gray-700 border border-gray-600 rounded flex items-center justify-center"
                            >
                                {filter.hideIfNoUpgrade && <Check className="text-white w-4 h-4" />}
                            </Checkbox>
                            <label htmlFor="hide-no-upgrades" className="text-sm font-semibold">
                                Hide no upgrades
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </>
    )

    return (
        <div className={`bg-gray-800 text-white p-6 rounded-lg ${className}`}>
            {renderContent()}
        </div>
    )
}
