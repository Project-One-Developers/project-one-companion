import { useEffect } from 'react'

export const WowheadLink = ({ itemId, ...props }: { itemId: number } & any) => {
    const className = props.className ?? ''

    useEffect(() => {
        window.$WowheadPower.refreshLinks() // vomito
    }, [itemId])

    return (
        <a
            href={`/items/${itemId}`}
            data-wowhead={`item=${itemId}?`}
            data-wh-rename-link="true"
            {...props}
            className={`q3 links ${className}`}
        >
            Wowhead link to item with id {itemId}
        </a>
    )
}
