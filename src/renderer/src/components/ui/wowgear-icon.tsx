import { cn } from '@renderer/lib/utils'
import {
    gearhasSocket,
    gearTertiary,
    parseItemTrackName
} from '@shared/libs/items/item-bonus-utils'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import { trackNameToWowDiff } from '@shared/libs/items/item-tracks'
import { isHealerSpecs, isTankSpecs } from '@shared/libs/spec-parser/spec-utils'
import { GearItem } from '@shared/types/types'

type WowGearIconProps = {
    gearItem: GearItem
    showTiersetLine?: boolean
    showTiersetRibbon?: boolean
    showItemTrackDiff?: boolean
    showExtendedInfo?: boolean
    flipExtendedInfo?: boolean
    convertItemTrackToRaidDiff?: boolean
    showSlot?: boolean
    showArmorType?: boolean
    className?: string
    iconClassName?: string
    showRoleIcons?: boolean
}

export const WowGearIcon = ({
                                gearItem,
                                showTiersetLine = false,
                                showTiersetRibbon = false,
                                showItemTrackDiff = true,
                                showExtendedInfo = false,
                                flipExtendedInfo = false,
                                convertItemTrackToRaidDiff = true,
                                showSlot = false,
                                showArmorType = false,
                                showRoleIcons = false,
                                className,
                                iconClassName
                            }: WowGearIconProps) => {
    const { item, itemLevel, bonusIds, enchantIds, gemIds, itemTrack } = gearItem
    const { id, iconName, tierset, token, name, slotKey, armorType, specIds } = item

    const hasSocket = gearhasSocket(bonusIds)
    const hasSpecials = hasSocket || gearTertiary(bonusIds)
    const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`

    const hrefString =
        `https://www.wowhead.com/item=${id}&ilvl=${itemLevel}` +
        (bonusIds?.length ? `&bonus=${bonusIds.join(':')}` : '') +
        (enchantIds?.length ? `&ench=${enchantIds.join(':')}` : '') +
        (gemIds?.length ? `&gems=${gemIds.join(':')}` : '')

    // role badges
    let healerItem: boolean | undefined
    let tankItem: boolean | undefined
    if (showRoleIcons) {
        healerItem = isHealerSpecs(specIds)
        tankItem = isTankSpecs(specIds)
    }

    const getItemTrackAbbr = () => {
        if (!showItemTrackDiff) return ''

        if (itemTrack) {
            return convertItemTrackToRaidDiff ? trackNameToWowDiff(itemTrack.name) : itemTrack.name
        }

        if (bonusIds) {
            const parsedTrackName = parseItemTrackName(bonusIds, token, tierset)
            if (parsedTrackName) {
                return convertItemTrackToRaidDiff
                    ? trackNameToWowDiff(parsedTrackName)
                    : parsedTrackName
            }
        }

        return ''
    }

    return (
        <a href={hrefString} rel="noreferrer" target="_blank">
            <div className={cn('flex flex-row items-center', className)}>
                {showExtendedInfo && flipExtendedInfo && (
                    <div id="item-info" className="flex flex-col mr-3">
                        <p className="font-black text-xs text-right">{name}</p>
                        <div className="flex justify-end">
                            <p className="flex text-bold text-[11px]">
                                {itemLevel} {getItemTrackAbbr()}
                            </p>
                            {showArmorType && (armorType || token) && (
                                <p className="text-xs ml-1">
                                    {' • '} {token ? 'Token' : armorType}
                                </p>
                            )}
                            {showSlot && (
                                <p className="text-xs ml-1">{formatWowSlotKey(slotKey)}</p>
                            )}
                        </div>
                    </div>
                )}
                <div className="flex flex-col items-center">
                    <div className="relative inline-block">
                        <img
                            src={iconUrl}
                            alt=""
                            className={cn(
                                `object-cover object-top rounded-lg h-8 w-8 border border-background block ${hasSpecials ? 'border-white' : ''}`,
                                iconClassName
                            )}
                        />
                        {showTiersetLine && (tierset || token) && (
                            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-red-600"></div>
                        )}
                        {showTiersetRibbon && tierset && (
                            <div className="absolute -top-1 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-purple-500 to-purple-400 flex items-center justify-center">
                                <span className="text-white text-[6px] font-bold tracking-wide drop-shadow-sm">
                                    TIER
                                </span>
                            </div>
                        )}
                        {hasSocket && (
                            <div className="absolute bottom-0 right-0">
                                <img
                                    className="w-3 h-3 border"
                                    src="https://www.raidbots.com/frontend/c6217d2ee6dd7647cbfa.png"
                                />
                            </div>
                        )}
                        {healerItem && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                                <svg
                                    className="w-3 h-3 text-yellow-900"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 2a1.5 1.5 0 011.5 1.5v4h4a1.5 1.5 0 110 3h-4v4a1.5 1.5 0 11-3 0v-4h-4a1.5 1.5 0 110-3h4v-4A1.5 1.5 0 0110 2z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                        {tankItem && (
                            <div className="absolute -top-1 -left-1 w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
                                <svg
                                    className="w-3 h-3 text-yellow-900"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                    {!showExtendedInfo && (
                        <p className="flex text-bold text-[11px]">
                            {itemLevel}
                            {getItemTrackAbbr().charAt(0)}
                        </p>
                    )}
                </div>
                {showExtendedInfo && !flipExtendedInfo && (
                    <div id="item-info" className="flex flex-col ml-3">
                        <p className="font-black text-xs">{name}</p>
                        <div className="flex">
                            {showSlot && (
                                <p className="text-xs mr-1">{formatWowSlotKey(slotKey)}</p>
                            )}
                            {showArmorType && (armorType || token) && (
                                <p className="text-xs mr-1">
                                    {token ? 'Token' : armorType} {' • '}
                                </p>
                            )}
                            <p className="flex text-bold text-[11px]">
                                {itemLevel} {getItemTrackAbbr()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </a>
    )
}
