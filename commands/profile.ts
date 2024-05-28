import { InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { APIEmbed, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { CommandOptions } from '../modules/types';
import { existsUser, getUser } from '../modules/db';
import { botColor } from '../modules/data';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Check the freelancer profile of a user!')
    .addUserOption(option => option.setDescription('The user to check the profile of').setName('freelancer').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const user = (interaction as ChatInputCommandInteraction).options.getUser('freelancer', true)
    if(user) {
        const exists = await existsUser(user.id)

        if(exists) {
            const userDb = await getUser(user.id)
            let TotalStars = 0
            let positive = 0
            let negative = 0
            userDb.reviews.forEach(review=> {
                TotalStars += review.stars
                if(review.stars >= 3) positive += 1
                else negative += 1
            }) 
            const mention = `<@!${user.id}>`
            const id = user.id
            const totalScore = TotalStars * 10
            const freelancerLevel = userDb.reviews.length >= 30 ? 3 : userDb.reviews.length >= 10 && userDb.reviews.length < 30 ? 2 : userDb.reviews.length >= 5 && userDb.reviews.length < 10 ? 1 : 0 
            let reviews = ``
            let lastIndex = userDb.reviews.length - 1
            while (lastIndex >= userDb.reviews.length - 5 && lastIndex >= 0) {
                console.log(lastIndex)
                reviews += "``Review By " + userDb.reviews[lastIndex].userTag +":`` " + userDb.reviews[lastIndex].review + "\n\n"
                lastIndex -= 1
            }
            if(reviews == ``) reviews = `This user has 0 reviews`
            console.log(reviews)
            const embed: APIEmbed = 
                  {
                    description: "# Freelancer Profile: # \n<:Gap:1239281994245083217>\n<:line_arrow_white1:1239912525143871518>**Discord Mention:** " + mention + "\n<:line_arrow_white1:1239912525143871518>**ID:** " + id + "\n\n<:star:1242775692924682302>  ** Score Rating:** " + totalScore +"\n📊  ** Freelancer Level:** " + freelancerLevel +"\n \n\n<:thumbsup:1242772270930202634> **Positive Reviews:** " + positive + "\n<:thumbsdown:1242772273153179659> **Negative Reviews:** " + negative +"\n\n<:equal:1242777835555258431> **Overall reviews:** "+ userDb.reviews.length +"\n\n<:line_arrow_white1:1239912525143871518> ** User Skills:** "+ userDb.skills.join(', ') +"\n\n<:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894><:imageedit_1_4010449231:1242772233349365894>\n## Freelancer Last 5 Reviews: ##\n\n" + reviews,
                    color: botColor,
                    thumbnail: {
                        url: user.avatarURL() || ''
                    }
              }
              return interaction.editReply({embeds: [embed]})
        } else return interaction.editReply({content: `The freelancer you searched for isn't registered.`})
    }
}