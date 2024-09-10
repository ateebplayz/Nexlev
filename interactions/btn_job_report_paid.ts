import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { findJob, findJobByTag } from "../modules/db"
import { channels, client } from ".."
import { getJobEmbed } from "../modules/helpers"
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'btn_job_report_paid',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const tag = interaction.message.embeds[0].footer?.text.substring(19, 10) || 'a'
    const job = await findJob(tag)
    const text_job_reason = new TextInputBuilder().setCustomId('text_job_reason').setLabel('Reason').setStyle(TextInputStyle.Paragraph).setPlaceholder('Kindly provide the reason for reporting this post.').setRequired(true).setMaxLength(1000)
    const inputs = [text_job_reason]
    const modal = new ModalBuilder().setTitle('Report this Post').setCustomId('modal_job_report_paid_'+interaction.id)
    inputs.forEach((input)=>{
        let actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input)
        modal.addComponents(actionRow)
    })
    await interaction.showModal(modal)
    const star_wars = (i: ModalSubmitInteraction) => i.customId == `modal_job_report_paid_${interaction.id}`
    await interaction.awaitModalSubmit({filter: star_wars, time: 6000_00}).then((mi)=>{
        const text_job_Reason_input = mi.fields.getTextInputValue('text_job_reason')
        mi.reply({content: `The post has been reported, and our moderation team will investigate the post, thank you.`, ephemeral: true})
        const delete_button = new ButtonBuilder().setCustomId('btn_report_delete').setLabel('Clear Report').setStyle(ButtonStyle.Danger)
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(delete_button)
        const embedUser = new ErrorEmbed(`New Report!`, `**Usertag of user who reported** : ${mi.user.tag}\n**User ID of the user who reported** : ${mi.user.id}\n\n**Usertag of the owner of post** : ${job.userTag}\n**User ID of the owner of post** : ${job.userId}\n**Post Link** : ${job.message.url}`).addFields({name: 'Reason', value: text_job_Reason_input})
        const embed = getJobEmbed(job.title, job.description, job.budget, job.reference, job.deadline, job.userTag, mi.user.avatarURL(), job.id);

        (channels.reportLog as TextChannel).send({embeds: [embedUser, embed], components: [actionRow]})
    })
    return
}