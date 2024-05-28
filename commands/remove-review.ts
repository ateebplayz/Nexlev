import { ErrorEmbed, InfoEmbed, SuccessEmbed, WarnEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { CommandOptions, Review } from '../modules/types';
import { channels } from '..';
import { addReview, getUser, updateReview } from '../modules/db';

export const data = new SlashCommandBuilder()
    .setName('remove-review')
    .setDescription('Remove a review from any freelancer you like. Administrator Only!')
    .addUserOption(option => option.setName('freelancer').setDescription('The freelancer review').setRequired(true))
    .addStringOption(option => option.setName('reviewer').setDescription('The reviewers ID').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'admin'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const freelancer = (interaction as ChatInputCommandInteraction).options.getUser('freelancer', true)
    const reviewerId = (interaction as ChatInputCommandInteraction).options.getString('reviewer', true)
    let user = await getUser(freelancer.id)
    let reviews: Array<Review> = []
    user.reviews.map(review => {
        if(review.userId !== reviewerId) reviews.push(review)
    })
    const member = await interaction.guild?.members.fetch(freelancer)
    if(member) {
        updateReview(freelancer.id, reviews)
    }
    interaction.editReply({content: `Thank you. The review has been removed from the freelancer.`})
    return
}