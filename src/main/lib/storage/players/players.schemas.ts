import { wowClassNameSchema, wowRolesSchema } from '@shared/schemas/wow.schemas'
import { z } from 'zod'

const playerStorageSchema = z
    .object({
        id: z.string(),
        name: z.string(),
        characters: z.array(
            z.object({
                id: z.string(),
                name: z.string(),
                realm: z.string(),
                class: wowClassNameSchema,
                role: wowRolesSchema,
                main: z.boolean(),
                playerId: z.string()
            })
        )
    })
    .transform((data) => ({
        id: data.id,
        name: data.name,
        characters: data.characters.map((char) => ({
            id: char.id,
            name: char.name,
            realm: char.realm,
            main: char.main,
            class: char.class,
            role: char.role,
            playerId: char.playerId
        }))
    }))

export const playersListStorageSchema = z.array(playerStorageSchema)
