import { WowItemTrackName } from '@shared/types/types'

interface BonusItemTrack {
    level: number
    max: number
    maxItemLevel: number
    name: WowItemTrackName
    fullName: string
    itemLevel: number
    season: number
}

export function queryByItemLevelAndName(itemLevel: number, name: string): BonusItemTrack | null {
    return (
        Object.values(bonusItemTracks).find(
            (track) => track.itemLevel === itemLevel && track.name === name
        ) ?? null
    )
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
    '11950': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 632,
        season: 2,
        maxItemLevel: 632
    },
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
    '11991': {
        level: 1,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 1/6',
        itemLevel: 662,
        season: 2,
        maxItemLevel: 678
    },
    '11992': {
        level: 2,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 2/6',
        itemLevel: 665,
        season: 2,
        maxItemLevel: 678
    },
    '11993': {
        level: 3,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 3/6',
        itemLevel: 668,
        season: 2,
        maxItemLevel: 678
    },
    '11994': {
        level: 4,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 4/6',
        itemLevel: 672,
        season: 2,
        maxItemLevel: 678
    },
    '11995': {
        level: 5,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 5/6',
        itemLevel: 675,
        season: 2,
        maxItemLevel: 678
    },
    '11996': {
        level: 6,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 6/6',
        itemLevel: 678,
        season: 2,
        maxItemLevel: 678
    }
}

export default bonusItemTracks
