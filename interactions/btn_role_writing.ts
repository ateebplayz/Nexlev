import { ButtonInteraction } from "discord.js"
import { client } from ".."
import { addSkill, removeSkill } from "../modules/db"

export const data = {
    customId: 'btn_role_writing',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const member = await (await client.guilds.fetch(interaction.guild?.id || '')).members.fetch(interaction.user.id)
    try {
        const role = await member.guild.roles.fetch('1239912045521145886')
        if(role) {
            if(member.roles.cache.has(role.id)) {
                member.roles.remove(role)
                interaction.reply({content: 'Your role has been removed.', ephemeral: true})
                await removeSkill(interaction.user.id, interaction.user.tag, 'Writing')
            } else {
                member.roles.add(role)
                interaction.reply({content: 'You have been given the Writing role.', ephemeral: true})
                await addSkill(interaction.user.id, interaction.user.tag, 'Writing')
            }
        }
    } catch {}
    return
}