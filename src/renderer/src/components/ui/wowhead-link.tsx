import { useEffect } from 'react'

export const WowheadLink = ({
    itemId,
    itemLvl,
    specId,
    iconOnly = true,
    ...props
}: { itemId: number; itemLvl: number; specId: number; iconOnly: boolean } & any) => {
    const className = props.className ?? ''

    useEffect(() => {
        window.$WowheadPower.refreshLinks() // vomito ma senza questo la lib di wowhead non aggiunge le icon
    }, [itemId, iconOnly])

    return (
        <a
            target="_blank"
            rel="noreferrer"
            href={`/items/${itemId}`}
            data-wowhead={`item=${itemId}?ilvl=${itemLvl}&spec=${specId}`}
            data-wh-rename-link={iconOnly ? 'false' : 'true'}
            {...props}
            className={`q3 links ${className}`}
        >
            {iconOnly ? '' : 'Wowhead link to item with id ' + itemId}
        </a>
    )
}
