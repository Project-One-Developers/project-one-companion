import { Client, FetchMessagesOptions, GatewayIntentBits, Message, TextChannel } from 'discord.js'

export async function readAllMessagesInDiscord(
    discordBotToken: string,
    discordChannelId: string
): Promise<Message[]> {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]
    })

    try {
        await client.login(discordBotToken)

        const channel = (await client.channels.fetch(discordChannelId)) as TextChannel
        if (!channel || !channel.isTextBased()) {
            throw new Error('Channel not found or not a text channel')
        }

        let messages: Message[] = []
        let lastId

        while (true) {
            const options: FetchMessagesOptions = { limit: 100 }
            if (lastId) {
                options.before = lastId
            }

            const fetchedMessages = await channel.messages.fetch(options)

            if (fetchedMessages.size === 0) break

            messages = [...messages, ...fetchedMessages.values()]
            lastId = fetchedMessages.last()?.id
        }

        console.log(`Fetched ${messages.length} messages`)

        client.destroy()

        return messages
    } catch (error) {
        console.error('Error syncing from Discord:', error)
        client.destroy()
        return []
    }
}
