import { GearItem, Item, ItemTrack, WowItemTrackName, WowRaidDifficulty } from '@shared/types/types'
import {
    bonusItemTracks,
    queryByItemLevelAndDelta,
    queryByItemLevelAndName,
    trackNameToNumber,
    trackNameToWowDiff,
    wowRaidDiffToTrackName
} from './item-tracks'

/**
 * Return item track name.
 * In case of token or tierset the track name is not well defined, we deduce it from Diff bonusId
 */
export function parseItemTrackName(
    bonusIds: number[],
    isToken: boolean,
    isTierset: boolean
): WowItemTrackName | null {
    const itemTrack = parseItemTrack(bonusIds)

    if (itemTrack) return itemTrack.name
    if (!itemTrack && bonusIds.length == 0) return null

    if (bonusIds.includes(10356)) {
        // bonus id for Mythic
        return 'Myth'
    } else if (bonusIds.includes(10355)) {
        // bonus id for Heroic
        return 'Hero'
    } else if (bonusIds.includes(10353)) {
        // bonus id for lfr
        return 'Veteran'
    }

    if (isToken || isTierset) {
        // if i am here and its a tierset/token -> Champion track becouse it doesnt have diff bonus ids
        return 'Champion'
    }

    //all other items -> no info
    return null
}

/**
 * Compare two gear item to find if its the same item id and diff tracks (es: Spymaster 632M and 639M are the same item)
 */
export function gearAreTheSame(a: GearItem, b: GearItem): boolean {
    let aItemId = a.item.id
    let bItemId = b.item.id

    // workaround for one armed bandit best-in-slots: 232526, 232805
    if (aItemId === 232805) {
        aItemId = 232526
    }
    if (bItemId === 232805) {
        bItemId = 232526
    }

    if (aItemId !== bItemId || a.item.season !== b.item.season) {
        return false // Different item ID or season
    }

    if (a.itemTrack && b.itemTrack) {
        return a.itemTrack.maxItemLevel === b.itemTrack.maxItemLevel
    }

    if (a.item.token && b.item.token) {
        // Ensure correct bonusIds are used for each comparison
        const aTrackName = parseItemTrackName(a.bonusIds ?? [], a.item.token, a.item.tierset)
        const bTrackName = parseItemTrackName(b.bonusIds ?? [], b.item.token, b.item.tierset)
        return aTrackName === bTrackName
    }

    return false // Not comparable -> not the same item
}

/**
 * Compare gear item a and b
 * Compare over season, item track, item level (it detects overlaps like 626HC vs 626M)
 * @param a First Gear to compare
 * @param b Second Gear to compare
 * @returns 1 if a is an upgrade over b, -1 b otherwise, 0 if are the same
 */
export function compareGearItem(a: GearItem, b: GearItem): number {
    const delta = a.itemLevel - b.itemLevel

    if (a.item.season != b.item.season) {
        // a is item from new season
        return a.item.season > b.item.season ? 1 : -1
    }

    if (a.itemTrack && b.itemTrack) {
        // Compare max theoretical item level
        return Math.sign(a.itemTrack.maxItemLevel - b.itemTrack.maxItemLevel)
    }

    if ((a.item.token || b.item.token) && Math.abs(delta) <= 9) {
        // Token doesn't have item track
        const aDiff = trackNameToNumber(
            parseItemTrackName(a.bonusIds ?? [], a.item.token, a.item.tierset)
        )
        const bDiff = trackNameToNumber(
            parseItemTrackName(b.bonusIds ?? [], b.item.token, b.item.tierset)
        )

        // The item with a track wins over one without a track
        if (aDiff && !bDiff) return 1
        if (!aDiff && bDiff) return -1

        return Math.sign(aDiff! - bDiff!)
    }

    // If difference is above 9, we use item level difference directly
    return Math.sign(delta)
}

export function parseItemLevelFromBonusIds(item: Item, bonusIds: number[]): number | null {
    const diff = parseItemTrackName(bonusIds, item.token, item.tierset)

    if (diff != null) {
        switch (diff) {
            case 'Veteran':
                return item.ilvlBase + 22
            case 'Champion':
                return item.ilvlNormal
            case 'Hero':
                return item.ilvlHeroic
            case 'Myth':
                return item.ilvlMythic
            default:
                throw Error('parseItemLevelFromBonusIds: ' + diff + ' not mapped')
        }
    }

    // crafted items ilvl (10222 = Omen Crafted -> 593)
    // TWW season 1
    if (bonusIds.includes(10222)) {
        //const baseLevel = 597
        if (bonusIds.includes(11144)) {
            // tww season 1 mythic crest
            return 636
        } else if (bonusIds.includes(11143)) {
            // tww season 1 hc crest
            return 619
        }
    }
    // craft items ilvl (12040 = Fortune Crafted -> 632)
    // TWW season 2
    if (bonusIds.includes(12040)) {
        // tww season 2 crafted item
        if (bonusIds.includes(12043)) {
            // tww season 2 mythic crest
            return 681
        } else if (bonusIds.includes(12042)) {
            // tww season 2 hc crest
            return 664
        }
    }

    // craft items ilvl (12050 = Starlight Crafted)
    // TWW season 3
    if (bonusIds.includes(12050)) {
        // tww season 2 crafted item
        if (bonusIds.includes(12053)) {
            // tww season 3 mythic crest
            return 720
        } else if (bonusIds.includes(12052)) {
            // tww season 3 hc crest
            return 710
        }
    }

    // edge case items (not worth mapping all possible states with bonus id, assume player has maxed them)
    if (item.id === 228411 || item.sourceType === 'special-tww-s1-finger') {
        // tww season 1 -  Cyrce's Circlet (Siren Isles)
        return 658
    }
    if (item.sourceType === 'special-tww-s2-belt') {
        // tww season 2 -  Durable Information Securing Container
        return 701
    }
    if (item.sourceType === 'special-tww-s3-back') {
        // tww season 3 -  Reshii Wraps
        return 730
    }

    return null
}

export function evalRealSeason(item: Item, ilvl: number) {
    if (item.sourceType === 'profession593') {
        // crafted item
        if (ilvl <= 636) return 1
        if (ilvl > 636 && ilvl <= 681) return 2
        if (ilvl > 681 && ilvl <= 720) return 3
        throw new Error(
            'evalRealSeason: impossible to detect real season for crafted item - ' +
                JSON.stringify(item)
        )
    }
    return item.season
}

export function parseItemLevelFromRaidDiff(item: Item, raidDiff: WowRaidDifficulty): number {
    switch (raidDiff) {
        case 'LFR':
            return item.ilvlBase + 22
        case 'Normal':
            return item.ilvlNormal
        case 'Heroic':
            return item.ilvlHeroic
        case 'Mythic':
            return item.ilvlMythic
        default:
            throw new Error('parseItemLevelFromRaidLoot: unable to map raid diff')
    }
}

export function parseItemTrack(input: number[]): ItemTrack | null {
    const matchingBonus = input.find(bonus => bonus in bonusItemTracks) ?? null

    // Return the matching track or null if none found
    return matchingBonus ? bonusItemTracks[matchingBonus] : null
}

export const gearHasAvoidance = (input: number[] | null): boolean =>
    input ? input.includes(40) : false

export const gearHasLeech = (input: number[] | null): boolean =>
    input ? input.includes(41) : false

export const gearHasSpeed = (input: number[] | null): boolean =>
    input ? input.includes(42) : false

// 10397,12055 Primastic Socket
// 11307 Socket on Crafted Gear
export const gearhasSocket = (input: number[] | null): boolean =>
    input ? [10397, 11307, 12055].some(value => input.includes(value)) : false

export const gearTertiary = (input: number[] | null): boolean =>
    gearHasAvoidance(input) || gearHasLeech(input) || gearHasSpeed(input)

export function getItemTrack(ilvl: number, diff: WowRaidDifficulty): ItemTrack | null {
    const diffName: WowItemTrackName = wowRaidDiffToTrackName(diff)
    const res = queryByItemLevelAndName(ilvl, diffName)
    if (res != null) {
        return res.track
    }
    return null
}

// gear manipolation

export function applyDiffBonusId(input: number[], diff: WowRaidDifficulty): void {
    // Beware: normal diff has no modifier
    switch (diff) {
        case 'LFR':
            input.push(10353)
            break
        case 'Heroic':
            input.push(10355)
            break
        case 'Mythic':
            input.push(10356)
            break
    }
}

/**
 * Apply track bonus ids and return
 * @param input Bonus id array to fill
 * @param ilvl Gear ilvl
 * @param delta Gear delta to reach max track upgrade (eg: for 4/6M delta is 2)
 */
export function applyItemTrackByIlvlAndDelta(
    input: number[],
    ilvl: number,
    delta: number
): ItemTrack | null {
    const res = queryByItemLevelAndDelta(ilvl, delta)
    if (res == null) {
        return null
    }
    input.push(Number(res.key))

    // apply diff bonus id
    applyDiffBonusId(input, trackNameToWowDiff(res.track.name))

    return res.track
}

/**
 * Apply track bonus ids and return
 * @param input Bonus id array to fill
 * @param ilvl Gear ilvl
 * @param diff Gear raid difficulty (eg: Heroic item)
 */
export function applyItemTrackByIlvlAndDiff(
    input: number[],
    ilvl: number,
    diff: WowRaidDifficulty
): ItemTrack | null {
    applyDiffBonusId(input, diff)
    const diffName: WowItemTrackName = wowRaidDiffToTrackName(diff)
    const res = queryByItemLevelAndName(ilvl, diffName)
    if (res != null) {
        input.push(Number(res.key))
        return res.track
    }
    return null
}

export function applySocket(input: number[]): void {
    input.push(12055)
}
export function applyAvoidance(input: number[]): void {
    input.push(40)
}
export function applyLeech(input: number[]): void {
    input.push(41)
}
export function applySpeed(input: number[]): void {
    input.push(42)
}
