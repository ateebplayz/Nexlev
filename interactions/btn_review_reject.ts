import { ActionRowBuilder, ButtonInteraction, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { ErrorEmbed, InfoEmbed } from "../modules/embeds"
import { channels } from ".."

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
        const reviewerId = interaction.message.embeds[0].fields[0].value
        const reviewerTag = interaction.message.embeds[0].fields[1].value
        const reviewerReview = interaction.message.embeds[0].fields[3].value
        const reviewerStars = interaction.message.embeds[0].fields[2].value
        const freelancerId = interaction.message.embeds[0].fields[4].value
        const message = new InfoEmbed('Review Rejected', `The review from <@!${reviewerId}> was rejected`).addFields(
            {
                name: 'Reviewer Tag',
                value: reviewerTag,
                inline: true
            },
            {
                name: 'Reviewer Stars',
                value: reviewerStars,
                inline: true
            },
            {
                name: 'Freelancer ID',
                value: freelancerId,
                inline: true
            },
            {
                name: 'Review',
                value: reviewerReview,
                inline: false
            },
            {
                name: 'Reason',
                value: mI.fields.getTextInputValue('text_reject_reason'),
                inline: false
            },
        )
        try {
            (channels.logReview as TextChannel).send({embeds: [message]})
        } catch (err) {
            console.log(err)
        }
        mI.reply({content: `Successfully rejected review.`, ephemeral: true})
        interaction.message.delete()
    })
    return
}