import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js"
import { client } from ".."

export const data = {
    customId: 'btn_role_freelancer',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1237694103010152458')
        const role2 = await member.guild.roles.fetch('1237694138481119303')
        if(role && role2 && (member.roles.cache.has(role.id) || member.roles.cache.has(role2.id))) {
            return interaction.reply({content: `You can no longer change your main role. If you wish to switch your role, please open a support ticket`, ephemeral: true})
        }
        if(role) {
            const textDropdown = new StringSelectMenuBuilder().setCustomId('select_role_freelancer').setMaxValues(5).setMinValues(1).setPlaceholder('Select Skills').setOptions([
                new StringSelectMenuOptionBuilder().setDescription('Select the Writing Skill').setEmoji('✍️').setLabel('Writing').setValue('writing'),
                new StringSelectMenuOptionBuilder().setDescription('Select the Voice Acting Skill').setEmoji('🎤').setLabel('Voice Acting').setValue('voice'),
                new StringSelectMenuOptionBuilder().setDescription('Select the Video Editor Skill').setEmoji('📷').setLabel('Video Editor').setValue('video'),
                new StringSelectMenuOptionBuilder().setDescription('Select the VFX/GFX Skill').setEmoji('✨').setLabel('VFX/GFX').setValue('vfx'),
                new StringSelectMenuOptionBuilder().setDescription('Select the Thumbnail Artist Skill').setEmoji('🎨').setLabel('Thumbnail Artist').setValue('thumbnail')
            ])
            const actionRow = new ActionRowBuilder<StringSelectMenuBuilder>().setComponents(textDropdown)
            interaction.reply({embeds: [
                {
                "description": `<:flecha113:1239895323594457149> Please select your skills from below`,
                "color": 1617663
                }
            ], components: [actionRow], ephemeral: true})
        }
    } catch {}
    return
}