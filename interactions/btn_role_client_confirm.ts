import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js"
import { client } from ".."

export const data = {
    customId: 'btn_role_client_confirm',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1237694138481119303')
        if(role)
        member.roles.add(role)
        interaction.reply({content: `You've successfully been given the <@&${role?.id}> role.`, ephemeral: true})
    } catch {}
    return
}