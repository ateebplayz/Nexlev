import { APIEmbed, ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, GuildMember, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder, TextInputStyle } from "discord.js"
import { findJob, findJobByTag, getUser } from "../modules/db"
import { channels, client } from ".."
import { getJobEmbed } from "../modules/helpers"
import { ErrorEmbed } from "../modules/embeds"

export const data = {
    customId: 'btn_job_review_hire',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    await interaction.deferReply({ephemeral: true})
    const tag = interaction.message.embeds[0].footer?.text.substring(19, 10) || 'a'
    const job = await findJob(tag)
    const user = await getUser(job.userId)
    if(user) {
        let embeds: Array<APIEmbed> = []
        let lastIndex = user.reviews.length - 1
        while (lastIndex >= user.reviews.length - 5 && lastIndex >= 0) {
            let stars = ``
            for (let c=0; c < user.reviews[lastIndex].stars; c++) {
                stars += `⭐`
            }
            embeds.push({
                "title": "Review by " + user.reviews[lastIndex].userTag,
                "description": user.reviews[lastIndex].review + "\n\nRating: " + stars,
                "color": 0x1b9ee6
              })
            lastIndex -= 1
        }
        if(user.reviews[0] == null || user.reviews[0] == undefined) {
            interaction.editReply({embeds: [{
                "description": "<:flecha113:1239895323594457149> This freelancer has 0 reviews in his profile. To learn more about this user, run the command (/profile @user) in any channel.",
                "color": 0x1b9ee6
              }]})
        } else {
            embeds.push({
                "description": "<:flecha113:1239895323594457149> To view a freelancer's detailed profile, including rating scores, reviews, and more, run the following command: /profile [@Name] , An embedded view with all open for you.",
                "color": 0x1b9ee6
              })
            interaction.editReply({embeds: embeds})
        }
    }
    return
}