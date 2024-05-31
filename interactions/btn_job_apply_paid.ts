import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { addProposal, findJob, findJobByTag } from "../modules/db"
import { client } from ".."

export const data = {
    customId: 'btn_job_apply_paid',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const tag = interaction.message.embeds[0].footer?.text.substring(19, 10)|| 'a'
    const job = await findJob(tag)
    console.log(job, tag)
    if(interaction.user.id == job.userId) {
        return interaction.reply({content: `You cannot submit a proposal for your own job.`, ephemeral: true})
    }
    if(job.proposals.includes(interaction.user.id)) {
        return interaction.reply({content: `You've already applied to this post once.`, ephemeral: true})
    }
    console.log(job, tag)
    const text_job_portfolio = new TextInputBuilder().setCustomId('text_job_portfolio').setLabel('Portfolio').setStyle(TextInputStyle.Short).setPlaceholder('Please share your Nexlev portfolio link.').setRequired(true).setMaxLength(100)
    const text_job_text = new TextInputBuilder().setCustomId('text_job_text').setLabel('Submit Your Proposal to the Client').setStyle(TextInputStyle.Paragraph).setPlaceholder("Share why you're perfect for the job by providing specific details and information about your work.").setRequired(true).setMaxLength(1000)
    const inputs = [text_job_portfolio, text_job_text]
    const modal = new ModalBuilder().setTitle('Show Interest').setCustomId('modal_job_apply_paid_'+interaction.id)
    inputs.forEach((input)=>{
        let actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(input)
        modal.addComponents(actionRow)
    })
    await interaction.showModal(modal)
    const star_wars = (i: ModalSubmitInteraction) => i.customId == `modal_job_apply_paid_${interaction.id}`
    await interaction.awaitModalSubmit({filter: star_wars, time: 6000_00}).then(async (mi)=>{
        const text_job_portfolio_input = mi.fields.getTextInputValue('text_job_portfolio')
        if(!text_job_portfolio_input.startsWith('http')) {
            return mi.reply({content: `You must have your portfolio link starting with "http" or "https." For a free portfolio, create now on nexlev.io.`, ephemeral: true})
        }
        const text_job_text_input = mi.fields.getTextInputValue('text_job_text')
        const delete_button = new ButtonBuilder().setCustomId('btn_delete').setLabel('Reject This Proposal').setStyle(ButtonStyle.Danger)
        addProposal(mi.user.id, job.id)
        mi.reply({content: `Thank you for applying, your application has been sent to the client`, ephemeral: true})
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(delete_button)
        try {
            (await client.guilds.fetch('1236733198491324537')).members.fetch(job.userId).then((user: GuildMember)=>{
                user.send({embeds: [
                    {
                        "description": `**Freelancer ID:** (<@!${mi.user.id}>) - ${mi.user.id}\n\n**Applying For** : ${job.title}\n\n**Proposal:** ${text_job_text_input}\n\n**Portfolio Link:** ${text_job_portfolio_input}`,
                        "color": 0x1b9ee6,
                        "thumbnail": {
                            "url": mi.user.avatarURL() || ''
                        }
                    }
                  ], components: [actionRow]})
            })
        } catch {}
    }).catch((e)=>{})
    return
}