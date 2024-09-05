import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { addProposal, findJob, findJobByTag } from "../modules/db"
import { client } from ".."

export const data = {
    customId: 'btn_job_apply_hire',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const tag = interaction.message.embeds[0].footer?.text.substring(19, 10)|| 'a'
    const job = await findJob(tag)
    interaction.reply({content: `The for-hire ad has been posted by <@!${job.userId}> (${job.userTag}). To connect, please reach out directly to their DMs.`, ephemeral: true})
    return
}