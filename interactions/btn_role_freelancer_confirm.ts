import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js"
import { client } from ".."

export const data = {
    customId: 'btn_role_freelancer_confirm',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1237694103010152458')
        if(role) 
        member.roles.add(role)
        interaction.reply(`You've successfully been given the <@&${role?.id}> role.`)
    } catch {}
    return
}