/// sources: https://www.raidbots.com/static/data/live/bonuses.json
// parse tww item tracks:
// jq 'map(select(.upgrade.fullName != null and (.upgrade.seasonId == 24 or .upgrade.seasonId == 25)) | {id, level: .upgrade.level, max: .upgrade.max, name: .upgrade.name, fullName: .upgrade.fullName, itemLevel: .upgrade.itemLevel})' bonus.json > parsed_bonus.json

import { WowItemTrackName, WowRaidDifficulty } from '@shared/types/types'

interface BonusItemTrack {
    level: number
    max: number
    maxItemLevel: number
    name: WowItemTrackName
    fullName: string
    itemLevel: number
    season: number
}

export function queryByItemLevelAndName(
    itemLevel: number,
    name: string
): { key: string; track: BonusItemTrack } | null {
    const entry = Object.entries(bonusItemTracks).find(
        ([, track]) => track.itemLevel === itemLevel && track.name === name
    )
    return entry ? { key: entry[0], track: entry[1] } : null
}

export function queryByItemLevelAndDelta(
    ilvl: number,
    delta: number
): { key: string; track: BonusItemTrack } | null {
    const entry = Object.entries(bonusItemTracks).find(
        ([, track]) => track.itemLevel === ilvl && track.max - track.level === delta
    )
    return entry ? { key: entry[0], track: entry[1] } : null
}

export function trackNameToNumber(name: WowItemTrackName | null | undefined): number | null {
    if (!name) {
        // for gear item without item track
        return null
    }
    switch (name) {
        case 'Explorer':
            return 1
        case 'Adventurer':
            return 2
        case 'Veteran':
            return 3
        case 'Champion':
            return 4
        case 'Hero':
            return 5
        case 'Myth':
            return 6
        default:
            throw new Error('trackNameToNumber: track not supported ' + name)
    }
}

export function wowRaidDiffToTrackName(diff: WowRaidDifficulty): WowItemTrackName {
    let diffName: WowItemTrackName
    switch (diff) {
        case 'LFR':
            diffName = 'Veteran'
            break
        case 'Normal':
            diffName = 'Champion'
            break
        case 'Heroic':
            diffName = 'Hero'
            break
        case 'Mythic':
            diffName = 'Myth'
            break
        default:
            throw new Error('getWowItemTrackName: diff not mapped')
    }
    return diffName
}

export function trackNameToWowDiff(name: WowItemTrackName): WowRaidDifficulty {
    switch (name) {
        case 'Veteran':
            return 'LFR'
        case 'Champion':
            return 'Normal'
        case 'Hero':
            return 'Heroic'
        case 'Myth':
            return 'Mythic'
        default:
            console.log('trackNameToWowDiff: track not supported ' + name)
            return 'LFR'
    }
}

export const bonusItemTracks: { [key: string]: BonusItemTrack } = {
    '10256': {
        level: 6,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 6/6',
        itemLevel: 626,
        season: 1,
        maxItemLevel: 626
    },
    '10257': {
        level: 4,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 4/6',
        itemLevel: 632,
        season: 1,
        maxItemLevel: 639
    },
    '10258': {
        level: 3,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 3/6',
        itemLevel: 629,
        season: 1,
        maxItemLevel: 639
    },
    '10259': {
        level: 2,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 2/6',
        itemLevel: 626,
        season: 1,
        maxItemLevel: 639
    },
    '10260': {
        level: 1,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 1/6',
        itemLevel: 623,
        season: 1,
        maxItemLevel: 639
    },
    '10261': {
        level: 5,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 5/6',
        itemLevel: 623,
        season: 1,
        maxItemLevel: 626
    },
    '10262': {
        level: 4,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 4/6',
        itemLevel: 619,
        season: 1,
        maxItemLevel: 626
    },
    '10263': {
        level: 3,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 3/6',
        itemLevel: 616,
        season: 1,
        maxItemLevel: 626
    },
    '10264': {
        level: 2,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 2/6',
        itemLevel: 613,
        season: 1,
        maxItemLevel: 626
    },
    '10265': {
        level: 1,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 1/6',
        itemLevel: 610,
        season: 1,
        maxItemLevel: 626
    },
    '10266': {
        level: 8,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 8/8',
        itemLevel: 619,
        season: 1,
        maxItemLevel: 619
    },
    '10267': {
        level: 7,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 7/8',
        itemLevel: 616,
        season: 1,
        maxItemLevel: 619
    },
    '10268': {
        level: 6,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 6/8',
        itemLevel: 613,
        season: 1,
        maxItemLevel: 619
    },
    '10269': {
        level: 5,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 5/8',
        itemLevel: 610,
        season: 1,
        maxItemLevel: 619
    },
    '10270': {
        level: 4,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 4/8',
        itemLevel: 606,
        season: 1,
        maxItemLevel: 619
    },
    '10271': {
        level: 3,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 3/8',
        itemLevel: 603,
        season: 1,
        maxItemLevel: 619
    },
    '10272': {
        level: 2,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 2/8',
        itemLevel: 600,
        season: 1,
        maxItemLevel: 619
    },
    '10273': {
        level: 1,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 1/8',
        itemLevel: 597,
        season: 1,
        maxItemLevel: 619
    },
    '10274': {
        level: 8,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 8/8',
        itemLevel: 606,
        season: 1,
        maxItemLevel: 606
    },
    '10275': {
        level: 7,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 7/8',
        itemLevel: 603,
        season: 1,
        maxItemLevel: 606
    },
    '10276': {
        level: 6,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 6/8',
        itemLevel: 600,
        season: 1,
        maxItemLevel: 606
    },
    '10277': {
        level: 5,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 5/8',
        itemLevel: 597,
        season: 1,
        maxItemLevel: 606
    },
    '10278': {
        level: 4,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 4/8',
        itemLevel: 593,
        season: 1,
        maxItemLevel: 606
    },
    '10279': {
        level: 3,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 3/8',
        itemLevel: 590,
        season: 1,
        maxItemLevel: 606
    },
    '10280': {
        level: 2,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 2/8',
        itemLevel: 587,
        season: 1,
        maxItemLevel: 606
    },
    '10281': {
        level: 1,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 1/8',
        itemLevel: 584,
        season: 1,
        maxItemLevel: 606
    },
    '10282': {
        level: 8,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 8/8',
        itemLevel: 580,
        season: 1,
        maxItemLevel: 580
    },
    '10283': {
        level: 7,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 7/8',
        itemLevel: 577,
        season: 1,
        maxItemLevel: 580
    },
    '10284': {
        level: 6,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 6/8',
        itemLevel: 574,
        season: 1,
        maxItemLevel: 580
    },
    '10285': {
        level: 5,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 5/8',
        itemLevel: 571,
        season: 1,
        maxItemLevel: 580
    },
    '10286': {
        level: 4,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 4/8',
        itemLevel: 567,
        season: 1,
        maxItemLevel: 580
    },
    '10287': {
        level: 3,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 3/8',
        itemLevel: 564,
        season: 1,
        maxItemLevel: 580
    },
    '10288': {
        level: 2,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 2/8',
        itemLevel: 561,
        season: 1,
        maxItemLevel: 580
    },
    '10289': {
        level: 1,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 1/8',
        itemLevel: 558,
        season: 1,
        maxItemLevel: 580
    },
    '10290': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 593,
        season: 1,
        maxItemLevel: 593
    },
    '10291': {
        level: 7,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 7/8',
        itemLevel: 590,
        season: 1,
        maxItemLevel: 593
    },
    '10292': {
        level: 6,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 6/8',
        itemLevel: 587,
        season: 1,
        maxItemLevel: 593
    },
    '10293': {
        level: 5,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 5/8',
        itemLevel: 584,
        season: 1,
        maxItemLevel: 593
    },
    '10294': {
        level: 4,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 4/8',
        itemLevel: 580,
        season: 1,
        maxItemLevel: 593
    },
    '10295': {
        level: 3,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 3/8',
        itemLevel: 577,
        season: 1,
        maxItemLevel: 593
    },
    '10296': {
        level: 2,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 2/8',
        itemLevel: 574,
        season: 1,
        maxItemLevel: 593
    },
    '10297': {
        level: 1,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 1/8',
        itemLevel: 571,
        season: 1,
        maxItemLevel: 593
    },
    '10298': {
        level: 5,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 5/6',
        itemLevel: 636,
        season: 1,
        maxItemLevel: 639
    },
    '10299': {
        level: 6,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 6/6',
        itemLevel: 639,
        season: 1,
        maxItemLevel: 639
    },
    // TWW SEASON 2
    '11942': {
        level: 1,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 1/8',
        itemLevel: 597,
        season: 2,
        maxItemLevel: 619
    },
    '11943': {
        level: 2,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 2/8',
        itemLevel: 600,
        season: 2,
        maxItemLevel: 619
    },
    '11944': {
        level: 3,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 3/8',
        itemLevel: 603,
        season: 2,
        maxItemLevel: 619
    },
    '11945': {
        level: 4,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 4/8',
        itemLevel: 606,
        season: 2,
        maxItemLevel: 619
    },
    '11946': {
        level: 5,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 5/8',
        itemLevel: 610,
        season: 2,
        maxItemLevel: 619
    },
    '11947': {
        level: 6,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 6/8',
        itemLevel: 613,
        season: 2,
        maxItemLevel: 619
    },
    '11948': {
        level: 7,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 7/8',
        itemLevel: 616,
        season: 2,
        maxItemLevel: 619
    },
    '11949': {
        level: 8,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 8/8',
        itemLevel: 619,
        season: 2,
        maxItemLevel: 619
    },
    // Adventurer Ok
    '11951': {
        level: 1,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 1/8',
        itemLevel: 610,
        season: 2,
        maxItemLevel: 632
    },
    '11952': {
        level: 2,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 2/8',
        itemLevel: 613,
        season: 2,
        maxItemLevel: 632
    },
    '11953': {
        level: 3,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 3/8',
        itemLevel: 616,
        season: 2,
        maxItemLevel: 632
    },
    '11954': {
        level: 4,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 4/8',
        itemLevel: 619,
        season: 2,
        maxItemLevel: 632
    },
    '11955': {
        level: 5,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 5/8',
        itemLevel: 623,
        season: 2,
        maxItemLevel: 632
    },
    '11956': {
        level: 6,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 6/8',
        itemLevel: 626,
        season: 2,
        maxItemLevel: 632
    },
    '11957': {
        level: 7,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 7/8',
        itemLevel: 629,
        season: 2,
        maxItemLevel: 632
    },
    '11950': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 632,
        season: 2,
        maxItemLevel: 632
    },
    // Veteran Ok
    '11969': {
        level: 1,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 1/8',
        itemLevel: 623,
        season: 2,
        maxItemLevel: 645
    },
    '11970': {
        level: 2,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 2/8',
        itemLevel: 626,
        season: 2,
        maxItemLevel: 645
    },
    '11971': {
        level: 3,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 3/8',
        itemLevel: 629,
        season: 2,
        maxItemLevel: 645
    },
    '11972': {
        level: 4,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 4/8',
        itemLevel: 632,
        season: 2,
        maxItemLevel: 645
    },
    '11973': {
        level: 5,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 5/8',
        itemLevel: 636,
        season: 2,
        maxItemLevel: 645
    },
    '11974': {
        level: 6,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 6/8',
        itemLevel: 639,
        season: 2,
        maxItemLevel: 645
    },
    '11975': {
        level: 7,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 7/8',
        itemLevel: 642,
        season: 2,
        maxItemLevel: 645
    },
    '11976': {
        level: 8,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 8/8',
        itemLevel: 645,
        season: 2,
        maxItemLevel: 645
    },
    // Champion OK
    '11984': {
        level: 8,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 8/8',
        itemLevel: 658,
        season: 2,
        maxItemLevel: 658
    },
    '11983': {
        level: 7,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 7/8',
        itemLevel: 655,
        season: 2,
        maxItemLevel: 658
    },
    '11982': {
        level: 6,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 6/8',
        itemLevel: 652,
        season: 2,
        maxItemLevel: 658
    },
    '11981': {
        level: 5,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 5/8',
        itemLevel: 649,
        season: 2,
        maxItemLevel: 658
    },
    '11980': {
        level: 4,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 4/8',
        itemLevel: 645,
        season: 2,
        maxItemLevel: 658
    },
    '11979': {
        level: 3,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 3/8',
        itemLevel: 642,
        season: 2,
        maxItemLevel: 658
    },
    '11978': {
        level: 2,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 2/8',
        itemLevel: 639,
        season: 2,
        maxItemLevel: 658
    },
    '11977': {
        level: 1,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 1/8',
        itemLevel: 636,
        season: 2,
        maxItemLevel: 658
    },
    // Hero Ok
    '12372': {
        level: 8,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 8/8',
        itemLevel: 671,
        season: 2,
        maxItemLevel: 671
    },
    '12371': {
        level: 7,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 7/8',
        itemLevel: 668,
        season: 2,
        maxItemLevel: 671
    },
    '11990': {
        level: 5,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 6/8',
        itemLevel: 665,
        season: 2,
        maxItemLevel: 671
    },
    '11989': {
        level: 5,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 5/8',
        itemLevel: 662,
        season: 2,
        maxItemLevel: 671
    },
    '11988': {
        level: 4,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 4/8',
        itemLevel: 658,
        season: 2,
        maxItemLevel: 671
    },
    '11987': {
        level: 3,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 3/8',
        itemLevel: 655,
        season: 2,
        maxItemLevel: 671
    },
    '11986': {
        level: 2,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 2/8',
        itemLevel: 652,
        season: 2,
        maxItemLevel: 671
    },
    '11985': {
        level: 1,
        max: 8,
        name: 'Hero',
        fullName: 'Hero 1/8',
        itemLevel: 649,
        season: 2,
        maxItemLevel: 671
    },
    // Mythic OK
    '11991': {
        level: 1,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 1/8',
        itemLevel: 662,
        season: 2,
        maxItemLevel: 684
    },
    '11992': {
        level: 2,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 2/8',
        itemLevel: 665,
        season: 2,
        maxItemLevel: 684
    },
    '11993': {
        level: 3,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 3/8',
        itemLevel: 668,
        season: 2,
        maxItemLevel: 684
    },
    '11994': {
        level: 4,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 4/8',
        itemLevel: 672,
        season: 2,
        maxItemLevel: 684
    },
    '11995': {
        level: 5,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 5/8',
        itemLevel: 675,
        season: 2,
        maxItemLevel: 684
    },
    '11996': {
        level: 6,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 6/8',
        itemLevel: 678,
        season: 2,
        maxItemLevel: 684
    },
    '12375': {
        level: 7,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 7/8',
        itemLevel: 681,
        season: 2,
        maxItemLevel: 684
    },
    '12376': {
        level: 8,
        max: 8,
        name: 'Myth',
        fullName: 'Myth 8/8',
        itemLevel: 684,
        season: 2,
        maxItemLevel: 684
    },
    // TWW SEASON 3
    // jq '.[] | map(select(.seasonId == 30)) | reduce .[] as $item ({}; .[$item.bonusId | tostring] = ($item | {level, max, name, fullName, itemLevel, season: .seasonId, maxItemLevel: 111}))' bonus.json > prova.json

    // EXPLORER TWW SEASON 3
    '12265': {
        level: 1,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 1/8',
        itemLevel: 642,
        season: 3,
        maxItemLevel: 665
    },
    '12266': {
        level: 2,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 2/8',
        itemLevel: 645,
        season: 3,
        maxItemLevel: 665
    },
    '12267': {
        level: 3,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 3/8',
        itemLevel: 649,
        season: 3,
        maxItemLevel: 665
    },
    '12268': {
        level: 4,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 4/8',
        itemLevel: 652,
        season: 3,
        maxItemLevel: 665
    },
    '12269': {
        level: 5,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 5/8',
        itemLevel: 655,
        season: 3,
        maxItemLevel: 665
    },
    '12270': {
        level: 6,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 6/8',
        itemLevel: 658,
        season: 3,
        maxItemLevel: 665
    },
    '12271': {
        level: 7,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 7/8',
        itemLevel: 662,
        season: 3,
        maxItemLevel: 665
    },
    '12272': {
        level: 8,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 8/8',
        itemLevel: 665,
        season: 3,
        maxItemLevel: 665
    },
    // Adventurer TWW SEASON 3
    '12274': {
        level: 1,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 1/8',
        itemLevel: 655,
        season: 3,
        maxItemLevel: 678
    },
    '12275': {
        level: 2,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 2/8',
        itemLevel: 658,
        season: 3,
        maxItemLevel: 678
    },
    '12276': {
        level: 3,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 3/8',
        itemLevel: 662,
        season: 3,
        maxItemLevel: 678
    },
    '12277': {
        level: 4,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 4/8',
        itemLevel: 665,
        season: 3,
        maxItemLevel: 678
    },
    '12278': {
        level: 5,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 5/8',
        itemLevel: 668,
        season: 3,
        maxItemLevel: 678
    },
    '12279': {
        level: 6,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 6/8',
        itemLevel: 671,
        season: 3,
        maxItemLevel: 678
    },
    '12280': {
        level: 7,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 7/8',
        itemLevel: 675,
        season: 3,
        maxItemLevel: 678
    },
    '12281': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 678,
        season: 3,
        maxItemLevel: 678
    },
    // Veteran
    '12282': {
        level: 1,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 1/8',
        itemLevel: 668,
        season: 3,
        maxItemLevel: 691
    },
    '12283': {
        level: 2,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 2/8',
        itemLevel: 671,
        season: 3,
        maxItemLevel: 691
    },
    '12284': {
        level: 3,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 3/8',
        itemLevel: 675,
        season: 3,
        maxItemLevel: 691
    },
    '12285': {
        level: 4,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 4/8',
        itemLevel: 678,
        season: 3,
        maxItemLevel: 691
    },
    '12286': {
        level: 5,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 5/8',
        itemLevel: 681,
        season: 3,
        maxItemLevel: 691
    },
    '12287': {
        level: 6,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 6/8',
        itemLevel: 684,
        season: 3,
        maxItemLevel: 691
    },
    '12288': {
        level: 7,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 7/8',
        itemLevel: 688,
        season: 3,
        maxItemLevel: 691
    },
    '12289': {
        level: 8,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 8/8',
        itemLevel: 691,
        season: 3,
        maxItemLevel: 691
    },
    // Champion TWW SEASON 3
    '12290': {
        level: 1,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 1/8',
        itemLevel: 681,
        season: 3,
        maxItemLevel: 704
    },
    '12291': {
        level: 2,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 2/8',
        itemLevel: 684,
        season: 3,
        maxItemLevel: 704
    },
    '12292': {
        level: 3,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 3/8',
        itemLevel: 688,
        season: 3,
        maxItemLevel: 704
    },
    '12293': {
        level: 4,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 4/8',
        itemLevel: 691,
        season: 3,
        maxItemLevel: 704
    },
    '12294': {
        level: 5,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 5/8',
        itemLevel: 694,
        season: 3,
        maxItemLevel: 704
    },
    '12295': {
        level: 6,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 6/8',
        itemLevel: 697,
        season: 3,
        maxItemLevel: 704
    },
    '12296': {
        level: 7,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 7/8',
        itemLevel: 701,
        season: 3,
        maxItemLevel: 704
    },
    '12297': {
        level: 8,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 8/8',
        itemLevel: 704,
        season: 3,
        maxItemLevel: 704
    },
    // Hero TWW SEASON 3
    '12350': {
        level: 1,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 1/6',
        itemLevel: 694,
        season: 3,
        maxItemLevel: 710
    },
    '12351': {
        level: 2,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 2/6',
        itemLevel: 697,
        season: 3,
        maxItemLevel: 710
    },
    '12352': {
        level: 3,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 3/6',
        itemLevel: 701,
        season: 3,
        maxItemLevel: 710
    },
    '12353': {
        level: 4,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 4/6',
        itemLevel: 704,
        season: 3,
        maxItemLevel: 710
    },
    '12354': {
        level: 5,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 5/6',
        itemLevel: 707,
        season: 3,
        maxItemLevel: 710
    },
    '12355': {
        level: 6,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 6/6',
        itemLevel: 710,
        season: 3,
        maxItemLevel: 710
    },
    // Myth TWW SEASON 3
    '12356': {
        level: 1,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 1/6',
        itemLevel: 707,
        season: 3,
        maxItemLevel: 723
    },
    '12357': {
        level: 2,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 2/6',
        itemLevel: 710,
        season: 3,
        maxItemLevel: 723
    },
    '12358': {
        level: 3,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 3/6',
        itemLevel: 714,
        season: 3,
        maxItemLevel: 723
    },
    '12359': {
        level: 4,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 4/6',
        itemLevel: 717,
        season: 3,
        maxItemLevel: 723
    },
    '12360': {
        level: 5,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 5/6',
        itemLevel: 720,
        season: 3,
        maxItemLevel: 723
    },
    '12361': {
        level: 6,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 6/6',
        itemLevel: 723,
        season: 3,
        maxItemLevel: 723
    }
}
