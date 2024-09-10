import { ErrorEmbed, InfoEmbed, SuccessEmbed, WarnEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { CommandOptions } from '../modules/types';
import { channels } from '..';
import { addReview } from '../modules/db';

export const data = new SlashCommandBuilder()
    .setName('add-review')
    .setDescription('Give a review to any freelancer you like. Administrator Only!')
    .addUserOption(option => option.setName('freelancer').setDescription('The freelancer review').setRequired(true))
    .addStringOption(option => option.setName('stars').setDescription('The amount of stars to give').setRequired(true).addChoices({name: '5 Stars', value: '5'}, {name: '4 Stars', value: '4'}, {name: '3 Stars', value: '3'}, {name: '2 Stars', value: '2'}, {name: '1 Star', value: '1'}))
    .addStringOption(option => option.setName('reviewerid').setDescription('The reviewer ID').setRequired(true))
    .addStringOption(option => option.setName('reviewertag').setDescription('The reviewer Tag').setRequired(true))
    .addStringOption(option => option.setName('review').setDescription('The review to give the freelancer').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'admin'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const freelancer = (interaction as ChatInputCommandInteraction).options.getUser('freelancer', true)
    const review = (interaction as ChatInputCommandInteraction).options.getString('review', true)
    const reviewerId = (interaction as ChatInputCommandInteraction).options.getString('reviewerid', true)
    const reviewerTag = (interaction as ChatInputCommandInteraction).options.getString('reviewertag', true)
    let stars = 0
    switch ((interaction as ChatInputCommandInteraction).options.getString('stars', true)) {
        case '1':
            stars = 1   
            break
        case '2':
            stars = 2
            break
        case '3':
            stars = 3
            break
        case '4':
            stars = 4
            break
        case '5':
            stars = 5
            break
    }
    const member = await interaction.guild?.members.fetch(freelancer)
    if(member) {
        addReview(freelancer.id, {userId: reviewerId, userTag: reviewerTag, review: review, stars: stars})
    }
    interaction.editReply({content: `Thank you. The review has been added to the freelancer.`})
    return
}