interface BonusItemTrack {
    level: number
    max: number
    name: string
    fullName: string
    itemLevel: number
}

export function queryByItemLevelAndName(itemLevel: number, name: string): BonusItemTrack | null {
    return (
        Object.values(bonusItemTracks).find(
            (track) => track.itemLevel === itemLevel && track.name === name
        ) ?? null
    )
}

export const bonusItemTracks: { [key: string]: BonusItemTrack } = {
    '10256': {
        level: 6,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 6/6',
        itemLevel: 626
    },
    '10257': {
        level: 4,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 4/6',
        itemLevel: 632
    },
    '10258': {
        level: 3,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 3/6',
        itemLevel: 629
    },
    '10259': {
        level: 2,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 2/6',
        itemLevel: 626
    },
    '10260': {
        level: 1,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 1/6',
        itemLevel: 623
    },
    '10261': {
        level: 5,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 5/6',
        itemLevel: 623
    },
    '10262': {
        level: 4,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 4/6',
        itemLevel: 619
    },
    '10263': {
        level: 3,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 3/6',
        itemLevel: 616
    },
    '10264': {
        level: 2,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 2/6',
        itemLevel: 613
    },
    '10265': {
        level: 1,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 1/6',
        itemLevel: 610
    },
    '10266': {
        level: 8,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 8/8',
        itemLevel: 619
    },
    '10267': {
        level: 7,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 7/8',
        itemLevel: 616
    },
    '10268': {
        level: 6,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 6/8',
        itemLevel: 613
    },
    '10269': {
        level: 5,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 5/8',
        itemLevel: 610
    },
    '10270': {
        level: 4,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 4/8',
        itemLevel: 606
    },
    '10271': {
        level: 3,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 3/8',
        itemLevel: 603
    },
    '10272': {
        level: 2,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 2/8',
        itemLevel: 600
    },
    '10273': {
        level: 1,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 1/8',
        itemLevel: 597
    },
    '10274': {
        level: 8,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 8/8',
        itemLevel: 606
    },
    '10275': {
        level: 7,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 7/8',
        itemLevel: 603
    },
    '10276': {
        level: 6,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 6/8',
        itemLevel: 600
    },
    '10277': {
        level: 5,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 5/8',
        itemLevel: 597
    },
    '10278': {
        level: 4,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 4/8',
        itemLevel: 593
    },
    '10279': {
        level: 3,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 3/8',
        itemLevel: 590
    },
    '10280': {
        level: 2,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 2/8',
        itemLevel: 587
    },
    '10281': {
        level: 1,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 1/8',
        itemLevel: 584
    },
    '10282': {
        level: 8,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 8/8',
        itemLevel: 580
    },
    '10283': {
        level: 7,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 7/8',
        itemLevel: 577
    },
    '10284': {
        level: 6,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 6/8',
        itemLevel: 574
    },
    '10285': {
        level: 5,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 5/8',
        itemLevel: 571
    },
    '10286': {
        level: 4,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 4/8',
        itemLevel: 567
    },
    '10287': {
        level: 3,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 3/8',
        itemLevel: 564
    },
    '10288': {
        level: 2,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 2/8',
        itemLevel: 561
    },
    '10289': {
        level: 1,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 1/8',
        itemLevel: 558
    },
    '10290': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 593
    },
    '10291': {
        level: 7,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 7/8',
        itemLevel: 590
    },
    '10292': {
        level: 6,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 6/8',
        itemLevel: 587
    },
    '10293': {
        level: 5,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 5/8',
        itemLevel: 584
    },
    '10294': {
        level: 4,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 4/8',
        itemLevel: 580
    },
    '10295': {
        level: 3,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 3/8',
        itemLevel: 577
    },
    '10296': {
        level: 2,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 2/8',
        itemLevel: 574
    },
    '10297': {
        level: 1,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 1/8',
        itemLevel: 571
    },
    '10298': {
        level: 5,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 5/6',
        itemLevel: 636
    },
    '10299': {
        level: 6,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 6/6',
        itemLevel: 639
    },
    '11942': {
        level: 1,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 1/8',
        itemLevel: 597
    },
    '11943': {
        level: 2,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 2/8',
        itemLevel: 600
    },
    '11944': {
        level: 3,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 3/8',
        itemLevel: 603
    },
    '11945': {
        level: 4,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 4/8',
        itemLevel: 606
    },
    '11946': {
        level: 5,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 5/8',
        itemLevel: 610
    },
    '11947': {
        level: 6,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 6/8',
        itemLevel: 613
    },
    '11948': {
        level: 7,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 7/8',
        itemLevel: 616
    },
    '11949': {
        level: 8,
        max: 8,
        name: 'Explorer',
        fullName: 'Explorer 8/8',
        itemLevel: 619
    },
    '11950': {
        level: 8,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 8/8',
        itemLevel: 632
    },
    '11951': {
        level: 1,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 1/8',
        itemLevel: 610
    },
    '11952': {
        level: 2,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 2/8',
        itemLevel: 613
    },
    '11953': {
        level: 3,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 3/8',
        itemLevel: 616
    },
    '11954': {
        level: 4,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 4/8',
        itemLevel: 619
    },
    '11955': {
        level: 5,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 5/8',
        itemLevel: 623
    },
    '11956': {
        level: 6,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 6/8',
        itemLevel: 626
    },
    '11957': {
        level: 7,
        max: 8,
        name: 'Adventurer',
        fullName: 'Adventurer 7/8',
        itemLevel: 629
    },
    '11969': {
        level: 1,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 1/8',
        itemLevel: 623
    },
    '11970': {
        level: 2,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 2/8',
        itemLevel: 626
    },
    '11971': {
        level: 3,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 3/8',
        itemLevel: 629
    },
    '11972': {
        level: 4,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 4/8',
        itemLevel: 632
    },
    '11973': {
        level: 5,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 5/8',
        itemLevel: 636
    },
    '11974': {
        level: 6,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 6/8',
        itemLevel: 639
    },
    '11975': {
        level: 7,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 7/8',
        itemLevel: 642
    },
    '11976': {
        level: 8,
        max: 8,
        name: 'Veteran',
        fullName: 'Veteran 8/8',
        itemLevel: 645
    },
    '11977': {
        level: 1,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 1/8',
        itemLevel: 636
    },
    '11978': {
        level: 2,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 2/8',
        itemLevel: 639
    },
    '11979': {
        level: 3,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 3/8',
        itemLevel: 642
    },
    '11980': {
        level: 4,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 4/8',
        itemLevel: 645
    },
    '11982': {
        level: 6,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 6/8',
        itemLevel: 652
    },
    '11983': {
        level: 7,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 7/8',
        itemLevel: 655
    },
    '11984': {
        level: 8,
        max: 8,
        name: 'Champion',
        fullName: 'Champion 8/8',
        itemLevel: 658
    },
    '11985': {
        level: 1,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 1/6',
        itemLevel: 649
    },
    '11986': {
        level: 2,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 2/6',
        itemLevel: 652
    },
    '11987': {
        level: 3,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 3/6',
        itemLevel: 655
    },
    '11988': {
        level: 4,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 4/6',
        itemLevel: 658
    },
    '11989': {
        level: 5,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 5/6',
        itemLevel: 662
    },
    '11990': {
        level: 6,
        max: 6,
        name: 'Hero',
        fullName: 'Hero 6/6',
        itemLevel: 665
    },
    '11991': {
        level: 1,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 1/6',
        itemLevel: 662
    },
    '11992': {
        level: 2,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 2/6',
        itemLevel: 665
    },
    '11993': {
        level: 3,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 3/6',
        itemLevel: 668
    },
    '11994': {
        level: 4,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 4/6',
        itemLevel: 672
    },
    '11995': {
        level: 5,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 5/6',
        itemLevel: 675
    },
    '11996': {
        level: 6,
        max: 6,
        name: 'Myth',
        fullName: 'Myth 6/6',
        itemLevel: 678
    }
}

export default bonusItemTracks
