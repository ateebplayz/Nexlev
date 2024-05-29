import { ActionRowBuilder, ButtonInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'btn_review_reject',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await interaction.guild?.members.fetch(interaction.message.embeds[0].fields[4].value || '')
    const modal = new ModalBuilder().setCustomId(`modal_something_${interaction.id}`).setTitle('Reject Review')
    const text_reject_reason = new TextInputBuilder().setCustomId('text_reject_reason').setLabel('Reason').setMaxLength(500).setMinLength(50).setPlaceholder('The reason for rejecting this review').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(text_reject_reason)
    modal.addComponents(actionRow)
    await interaction.showModal(modal)
    const filter = (i: ModalSubmitInteraction) => i.customId === `modal_something_${interaction.id}`
    await interaction.awaitModalSubmit({filter: filter, time: 600000}).then(async (mI) => {
        if(member) {
            member.send({
                embeds: [
                    new ErrorEmbed(`Review Rejected`, `Your review from ${interaction.message.embeds[0].fields[1].value} has been rejected.`).addFields({name: 'Reason', value: mI.fields.getTextInputValue('text_reject_reason')})
                ]
            })
        }
        mI.reply({content: `Successfully rejected review.`, ephemeral: true})
        interaction.message.delete()
    })
    return
}