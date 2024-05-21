import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { createJob, searchJob } from "../modules/db"
import { generateRandomString, getJobEmbed } from "../modules/helpers"
import { Job } from "../modules/types"
import { channels } from ".."

export const data = {
    customId: 'btn_job_hire',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    // Creating Text Input Fields
    const text_gig_title = new TextInputBuilder().setCustomId('text_gig_title').setLabel('Gig Title').setMaxLength(50).setMinLength(3).setPlaceholder('What is this Gig about?').setRequired(true).setStyle(TextInputStyle.Short)
    const text_gig_desc = new TextInputBuilder().setCustomId('text_gig_desc').setLabel('Gig Description').setMaxLength(2000).setMinLength(3).setPlaceholder('Please share the Gig details such as requirements, experience, or any skills needed.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const text_gig_budget = new TextInputBuilder().setCustomId('text_gig_budget').setLabel('Gig Budget').setMaxLength(50).setMinLength(3).setPlaceholder('What is the budget for this Gig?').setRequired(true).setStyle(TextInputStyle.Short)
    const text_gig_deadline = new TextInputBuilder().setCustomId('text_gig_deadline').setLabel('Gig Deadline').setMaxLength(50).setMinLength(3).setPlaceholder('Enter a deadline for this Gig. If you do not have any, type n/a').setStyle(TextInputStyle.Short)
    const text_gig_ref = new TextInputBuilder().setCustomId('text_gig_ref').setLabel('Gig Reference').setMaxLength(2000).setMinLength(3).setPlaceholder('Please provide any reference examples for the Gig. You can use any URL as a reference.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const textInputs = [text_gig_title, text_gig_desc, text_gig_budget, text_gig_deadline, text_gig_ref]
    const modal = new ModalBuilder().setCustomId('modal_gig_hire_'+interaction.id).setTitle('Post a Hire Gig')

    textInputs.forEach(textInput => {
        let actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
        modal.addComponents(actionRow)
    })

    await interaction.showModal(modal)
    /* const jobFind = await searchJob(interaction.user.id)
    if(jobFind !== 'None') {
        return interaction.reply({content: 'You already have a job posting or one of your jobs are under review. Please wait before reposting or close your previous job listing.', ephemeral: true})
    }
    */
    const filter = (i: ModalSubmitInteraction) => i.customId === `modal_gi_hire_${interaction.id}`
    await interaction.awaitModalSubmit({filter: filter, time: 6000_00}).then(async (mI: ModalSubmitInteraction) => {
        const buttonApprove = new ButtonBuilder().setCustomId('btn_job_approve').setLabel('Approve').setStyle(ButtonStyle.Success)
        const buttonReject = new ButtonBuilder().setCustomId('btn_job_reject').setLabel('Reject').setStyle(ButtonStyle.Danger)
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonApprove, buttonReject)
        const job_title = mI.fields.getTextInputValue('text_gig_title')
        const job_desc = mI.fields.getTextInputValue('text_gig_desc')
        const job_budget = mI.fields.getTextInputValue('text_gig_budget')
        const job_deadline = mI.fields.getTextInputValue('text_gig_deadline')
        const job_ref = mI.fields.getTextInputValue('text_gig_ref')
        const jobId = generateRandomString()
        const embed = getJobEmbed(job_title, job_desc, job_budget, job_ref, job_deadline, mI.user.tag, mI.user.avatarURL(), jobId)
        let job_type: 'Writing' | 'Voice' | 'VFX' | 'Thumbnail' | 'Video' = 'Writing'
        if(interaction.customId.endsWith('vo')) job_type = 'Voice'
        if(interaction.customId.endsWith('vf')) job_type = 'VFX'
        if(interaction.customId.endsWith('th')) job_type = 'Thumbnail'
        if(interaction.customId.endsWith('vi')) job_type = 'Video'
        mI.reply({
            content: `Below is what your ad will look like. It's been sent to our moderators for review. You'll be notified if its accepted.`,
            embeds: [
                embed
              ],
            ephemeral: true
        })
        try {
          const msg = await (channels.dashboard as TextChannel).send({embeds: [getJobEmbed(job_title, job_desc, job_budget, job_ref, job_deadline, mI.user.tag, mI.user.avatarURL() || '', jobId)], components: [actionRow]})          
            const job: Job = {
                id: jobId,
                userId: mI.user.id,
                jobType: "Hire",
                userTag: mI.user.tag,
                title: job_title,
                description: job_desc,
                budget: job_budget,
                deadline: job_deadline,
                reference: job_ref,
                skill: job_type,
                message: {
                    id: msg.id,
                    url: msg.url
                },
                proposals: [],
                creationDate: Date.now()
            }
            createJob(job)
        } catch {}
    })
    return
}