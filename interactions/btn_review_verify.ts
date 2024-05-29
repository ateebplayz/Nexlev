import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, DMChannel, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
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
    let cp = ''
    let pp = ''
    const filter = (i: ModalSubmitInteraction) => i.customId === ('modal_verify_review_'+interaction.id)
    await interaction.awaitModalSubmit({filter: filter, time: 600000}).then(async (mI) => {
        await mI.deferReply({ephemeral: true})

        const reviewerId = interaction.message.embeds[0].fields[0].value
        const reviewerTag = interaction.message.embeds[0].fields[1].value
        const reviewerStars = Number(interaction.message.embeds[0].fields[2].value)
        const reviewerReview = interaction.message.embeds[0].fields[3].value

        const scope = mI.fields.getTextInputValue('text_review_scope')
        pp = mI.fields.getTextInputValue('text_review_pp')
        cp = mI.fields.getTextInputValue('text_review_cp')

        if(!pp.startsWith('http') || !cp.startsWith('http')) {
            return mI.editReply({content: `Both Contract or Agreement and Payment Proof must be a link/URL address.`})
        }
        const embed = new InfoEmbed(`<:flecha113:1239895323594457149> New Review Submission`, `Below are the review details`).addFields(
            {name: '<:flecha113:1239895323594457149> Reviewer ID', value: reviewerId, inline: true},
            {name: '<:flecha113:1239895323594457149> Reviewer Tag', value: reviewerTag, inline: true},
            {name: '<:flecha113:1239895323594457149> Reviewer Stars', value: `${reviewerStars}`, inline: true},
            {name: '<:flecha113:1239895323594457149> Reviewer Review', value: reviewerReview, inline: false},
            {name: '<:flecha113:1239895323594457149> Freelancer ID', value: mI.user.id, inline: true},
            {name: '<:flecha113:1239895323594457149> Freelancer Tag', value: mI.user.tag, inline: true},
            {name: '<:flecha113:1239895323594457149> Freelancer Scope', value: scope, inline: true},
            {name: '<:flecha113:1239895323594457149> Freelancer Payment Proof', value: pp, inline: true},
            {name: '<:flecha113:1239895323594457149> Freelancer Contract/Agreement', value: cp, inline: true},
        )
        const buttonApprove = new ButtonBuilder().setCustomId('btn_review_approve').setLabel('Approve').setStyle(ButtonStyle.Success)
        const buttonReject = new ButtonBuilder().setCustomId('btn_review_reject').setLabel('Reject').setStyle(ButtonStyle.Danger)
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonApprove, buttonReject)
        mI.editReply({content: `Thank you, the review will be reviewed by our moderation team and added to your profile.`});
        (channels.reviewVerif as TextChannel).send({embeds: [embed], components: [actionRow]})
    }).catch()
    if(pp.startsWith('http') && cp.startsWith('http')) {
        if (interaction.channel && interaction.channel.isDMBased()) {
            interaction.message.delete().catch(console.error);
        } else {
            // Handle the case where the interaction channel is not cached or not a text channel
            try {
                const fetchedMessage = await (interaction.channel as unknown as DMChannel).messages.fetch(interaction.message.id);
                if (fetchedMessage) {
                    fetchedMessage.delete().catch(console.error);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
            }
        }
    }
    return
}