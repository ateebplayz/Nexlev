import { ActionRowBuilder, ActionRowComponent, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, ForumChannel, GuildMember, Interaction, InteractionResponse, InteractionType, Message, MessageComponentType, MessageInteraction, ModalBuilder, ModalSubmitInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { ErrorEmbed, InfoEmbed } from "../modules/embeds"
import { generateRandomString, getJobEmbed } from "../modules/helpers"
import { channels } from ".."
import { Job } from "../modules/types"
import { createJob, createJobVerified, searchJob } from "../modules/db"

export const data = {
    customId: 'btn_job_paid',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    console.log('a')
    // Creating Text Input Fields
    const text_job_title = new TextInputBuilder().setCustomId('text_job_title').setLabel('Job Title').setMaxLength(50).setMinLength(3).setPlaceholder('What is this Job about?').setRequired(true).setStyle(TextInputStyle.Short)
    const text_job_desc = new TextInputBuilder().setCustomId('text_job_desc').setLabel('Job Description').setMaxLength(1000).setMinLength(3).setPlaceholder('Please share the Job details such as requirements, experience, or any skills needed.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const text_job_budget = new TextInputBuilder().setCustomId('text_job_budget').setLabel('Job Budget').setMaxLength(50).setMinLength(3).setPlaceholder('What is the budget for this Job?').setRequired(true).setStyle(TextInputStyle.Short)
    const text_job_deadline = new TextInputBuilder().setCustomId('text_job_deadline').setLabel('Job Deadline').setMaxLength(50).setMinLength(3).setPlaceholder('Enter a deadline for this Job. If you do not have any, type n/a').setStyle(TextInputStyle.Paragraph).setRequired(false)
    const text_job_ref = new TextInputBuilder().setCustomId('text_job_ref').setLabel('Job Reference').setMaxLength(1000).setMinLength(3).setPlaceholder('Please provide any reference examples for the job. You can use any URL as a reference.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const textInputs = [text_job_title, text_job_desc, text_job_budget, text_job_deadline, text_job_ref]
    const modal = new ModalBuilder().setCustomId('modal_job_paid_'+interaction.id).setTitle('Post a Paid Job')

    textInputs.forEach(textInput => {
        let actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
        modal.addComponents(actionRow)
    })
    await interaction.showModal(modal)
    let job_type: 'Writing' | 'Voice' | 'VFX' | 'Thumbnail' | 'Video' = 'Writing'
    if(interaction.customId.endsWith('vo')) job_type = 'Voice'
    if(interaction.customId.endsWith('vf')) job_type = 'VFX'
    if(interaction.customId.endsWith('th')) job_type = 'Thumbnail'
    if(interaction.customId.endsWith('vi')) job_type = 'Video'
    let msg: Message<boolean> | undefined
    let job_title = ""
    let job_desc = ""
    let job_budget = ""
    let job_deadline = ""
    let job_ref = ""
    const jobId = generateRandomString()
    let embed = getJobEmbed(job_title, job_desc, job_budget, job_ref, job_deadline, '', '', jobId)
    await interaction.awaitModalSubmit({time: 60000_00}).then(async (mI: ModalSubmitInteraction) => {
        await mI.deferReply({ephemeral: true})
        job_title = mI.fields.getTextInputValue('text_job_title')
        job_desc = mI.fields.getTextInputValue('text_job_desc')
        job_budget = mI.fields.getTextInputValue('text_job_budget')
        job_deadline = mI.fields.getTextInputValue('text_job_deadline') || "N/A"
        job_ref = mI.fields.getTextInputValue('text_job_ref')
        embed = getJobEmbed(job_title, job_desc, job_budget, job_ref, job_deadline, mI.user.tag, mI.user.avatarURL(), jobId)
        
        const confirmButton = new ButtonBuilder().setCustomId('btn_confirm_job_paid').setLabel('Confirm').setStyle(ButtonStyle.Success)
        const cancelButton = new ButtonBuilder().setCustomId('btn_cancel_job_paid').setLabel('Cancel').setStyle(ButtonStyle.Danger)
        const actionRowTemp = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton)
        msg = await mI.editReply({
            embeds: [
                embed
            ],
            components: [actionRowTemp]
        })
    }).catch(()=>{})
    try {
        msg?.awaitMessageComponent<ComponentType.Button>({time: 60000_00}).then(async (bI: ButtonInteraction) => {
            if(bI.customId == 'btn_cancel_job_paid') {
                return bI.reply({content: `You have cancelled your paid job request.`, ephemeral: true})
            }
            console.log('b')
            bI.reply({content: `Your job has been successfully posted`, ephemeral: true})
            try {
                const member = interaction.guild?.members.fetch(bI.user)
                member?.then((m: GuildMember)=>{
                    if(m){
                        m.send({embeds: [
                            {
                              "title": "<:flecha113:1239895323594457149> Few Instructions:",
                              "description": "<:Gap:1239281994245083217>\n- Freelancers will send proposals related to your job post in your DMs. You can review them and contact your preferred freelancer directly through DMs. The freelancer ID is provided in the proposal message. If you're not satisfied with the proposal or portfolio, you can simply click the reject button.\n\n- If you don't want to hire someone now or want to remove your job post, Write this command in the server any channel /post-delete (id) to remove it. Typically, every job post auto-closes after 4 days.",
                              "color": 0x1b9ee6
                            }
                          ]})
                    }
                })
            } catch {}
            const applyButton = new ButtonBuilder().setCustomId('btn_job_apply_paid').setLabel('Submit Proposal').setStyle(ButtonStyle.Success).setEmoji('💼')
            const reportButton = new ButtonBuilder().setCustomId('btn_job_report_paid').setLabel('Report').setStyle(ButtonStyle.Danger).setEmoji('🚨')
            const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(applyButton, reportButton)
            switch(job_type) {
                case 'Writing':
                    let ping = `**Job Notification:** <@&1239912045521145886>`
                    let msg = await (channels.paidWriting as ForumChannel).threads.create({name: job_title, message: {content: ping, embeds: [embed], components: [actionRow]}})
                    const job: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Paid",
                        userTag: bI.user.tag,
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
                    createJobVerified(job)
                    break
                case 'Thumbnail':
                    let ping2 = `**Job Notification:** <@&1240765963272716390>`
                    let msg2 = await (channels.paidThumbnail as ForumChannel).threads.create({name: job_title, message: {content: ping2, embeds: [embed], components: [actionRow]}})
                    const job2: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Paid",
                        userTag: bI.user.tag,
                        title: job_title,
                        description: job_desc,
                        budget: job_budget,
                        deadline: job_deadline,
                        reference: job_ref,
                        skill: job_type,
                        message: {
                            id: msg2.id,
                            url: msg2.url
                        },
                        proposals: [],
                        creationDate: Date.now()
                    }
                    createJobVerified(job2)
                    break
                case 'VFX':
                    let ping3 = `**Job Notification:** <@&1240766032130347158>`
                    let msg3 = await (channels.paidVfx as ForumChannel).threads.create({name: job_title, message: {content: ping3, embeds: [embed], components: [actionRow]}})
                    const job3: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Paid",
                        userTag: bI.user.tag,
                        title: job_title,
                        description: job_desc,
                        budget: job_budget,
                        deadline: job_deadline,
                        reference: job_ref,
                        skill: job_type,
                        message: {
                            id: msg3.id,
                            url: msg3.url
                        },
                        proposals: [],
                        creationDate: Date.now()
                    }
                    createJobVerified(job3)
                    break
                case 'Video':
                    let ping4 = `**Job Notification:** <@&1240766033506078891>`
                    let msg4 = await (channels.paidVideo as ForumChannel).threads.create({name: job_title, message: {content: ping4, embeds: [embed], components: [actionRow]}})
                    const job4: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Paid",
                        userTag: bI.user.tag,
                        title: job_title,
                        description: job_desc,
                        budget: job_budget,
                        deadline: job_deadline,
                        reference: job_ref,
                        skill: job_type,
                        message: {
                            id: msg4.id,
                            url: msg4.url
                        },
                        proposals: [],
                        creationDate: Date.now()
                    }
                    createJobVerified(job4)
                    break
                case 'Voice':
                    let ping5 = `**Job Notification:** <@&1240765855135174798>`
                    let msg5 = await (channels.paidVoice as ForumChannel).threads.create({name: job_title, message: {content: ping5, embeds: [embed], components: [actionRow]}})
                    const job5: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Paid",
                        userTag: bI.user.tag,
                        title: job_title,
                        description: job_desc,
                        budget: job_budget,
                        deadline: job_deadline,
                        reference: job_ref,
                        skill: job_type,
                        message: {
                            id: msg5.id,
                            url: msg5.url
                        },
                        proposals: [],
                        creationDate: Date.now()
                    }
                    createJobVerified(job5)
                    break
            }
        }).catch(()=>{
            if(msg !== undefined)
            msg.edit({content: 'Your time for this interaction has ended. Please try again.', components: [], embeds: []})
        })

    } catch {}
    return
}