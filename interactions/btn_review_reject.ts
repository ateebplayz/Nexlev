import { ButtonInteraction } from "discord.js"

export const data = {
    customId: 'btn_review_reject',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    interaction.reply({content: `Successfully rejected review.`, ephemeral: true})
    if(interaction.message.deletable) interaction.message.delete()
    return
}