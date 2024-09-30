import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ComponentType, Message, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { addUser, createJob, existsUser, findJobs, searchJob } from "../modules/db"
import { generateRandomString, getAdEmbed, getAdEmbedCat, getJobEmbed } from "../modules/helpers"
import { Job, User } from "../modules/types"
import { channels } from ".."

export const data = {
    customId: 'btn_job_hire',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    // Creating Text Input Fields
    const text_gig_title = new TextInputBuilder().setCustomId('text_gig_title').setLabel('For-Hire Title').setMaxLength(50).setMinLength(3).setPlaceholder('What service or skills are you offering?').setRequired(true).setStyle(TextInputStyle.Short)
    const text_gig_desc = new TextInputBuilder().setCustomId('text_gig_desc').setLabel('For-Hire Description').setMaxLength(2000).setMinLength(3).setPlaceholder('Please share details about the service you are offering. Tell us about your skills, experience, etc.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const text_gig_budget = new TextInputBuilder().setCustomId('text_gig_budget').setLabel('Your Portfolio Link').setMaxLength(500).setMinLength(3).setPlaceholder('Share your Nexlev portfolio link or your custom site portfolio.').setRequired(true).setStyle(TextInputStyle.Paragraph)
    const text_gig_deadline = new TextInputBuilder().setCustomId('text_gig_deadline').setLabel('Payment Method').setMaxLength(50).setMinLength(3).setPlaceholder('What’s your preferred payment method?').setStyle(TextInputStyle.Short)
    const textInputs = [text_gig_title, text_gig_desc, text_gig_budget, text_gig_deadline]
    const modal = new ModalBuilder().setCustomId('modal_gig_hire_'+interaction.id).setTitle('Post a For Hire Ad')

    textInputs.forEach(textInput => {
        let actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(textInput)
        modal.addComponents(actionRow)
    })

    await interaction.showModal(modal)
    const filter = (i: ModalSubmitInteraction) => i.customId === ('modal_gig_hire_'+interaction.id)
    const jobId = generateRandomString()
    let job_title = ""
    let job_desc = ""
    let job_portfolio = ""
    let job_method = ""
    let msg: Message<boolean> | undefined
    let job_type: 'Writing' | 'Voice' | 'VFX' | 'Thumbnail' | 'Video' = 'Writing'
    if(interaction.customId.endsWith('vo')) job_type = 'Voice'
    if(interaction.customId.endsWith('vf')) job_type = 'VFX'
    if(interaction.customId.endsWith('th')) job_type = 'Thumbnail'
    if(interaction.customId.endsWith('vi')) job_type = 'Video'
    await interaction.awaitModalSubmit({filter: filter, time: 6000_00}).then(async (mI: ModalSubmitInteraction) => {
        await mI.deferReply({ephemeral: true})
        const user: User = {
            userId: interaction.user.id,
            userTag: interaction.user.tag,
            skills: [],
            reviews: []
        }
        let existance = await existsUser(interaction.user.id)
        console.log(existance)
        if(!existance) addUser(user)
        const userJobs =await  findJobs(mI.user.id)
        let found = false
        userJobs.forEach((job)=>{
            if(job.skill == job_type) found = true
        })
        if(found) {
            return mI.editReply({embeds: [
                {
                  "description": "<:flecha113:1239895323594457149> Hey, you have already posted a for-hire ad. You cannot post the same ad more than once. If you want to edit or repost your for-hire ad, you can delete the existing one by using the command /post delete. This command will delete your current ad, allowing you to repost it again if you wish.\n\n<:line_arrow_white1:1239912525143871518> Or, if you want to increase your for-hire ad visibility, you can bump your post. The bump option is below your post.",
                  "color": 0x1b9ee6
                }
              ]})
        }
        job_title = mI.fields.getTextInputValue('text_gig_title')
        job_desc = mI.fields.getTextInputValue('text_gig_desc')
        job_portfolio = mI.fields.getTextInputValue('text_gig_budget')
        job_method = mI.fields.getTextInputValue('text_gig_deadline')
        if(!job_portfolio.startsWith('http')) {
            return mI.editReply({content: `You must have your portfolio link starting with "http" or "https." For a free portfolio, create now on nexlev.io/freelancer.`})
        }
        const confirmButton = new ButtonBuilder().setCustomId('btn_confirm_job_paid').setLabel('Confirm').setStyle(ButtonStyle.Success)
        const cancelButton = new ButtonBuilder().setCustomId('btn_cancel_job_paid').setLabel('Cancel').setStyle(ButtonStyle.Danger)
        const actionRowTemp = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmButton, cancelButton)
        const embed = getAdEmbed(job_title, job_desc, job_portfolio, job_method, mI.user.avatarURL(), jobId)
        msg = await mI.editReply({
            content: `Below is what your ad will look like.`,
            embeds: [
                embed
            ], 
            components: [actionRowTemp]
        })  
    }).catch()
    try {
        msg?.awaitMessageComponent<ComponentType.Button>({time: 60000_00}).then(async (bI: ButtonInteraction) => {
            try {   
                if(bI.customId == 'btn_cancel_job_paid') {
                    return bI.reply({content: `You have canceled your for-hire post request.`, ephemeral: true})
                }
                bI.reply({content: `Your post has been sent in for approval. You will be notified when your for-hire ad is listed.`, ephemeral: true})
                const buttonApprove = new ButtonBuilder().setCustomId('btn_job_approve').setLabel('Approve').setStyle(ButtonStyle.Success)
                const buttonReject = new ButtonBuilder().setCustomId('btn_job_reject').setLabel('Reject').setStyle(ButtonStyle.Danger)
                const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttonApprove, buttonReject)
                  const msg = await (channels.dashboard as TextChannel).send({content: "<@&1264900210996412577>", embeds: [getAdEmbedCat(job_title, job_desc, job_portfolio, job_method, bI.user.avatarURL(), jobId, job_type)], components: [actionRow]})          
                    const job: Job = {
                        id: jobId,
                        userId: bI.user.id,
                        jobType: "Hire",
                        userTag: bI.user.tag,
                        title: job_title,
                        description: job_desc,
                        budget: job_portfolio,
                        deadline: job_method,
                        reference: 'N/A',
                        skill: job_type,
                        message: {
                            id: msg.id,
                            url: msg.url
                        },
                        proposals: [],
                        creationDate: Date.now(),
                        bumpDate: Date.now(),
                    }
                    createJob(job)
                } catch {}
        })
    } catch {}
    return
}