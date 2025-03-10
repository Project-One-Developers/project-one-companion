import { Character } from '@shared/types/types'

type WowCharacterLinkProps = {
    character: Character
    site: 'raiderio' | 'warcraftlogs' | 'armory'
}

export const WowCharacterLink = ({ character, site }: WowCharacterLinkProps) => {
    const getHref = (character: Character, site: 'raiderio' | 'warcraftlogs' | 'armory') => {
        switch (site) {
            case 'warcraftlogs':
                return `https://www.warcraftlogs.com/character/eu/${character.realm}/${character.name}?private=1`
            case 'raiderio':
                return `https://raider.io/characters/eu/${character.realm}/${character.name}`
            case 'armory':
                return `https://worldofwarcraft.blizzard.com/en-gb/character/eu/${character.realm}/${character.name}`
            default:
                return '#'
        }
    }

    const getIconSrc = (site: 'raiderio' | 'warcraftlogs' | 'armory') => {
        switch (site) {
            case 'warcraftlogs':
                return 'https://assets.rpglogs.com/img/warcraft/favicon.png?v=2'
            case 'raiderio':
                return 'https://cdn.raiderio.net/images/mstile-150x150.png'
            case 'armory':
                return 'https://cdn.raiderio.net/assets/img/wow-icon-a718385c1d75ca9edbb3eed0a5546c30.png'
            default:
                return ''
        }
    }

    const href = getHref(character, site)
    const iconSrc = getIconSrc(site)

    return (
        <a href={href} rel="noreferrer" target="_blank">
            <img className="cursor-pointer h-5 w-5" src={iconSrc} />
        </a>
    )
}
