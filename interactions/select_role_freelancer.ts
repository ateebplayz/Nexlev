import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuInteraction } from "discord.js"
import { client } from ".."
import { addSkill } from "../modules/db"

export const data = {
    customId: 'select_role_freelancer',
    type: 'component'
}
export async function execute(interaction: StringSelectMenuInteraction) {
    let skills: Array<string> = []
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    const writingRole = await member.guild.roles.fetch('1239912045521145886')
    const voiceRole = await member.guild.roles.fetch('1240765855135174798')
    const videoRole = await member.guild.roles.fetch('1240766033506078891')
    const vfxRole = await member.guild.roles.fetch('1240766032130347158')
    const thumbnailRole = await member.guild.roles.fetch('1240765963272716390')
    interaction.values.forEach(async value => {
        if(value == 'writing') {
            if(writingRole)
            member.roles.add(writingRole)
            await addSkill(interaction.user.id, interaction.user.tag, 'Writing')
            skills.push('Writing')
        }
        
        if(value == 'voice') {
            if(voiceRole)
            member.roles.add(voiceRole)
            await addSkill(interaction.user.id, interaction.user.tag, 'Voice')
            skills.push('Voice')
        }
        
        if(value == 'video') {
            if(videoRole)
            member.roles.add(videoRole)
            await addSkill(interaction.user.id, interaction.user.tag, 'Video')
            skills.push('Video')
        }
        
        if(value == 'vfx') {
            if(vfxRole)
            member.roles.add(vfxRole)
            await addSkill(interaction.user.id, interaction.user.tag, 'VFX/GFX')
            skills.push('VFX/GFX')
        }
        
        if(value == 'thumbnail') {
            if(thumbnailRole)
            member.roles.add(thumbnailRole)
            await addSkill(interaction.user.id, interaction.user.tag, 'Thumbnail')
            skills.push('Thumbnail')
        }
    })
    const button = new ButtonBuilder().setCustomId('btn_role_freelancer_confirm').setLabel('Confirm').setStyle(ButtonStyle.Success)
    const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
    interaction.reply({content: `Welcome to the server. You've been awarded the skills. Confirm your freelancer role by clicking on the button below.`, components: [actionRow], ephemeral: true})
    return
}