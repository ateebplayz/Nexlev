import { ButtonInteraction, ForumChannel, ThreadChannel } from "discord.js"
import { bumpPost, findJob } from "../modules/db"

export const data = {
    customId: 'btn_job_bump',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const jobId = await (await (interaction.channel as ThreadChannel).fetchStarterMessage())?.embeds[0].footer?.text.substring(19, 10) || 'a'
    const job = await findJob(jobId)
    if(interaction.user.id == job.userId) {
        if(Date.now() - job.bumpDate >= 8.64e+7) {// 1 day
            interaction.reply({content: `Your post has been bumped!`})
            interaction.channel?.send('Bump Message').then((msg)=>{
                msg.delete()
            })
            bumpPost(jobId)
        } else {
            return interaction.reply({content: `You may bump this post <t:${Number((Date.now()/1000) + (129600 - ((Date.now() - job.bumpDate)/1000))).toFixed(0)}:R>.`, ephemeral: true})
        }
    } else {
        return interaction.reply({content: 'You are not the owner of this post!', ephemeral: true})
    }
    return
}