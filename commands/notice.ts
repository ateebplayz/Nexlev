import { InfoEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ChatInputCommandInteraction, CommandInteraction, TextChannel } from 'discord.js';
import { CommandOptions } from '../modules/types';
import { channels } from '..';

export const data = new SlashCommandBuilder()
    .setName('notice')
    .setDescription('Send a user a message. Administrator Only!')
    .addUserOption(option => option.setName('user').setDescription('The User that should be DMed').setRequired(true))
    .addStringOption(option => option.setName('message').setDescription('The user you wish to message').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'admin'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})

    const user = (interaction as ChatInputCommandInteraction).options.getUser('user')
    const msg = (interaction as ChatInputCommandInteraction).options.getString('message')

    try {
        const logEmbed = new InfoEmbed('New Sent Message', `**Author** : <@!${interaction.user.id}>\n**User** : <@!${user?.id}>\n**Message** : ${msg}`)
        const embed = new InfoEmbed('Notice from the Administration.', `**Notice** : ${msg}` || 'An error occured. Our moderation team tried to contact you')
        if(user) user.send({embeds: [embed]})
        interaction.editReply({content: 'Message has been successfully sent to <@!' + user?.id + '>'});
        (channels.logMessage as TextChannel).send({embeds: [logEmbed]})
    } catch {console.log}
    return
}