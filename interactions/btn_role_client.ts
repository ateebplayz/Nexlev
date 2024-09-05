import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js"
import { client } from ".."

export const data = {
    customId: 'btn_role_client',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1237694138481119303')
        const role2 = await member.guild.roles.fetch('1237694103010152458')
        if(role && role2 && (member.roles.cache.has(role.id) || member.roles.cache.has(role2.id))) {
            return interaction.reply({content: `You can no longer change your main role. If you wish to switch your role, please open a support ticket`, ephemeral: true})
        }
        if(role) {
            const button = new ButtonBuilder().setCustomId('btn_role_client_confirm').setLabel('Confirm').setStyle(ButtonStyle.Success)
            const actionRow = new ActionRowBuilder<ButtonBuilder>().setComponents(button)
            interaction.reply({embeds: [
                {
                "description": `<:flecha113:1239895323594457149> Are you sure you want to select this (<@&${role?.id}>)  After confirming, you cannot undo your selection.`,
                "color": 1617663
                }
            ], components: [actionRow], ephemeral: true})
        } else interaction.reply({content: 'An Error Occured', ephemeral: true})
    } catch {}
    return
}