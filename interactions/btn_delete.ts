import { ButtonInteraction } from "discord.js"

export const data = {
    customId: 'btn_delete',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    if(interaction.channel?.isDMBased) {
        interaction.channel
        interaction.guild?.members.fetch(interaction.user)
    }
    if(interaction.message.deletable) interaction.message.delete()
    return
}