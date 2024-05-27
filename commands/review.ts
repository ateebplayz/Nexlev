import { ErrorEmbed, InfoEmbed, SuccessEmbed, WarnEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { CommandOptions } from '../modules/types';
import { channels } from '..';

export const data = new SlashCommandBuilder()
    .setName('review')
    .setDescription('Give a review to any freelancer you like.')
    .addUserOption(option => option.setName('freelancer').setDescription('The freelancer review').setRequired(true))
    .addStringOption(option => option.setName('stars').setDescription('The amount of stars to give').setRequired(true).addChoices({name: '5 Stars', value: '5'}, {name: '4 Stars', value: '4'}, {name: '3 Stars', value: '3'}, {name: '2 Stars', value: '2'}, {name: '1 Star', value: '1'}))
    .addStringOption(option => option.setName('review').setDescription('The review to give the freelancer').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const freelancer = (interaction as ChatInputCommandInteraction).options.getUser('freelancer', true)
    const review = (interaction as ChatInputCommandInteraction).options.getString('review', true)
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
    if(review.length < 50) {
        return interaction.editReply({content: `Your review must be atleast 50 characters long!`})
    }
    if(review.length > 1000) {
        return interaction.editReply({content: `Your review can not be greater than 1000 characters.`})
    }
    const member = await interaction.guild?.members.fetch(freelancer)
    if(member) {
        const button = new ButtonBuilder().setLabel('Verify').setStyle(ButtonStyle.Success).setCustomId('btn_review_verify')
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(button)
        const embed = new InfoEmbed(`New Review`, `<:1239895323594457149:1242753757356494878> Hey ${freelancer.username}, you've received a review from your client named ${interaction.user.username}. Please click the button below to verify your review. A form will pop up, please provide the details requested in the form. Thank you.\n\nYou have 24 hours to add proof or the review won't be added to your freelancing profile.`).addFields({name: 'Reviewer ID', value: interaction.user.id, inline: true}, {name: 'Reviewer Tag', value: interaction.user.tag, inline: true}, {name: 'Stars', value: `${stars}`, inline: true}, {name: 'Review', value: review})
        try {
            member.send({embeds: [embed], components: [actionRow]})
        } catch {}
    }
    interaction.editReply({content: `Thank you for your review. It has been submitted.`})
    return
}