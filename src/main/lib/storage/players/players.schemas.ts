import { z } from 'zod'
import { wowClassSchema, wowRolesSchema } from '../../../../../shared/schemas/wow.schemas'

const playerPGSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        chars: z.array(
            z.object({
                id: z.string(),
                class: wowClassSchema,
                role: wowRolesSchema,
                name: z.string(),
                playerId: z.string()
            })
        )
    })
    .transform((data) => ({
        id: data.id,
        playerName: data.name,
        characters: data.chars.map((char) => ({
            id: char.id,
            class: char.class,
            role: char.role,
            characterName: char.name
        }))
    }))

export const playersListPGSchema = z.array(playerPGSchema)
