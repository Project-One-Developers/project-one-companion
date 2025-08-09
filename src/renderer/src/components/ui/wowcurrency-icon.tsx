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
    197921, // DF Primal Infusion
    198048, // DF Titan Training Matrix I
    198056, // DF Titan Training Matrix II
    198058, // DF Titan Training Matrix III
    198059, // DF Titan Training Matrix IV
    198046, // DF Concentrated Primal Infusion
    204682, // DF Enchanted Wyrm's Shadowflame Crest
    2122, // DF Storm Sigil
    228338, // TWW Soul Sigil I
    228339, // TWW Soul Sigil II
    210221, // TWW Season 1 Pvp Forged Combatant's Heraldry
    211296, // TWW Season 1 Spark
    224069, // TWW Season Enchanted Weathered Harbinger Crest
    224072, // TWW Season 1 Enchanted Runed Harbinger Crest
    224073, // TWW Season 1 Enchanted Gilded Harbinger Crest
    1792, // PVP honor
    210233, // PVP Forged Gladiator's Heraldry
    210232, // PVP Forged Aspirant's Heraldry
    230936, // TWW Season 2 Enchanted Runed Undermine Crest
    230905, // TWW Season 2 Fractured Spark of Fortunes
    230906, // TWW Season 2 Spark of Fortunes
    3107, // TWW Season 2 Weathered Undermine Crest
    3108, // TWW Season 2 Carved Undermine Crest
    3109, // TWW Season 2 Runed Undermine Crest
    3110, // TWW Season 2 Gilded Undermine Crest
    230906, // TWW Season 2 Spark of Fortunes
    230936, // TWW Season 2 Enchanted Runed Undermine Crest
    230935 // TWW Season 2 Enchanted Gilded Undermine Crest
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
