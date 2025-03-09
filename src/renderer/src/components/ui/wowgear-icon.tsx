import { cn } from '@renderer/lib/utils'
import {
    gearhasSocket,
    gearTertiary,
    parseItemTrackName
} from '@shared/libs/items/item-bonus-utils'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import { GearItem, WowItemTrackName } from '@shared/types/types'

type WowGearIconProps = {
    gearItem: GearItem
    showTierBanner?: boolean
    showItemTrackDiff?: boolean
    showExtendedInfo?: boolean
    showSlot?: boolean
    showArmorType?: boolean
    className?: string
    iconClassName?: string
}

export const WowGearIcon = ({
    gearItem,
    showTierBanner = false,
    showItemTrackDiff = true,
    showExtendedInfo = false,
    showSlot = false,
    showArmorType = false,
    className,
    iconClassName
}: WowGearIconProps) => {
    const { item, itemLevel, bonusIds, enchantIds, gemIds, itemTrack } = gearItem
    const { id, iconName, tierset, token, name, slotKey, armorType } = item

    const hasSocket = gearhasSocket(bonusIds)
    const hasSpecials = hasSocket || gearTertiary(bonusIds)
    const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`

    const hrefString =
        `https://www.wowhead.com/item=${id}&ilvl=${itemLevel}` +
        (bonusIds?.length ? `&bonus=${bonusIds.join(':')}` : '') +
        (enchantIds?.length ? `&ench=${enchantIds.join(':')}` : '') +
        (gemIds?.length ? `&gems=${gemIds.join(':')}` : '')

    const getItemTrackAbbr = () =>
        showItemTrackDiff
            ? itemTrack
                ? itemTrackToDifficulty(itemTrack.name)
                : bonusIds
                  ? parseItemTrackName(bonusIds, token, tierset)
                      ? itemTrackToDifficulty(parseItemTrackName(bonusIds, token, tierset)!)
                      : ''
                  : ''
            : ''

    const itemTrackToDifficulty = (itemTrack: WowItemTrackName) => {
        switch (itemTrack) {
            case 'Explorer':
                return 'LFR'
            case 'Adventurer':
                return 'LootFilter'
            case 'Veteran':
                return 'LFR'
            case 'Champion':
                return 'Normal'
            case 'Hero':
                return 'Heroic'
            case 'Myth':
                return 'Mythic'
        }
    }

    return (
        <a href={hrefString} rel="noreferrer" target="_blank">
            <div className={cn('flex flex-row items-center', className)}>
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
                        {showTierBanner && (tierset || token) && (
                            <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-red-600"></div>
                        )}
                        {hasSocket && (
                            <div className="absolute bottom-0 right-0">
                                <img
                                    className="w-3 h-3 border"
                                    src="https://www.raidbots.com/frontend/c6217d2ee6dd7647cbfa.png"
                                />
                            </div>
                        )}
                    </div>
                    {!showExtendedInfo && (
                        <p className="flex text-bold text-[11px]">
                            {itemLevel} {getItemTrackAbbr()}
                        </p>
                    )}
                </div>
                {showExtendedInfo && (
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
