import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuInteraction } from "discord.js"
import { client } from ".."
import { addSkill, getUser } from "../modules/db"

export const data = {
    customId: 'select_role_freelancer',
    type: 'component'
}
export async function execute(interaction: StringSelectMenuInteraction) {
    let skills: Array<string> = []
    const user = await getUser(interaction.user.id)
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    const writingRole = await member.guild.roles.fetch('1239912045521145886')
    const voiceRole = await member.guild.roles.fetch('1240765855135174798')
    const videoRole = await member.guild.roles.fetch('1240766033506078891')
    const vfxRole = await member.guild.roles.fetch('1240766032130347158')
    const thumbnailRole = await member.guild.roles.fetch('1240765963272716390')
    interaction.values.map(async value => {
        if(value == 'writing') {
            if(writingRole)
            member.roles.add(writingRole)
            if(!user.skills.includes('Writing'))
            await addSkill(interaction.user.id, interaction.user.tag, 'Writing')
            skills.push('Writing')
        }
        
        if(value == 'voice') {
            if(voiceRole)
            member.roles.add(voiceRole)
            if(!user.skills.includes('Voice'))
            await addSkill(interaction.user.id, interaction.user.tag, 'Voice')
            skills.push('Voice')
        }
        
        if(value == 'video') {
            if(videoRole)
            member.roles.add(videoRole)
            if(!user.skills.includes('Video'))
            await addSkill(interaction.user.id, interaction.user.tag, 'Video')
            skills.push('Video')
        }
        
        if(value == 'vfx') {
            if(vfxRole)
            member.roles.add(vfxRole)
            if(!user.skills.includes('Assistant'))
            await addSkill(interaction.user.id, interaction.user.tag, 'Assistant')
            skills.push('Assistant')
        }
        
        if(value == 'thumbnail') {
            if(thumbnailRole)
            member.roles.add(thumbnailRole)
            if(!user.skills.includes('Thumbnail'))
            await addSkill(interaction.user.id, interaction.user.tag, 'Thumbnail')
            skills.push('Thumbnail')
        }
    })
    const button = new ButtonBuilder().setCustomId('btn_role_freelancer_confirm').setLabel('Confirm').setStyle(ButtonStyle.Success)
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
    interaction.reply({content: `The bot has given you the skills role. Please confirm this last step. Have you created your nexlev.io portfolio? If yes, click confirm. If not, go to Nexlev.io/freelancer, create a portfolio, and click on confirm. Thank you.`, components: [actionRow], ephemeral: true})
    return
}