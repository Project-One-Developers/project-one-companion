import { currencyIcon } from '@renderer/lib/wow-icon'
import { DroptimizerCurrencies } from '@shared/types/types'

type WowItemIconProps = {
    currency: DroptimizerCurrencies
    iconClassName: string
}

const blackListed: number[] = [
    211516, // DF Spark of Awakening
    190453, // DF Season1 Spark
    204440, // DF Season2 Spark
    206959, // DF Season3 Spark
    198048, // DF Titan Training Matrix I
    1792, // honor
    228338, // Soul Sigil I TWW
    228339, // Soul Sigil II TWW
    210233 // PVP Forged Gladiator's Heraldry
]

export const WowCurrencyIcon = ({ currency, iconClassName }: WowItemIconProps) => {
    const currencyHref = `https://www.wowhead.com/${currency.type}=${currency.id}`
    const currencyInfo = currencyIcon.get(currency.id)

    if (blackListed.includes(currency.id)) {
        return
    }
    if (!currencyInfo) {
        console.log("Skipping currency icon because it doesn't exist: " + currencyHref)
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
