import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { InfoEmbed } from "../modules/embeds"
import { channels } from ".."

export const data = {
    customId: 'btn_review_verify',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const text_review_scope = new TextInputBuilder().setCustomId('text_review_scope').setLabel('Scope of Work').setMaxLength(150).setMinLength(10).setPlaceholder('Please give us a brief 2 lines, of the deal btw the client and you.').setRequired(true).setStyle(TextInputStyle.Paragraph)

    const text_review_pp = new TextInputBuilder().setCustomId('text_review_pp').setLabel('Payment Proof').setMaxLength(150).setMinLength(5).setPlaceholder('Please attach the payment receipt or payment screenshot link.').setRequired(true).setStyle(TextInputStyle.Paragraph)

    const text_review_cp = new TextInputBuilder().setCustomId('text_review_cp').setLabel('Contract or Agreement').setMaxLength(150).setMinLength(10).setPlaceholder("Attach a screenshot link of the deal or contract where you agreed to the service and payment.").setRequired(true).setStyle(TextInputStyle.Paragraph)

    const textInputs = [text_review_scope, text_review_pp, text_review_cp]

    const modal = new ModalBuilder().setCustomId(`modal_verify_review_${interaction.id}`).setTitle('Review Verification')

    textInputs.forEach(tI => {
        let textInputRow = new ActionRowBuilder<TextInputBuilder>().addComponents(tI)
        modal.addComponents(textInputRow)
    })

    await interaction.showModal(modal)
    const filter = (i: ModalSubmitInteraction) => i.customId === ('modal_verify_review_'+interaction.id)
    await interaction.awaitModalSubmit({filter: filter, time: 6000_00}).then(async (mI) => {
        await mI.deferReply({ephemeral: true})

        const reviewerId = interaction.message.embeds[0].fields[0].value
        const reviewerTag = interaction.message.embeds[0].fields[1].value
        const reviewerStars = Number(interaction.message.embeds[0].fields[2].value)
        const reviewerReview = interaction.message.embeds[0].fields[3].value

        const scope = mI.fields.getTextInputValue('text_review_scope')
        const pp = mI.fields.getTextInputValue('text_review_pp')
        const cp = mI.fields.getTextInputValue('text_review_cp')

        if(!pp.startsWith('http') || !cp.startsWith('http')) {
            return mI.editReply({content: `Both Contract or Agreement and Payment Proof must be a link/URL address.`})
        }
        const embed = new InfoEmbed(`New Review Submission`, `Below are the review details`).addFields(
            {name: 'Reviewer ID', value: reviewerId, inline: true},
            {name: 'Reviewer Tag', value: reviewerTag, inline: true},
            {name: 'Reviewer Stars', value: `${reviewerStars}`, inline: true},
            {name: 'Reviewer Review', value: reviewerReview, inline: false},
            {name: 'Freelancer ID', value: mI.user.id, inline: true},
            {name: 'Freelancer Tag', value: mI.user.tag, inline: true},
            {name: 'Freelancer Scope', value: scope, inline: true},
            {name: 'Freelancer Payment Proof', value: pp, inline: true},
            {name: 'Freelancer Contract/Agreement', value: cp, inline: true},
        )
        const buttonApprove = new ButtonBuilder().setCustomId('btn_review_approve').setLabel('Approve').setStyle(ButtonStyle.Success)
        const buttonReject = new ButtonBuilder().setCustomId('btn_review_reject').setLabel('Reject').setStyle(ButtonStyle.Danger)
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonApprove, buttonReject)
        mI.editReply({content: `Thank you, the review will be reviewed by our moderation team and added to your profile.`});
        (channels.reviewVerif as TextChannel).send({embeds: [embed], components: [actionRow]})
    }).catch()
    return
}