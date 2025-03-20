import { CURRENT_RAID_ID } from '@shared/consts/wow.consts'
import { getUnixTimestamp } from '@shared/libs/date/date-utils'
import {
    BossWithItems,
    Character,
    EditRaidSession,
    LootWithAssigned,
    NewRaidSession,
    RaidSession,
    RaidSessionWithRoster,
    RaidSessionWithSummary
} from '@shared/types/types'
import { getLootsByRaidSessionIdWithAssigned } from '@storage/loots/loots.storage'
import { getCharactersList } from '@storage/players/characters.storage'
import {
    addRaidSession,
    deleteRaidSession,
    editRaidSession,
    getRaidSession,
    getRaidSessionWithRoster,
    getRaidSessionWithSummaryList
} from '@storage/raid-session/raid-session.storage'
import { newUUID } from '@utils'
import { getRaidLootTableHandler } from '../bosses/bosses.handlers'

export const getRaidSessionWithRosterHandler = async (
    id: string
): Promise<RaidSessionWithRoster> => {
    return await getRaidSessionWithRoster(id)
}

export const getRaidSessionWithSummaryListHandler = async (): Promise<RaidSessionWithSummary[]> => {
    return await getRaidSessionWithSummaryList()
}

export const addRaidSessionHandler = async (raidSession: NewRaidSession): Promise<RaidSession> => {
    const id = await addRaidSession(raidSession)
    return await getRaidSession(id)
}

export const editRaidSessionHandler = async (
    editedRaidSession: EditRaidSession
): Promise<RaidSession> => {
    // edit
    await editRaidSession(editedRaidSession)

    // retrieve updated raid session
    return await getRaidSession(editedRaidSession.id)
}

export const deleteRaidSessionHandler = async (id: string): Promise<void> => {
    return await deleteRaidSession(id)
}

export const cloneRaidSessionHandler = async (id: string): Promise<RaidSession> => {
    const source = await getRaidSessionWithRoster(id)
    const cloned: NewRaidSession = {
        name: source.name + '-' + newUUID().slice(0, 6),
        raidDate: getUnixTimestamp(), // set now as session date
        roster: source.roster.map((r) => r.id)
    }
    return await addRaidSessionHandler(cloned)
}

export const importRosterInRaidSessionHandler = async (
    raidSessionId: string,
    csv: string
): Promise<void> => {
    const source = await getRaidSession(raidSessionId)
    const allCharacters = await getCharactersList()

    // parse csv: each line is a character name-server or character name
    const roster: Character[] = csv
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => {
            const [name] = line.split('-')
            const matches = allCharacters.filter((r) => r.name === name)

            if (matches.length === 0) {
                return undefined
            } else if (matches.length === 1) {
                return matches[0]
            } else {
                // multiple matches, prefer main
                return matches.find((r) => r.main)
            }
        })
        .filter((r) => r !== undefined)

    console.log(csv)
    console.log(roster)

    const editedRaidSession: EditRaidSession = {
        ...source,
        roster: roster.map((r) => r.id)
    }

    // edit
    await editRaidSession(editedRaidSession)
}

export const getRaidSessionStatistics = async (raidSessionId: string): Promise<void> => {
    const loots: LootWithAssigned[] = await getLootsByRaidSessionIdWithAssigned(raidSessionId)
    //const allCharacters = await getCharactersList()
    const raidLootTable: BossWithItems[] = await getRaidLootTableHandler(CURRENT_RAID_ID)

    raidLootTable.forEach((boss) => {
        const bossItemsIds = boss.items.map((i) => i.id)
        const bossLoots = loots.filter((l) => bossItemsIds.includes(l.itemId))

        console.log('Boss:', boss.name)
        console.log('Total:', bossLoots.length)
        console.log('---')
    })
}
