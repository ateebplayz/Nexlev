import { ActionRowBuilder, ButtonInteraction, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { deleteReview, rejectJob } from "../modules/db"
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'btn_job_reject',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const text_input_reason = new TextInputBuilder().setCustomId('text_reject_reason').setLabel('Rejection Reason').setPlaceholder('Reason for rejecting this ad.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(text_input_reason)
    const modal = new ModalBuilder().setCustomId(`modal_rejection_${interaction.id}`).setTitle('Rejection').addComponents(actionRow)
    const filter = (i: ModalSubmitInteraction) => i.customId === `modal_rejection_${interaction.id}`
    await interaction.showModal(modal)
    await interaction.awaitModalSubmit({filter: filter, time: 60000_00}).then(async (mI: ModalSubmitInteraction) => {
        const reason = mI.fields.getTextInputValue('text_reject_reason')
        const job = await rejectJob(interaction.message.embeds[0].footer?.text.substring(19, 10) || 'a')
        mI.reply({content: `Post has been rejected.`, ephemeral: true})
        if (job) {
            const member = await interaction.guild?.members.fetch(job.userId)
            if(member) {
                try {
                    const embed = new ErrorEmbed('Post Rejected', `Your post **${job.title}** has been Rejected!`).addFields({name: "Administrator's Reason", value: reason})
                    member.send({embeds: [embed]})
                } catch (e) {
                    console.log(e)
                }
            }
        }
        deleteReview(interaction.message.embeds[0].footer?.text || '')
        if(interaction.message.deletable) interaction.message.delete()
    })
    return
}