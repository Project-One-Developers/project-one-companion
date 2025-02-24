import { currencyIcon } from '@renderer/lib/wow-icon'
import { DroptimizerCurrencies } from '@shared/types/types'

type WowItemIconProps = {
    currency: DroptimizerCurrencies
    iconClassName: string
}

export const WowCurrencyIcon = ({ currency, iconClassName }: WowItemIconProps) => {
    const currencyHref = `https://www.wowhead.com/${currency.type}=${currency.id}`
    const currencyInfo = currencyIcon.get(currency.id)

    if (!currencyInfo) {
        console.log("Skipping currency icon because it doesn't exist: " + currency.id)
        return null
    }

    return (
        <a
            className="flex items-center justify-center"
            href={currencyHref}
            rel="noreferrer"
            target="_blank"
        >
            <div className="flex flex-col items-center justify-center relative group">
                <img
                    src={currencyInfo?.url}
                    alt={currencyInfo?.name}
                    className={`${iconClassName} block`}
                />
                <p className="text-bold text-[11px]">{currency.amount}</p>
            </div>
        </a>
    )
}
