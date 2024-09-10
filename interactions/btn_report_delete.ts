import { ButtonInteraction, TextChannel } from "discord.js"
import { channels } from ".."

export const data = {
    customId: 'btn_report_delete',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    if(interaction.channel?.isDMBased) {
        interaction.channel
        interaction.guild?.members.fetch(interaction.user)
    }
    (channels.reportCLog as TextChannel).send({embeds: interaction.message.embeds})
    if(interaction.message.deletable) interaction.message.delete()
    return
}