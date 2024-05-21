import { ButtonInteraction } from "discord.js"
import { client } from ".."

export const data = {
    customId: 'btn_role_thumbnail',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1240765963272716390')
        if(role) {
            if(member.roles.cache.has(role.id)) {
                member.roles.remove(role)
                interaction.reply({content: 'Your role has been removed.', ephemeral: true})
            } else {
                member.roles.add(role)
                interaction.reply({content: 'You have been given the Thumbnail role.', ephemeral: true})
            }
        }
    } catch {}
    return
}