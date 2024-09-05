import { ButtonInteraction, TextChannel } from "discord.js"
import { addReview, deleteReview } from "../modules/db"
import { InfoEmbed } from "../modules/embeds"
import { channels } from ".."

export const data = {
    customId: 'btn_review_approve',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    const reviewerId = interaction.message.embeds[0].fields[0].value
    const reviewerTag = interaction.message.embeds[0].fields[1].value
    const reviewerReview = interaction.message.embeds[0].fields[3].value
    const reviewerStars = interaction.message.embeds[0].fields[2].value
    const freelancerId = interaction.message.embeds[0].fields[4].value
    const message = new InfoEmbed('Review Approved', `The review from <@!${reviewerId}> was approved`).addFields(
        {
            name: 'Reviewer Tag',
            value: reviewerTag,
            inline: true
        },
        {
            name: 'Reviewer Stars',
            value: reviewerStars,
            inline: true
        },
        {
            name: 'Freelancer ID',
            value: freelancerId,
            inline: true
        },
        {
            name: 'Review',
            value: reviewerReview,
            inline: true
        },
    )
    try {
        (channels.logReview as TextChannel).send({embeds: [message]})
    } catch (err) {
        console.log(err)
    }
    addReview(freelancerId, {userId: reviewerId, userTag: reviewerTag, review: reviewerReview, stars: Number(reviewerStars)})
    interaction.reply({content: `Successfully accepted review.`, ephemeral: true})
    deleteReview(interaction.message.embeds[0].footer?.text || '')
    if(interaction.message.deletable) interaction.message.delete()
    return
}