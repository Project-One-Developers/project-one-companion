import { cn } from '@renderer/lib/utils'
import { gearhasSocket, gearTertiary } from '@shared/libs/items/item-bonus-utils'
import { formatWowSlotKey } from '@shared/libs/items/item-slot-utils'
import { GearItem } from '@shared/types/types'

type WowGearIconProps = {
    item: GearItem
    showTierBanner?: boolean
    showItemTrackDiff?: boolean
    showExtendedInfo?: boolean
    showSlot?: boolean
    showArmorType?: boolean
    className?: string
    iconClassName?: string
}

export const WowGearIcon = ({
    item: gear,
    showTierBanner = false,
    showItemTrackDiff = true,
    showExtendedInfo = false,
    showSlot = false,
    showArmorType = false,
    className,
    iconClassName
}: WowGearIconProps) => {
    const hasSocket = gearhasSocket(gear.bonusIds)
    const hasSpecials = hasSocket || gearTertiary(gear.bonusIds)
    const iconUrl = `https://wow.zamimg.com/images/wow/icons/large/${gear.item.iconName}.jpg`

    // todo: avoid setting explicit ilvl if bonus id is present
    const hrefString = `https://www.wowhead.com/item=${gear.item.id}&ilvl=${gear.itemLevel}${gear.bonusIds ? `&bonus=${gear.bonusIds.join(':')}` : ''}${gear.enchantIds ? `&ench=${gear.enchantIds.join(':')}` : ''}${gear.gemIds ? `&gems=${gear.gemIds.join(':')}` : ''}`

    return (
        <a className="" href={hrefString} rel="noreferrer" target="_blank">
            <div className={cn(`flex flex-row items-center`, className)}>
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
                        {showTierBanner && (gear.item.tierset || gear.item.token) && (
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
                            {gear.itemLevel}
                            {showItemTrackDiff ? gear.itemTrack?.name.charAt(0) : ''}
                        </p>
                    )}
                </div>
                {showExtendedInfo && (
                    <div id="item-info" className="flex flex-col ml-3">
                        <p className="font-black text-xs">{gear.item.name}</p>
                        <div className="flex">
                            {showSlot && (
                                <p className="text-xs mr-1">
                                    {formatWowSlotKey(gear.item.slotKey)}
                                </p>
                            )}
                            {showArmorType && (gear.item.armorType || gear.item.token) && (
                                <p className="text-xs mr-1">
                                    {gear.item.token ? 'Token' : gear.item.armorType}
                                    {' • '}
                                </p>
                            )}
                            <p className="flex  text-bold text-[11px]">
                                {gear.itemLevel}
                                {showItemTrackDiff && gear.itemTrack
                                    ? gear.itemTrack.name.charAt(0)
                                    : ''}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </a>
    )
}
