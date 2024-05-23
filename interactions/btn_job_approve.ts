import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, ForumChannel } from "discord.js"
import { approveJob, createJobVerified, rejectJob, updateMessage } from "../modules/db"
import { channels } from ".."
import { getAdEmbed, getJobEmbed } from "../modules/helpers"

export const data = {
    customId: 'btn_job_approve',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const job = await approveJob(interaction.message.embeds[0].footer?.text.substring(19, 10) || 'a')
    if(interaction.message.deletable) interaction.message.delete()
    const okayButton = new ButtonBuilder().setCustomId('btn_delete').setLabel('Okay').setStyle(ButtonStyle.Primary)
    const embedDm = new EmbedBuilder().setTitle('<:tic_Verde:1243153227931848705>   Post Approved').setDescription(`<:flecha113:1239895323594457149> Hey, your for-hire post **${job.title}** has been approved by our moderation team.`).setFooter({text: 'POST ID : ' + job.id, iconURL: 'https://i.imgur.com/rCcyC7o.png'}).setColor(0x18aeff)
    const member = await interaction.guild?.members.fetch(job.userId)
    try {
        if(member) {
            member.send({embeds: [embedDm], components: [new ActionRowBuilder<ButtonBuilder>().addComponents(okayButton)]}).then((msg)=>{
                setTimeout(()=> msg.delete(), 8.64e+7)
            })
        }
    } catch {}
    const applyButton = new ButtonBuilder().setCustomId('btn_job_apply_hire').setLabel('Hire').setStyle(ButtonStyle.Success).setEmoji('📝')
    const reportButton = new ButtonBuilder().setCustomId('btn_job_report_paid').setLabel('Report').setStyle(ButtonStyle.Danger).setEmoji('🚨')
    const bumpButton = new ButtonBuilder().setCustomId('btn_job_bump').setLabel('Bump').setStyle(ButtonStyle.Primary).setEmoji('🚀')
    const messageActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(bumpButton)
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(applyButton, reportButton)
    const embed = getAdEmbed(job.title, job.description, job.budget, job.deadline, member?.avatarURL() || null, job.id)
    switch(job.skill) {
        case 'Writing':
            let msg = await (channels.hireWriting as ForumChannel).threads.create({name: job.title, message: {embeds: [embed], components: [actionRow]}})
            updateMessage(job.id, msg.id, msg.url)
            msg.send({components: [messageActionRow], content: `👉  Bump your post by clicking on the 'Bump' button, it will boost your post's visibility.`})
            break
        case 'Thumbnail':
            let ping2 = `**Job Notification:** <@&1240765963272716390>`
            let msg2 = await (channels.hireThumbnail as ForumChannel).threads.create({name: job.title, message: {embeds: [embed], components: [actionRow]}})
            updateMessage(job.id, msg2.id, msg2.url)
            msg2.send({components: [messageActionRow], content: `👉  Bump your post by clicking on the 'Bump' button, it will boost your post's visibility.`})
            break
        case 'VFX':
            let ping3 = `**Job Notification:** <@&1240766032130347158>`
            let msg3 = await (channels.hireVfx as ForumChannel).threads.create({name: job.title, message: {embeds: [embed], components: [actionRow]}})
            updateMessage(job.id, msg3.id, msg3.url)
            msg3.send({components: [messageActionRow], content: `👉  Bump your post by clicking on the 'Bump' button, it will boost your post's visibility.`})
            break
        case 'Video':
            let ping4 = `**Job Notification:** <@&1240766033506078891>`
            let msg4 = await (channels.hireVideo as ForumChannel).threads.create({name: job.title, message: {embeds: [embed], components: [actionRow]}})
            updateMessage(job.id, msg4.id, msg4.url)
            msg4.send({components: [messageActionRow], content: `👉  Bump your post by clicking on the 'Bump' button, it will boost your post's visibility.`})
            break
        case 'Voice':
            let ping5 = `**Job Notification:** <@&1240765855135174798>`;
            let msg5 = await (channels.hireVoice as ForumChannel).threads.create({name: job.title, message: {embeds: [embed], components: [actionRow]}})
            updateMessage(job.id, msg5.id, msg5.url)
            msg5.send({components: [messageActionRow], content: `👉  Bump your post by clicking on the 'Bump' button, it will boost your post's visibility.`})
            break
    }
    return
}