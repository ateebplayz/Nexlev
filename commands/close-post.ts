import { ErrorEmbed, InfoEmbed, SuccessEmbed, WarnEmbed } from '../modules/embeds';
import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, ForumChannel, TextChannel, ThreadChannel } from 'discord.js';
import { CommandOptions } from '../modules/types';
import discord from 'discord.js'
import { deleteJob, findJob, searchJob } from '../modules/db';
import { channels } from '..';
import { getJobEmbed } from '../modules/helpers';

export const data = new SlashCommandBuilder()
    .setName('delete-post')
    .setDescription('Close your post.')
    .addStringOption(option => option.setName('id').setDescription('The ID of the post(found in the footer).').setRequired(true))
export const options: CommandOptions = {
    cooldown: 10000,
    permissionLevel: 'all'
}

export async function execute(interaction:CommandInteraction) {
    await interaction.deferReply({ephemeral: true})
    const postId = (interaction as ChatInputCommandInteraction).options.getString('id', true)
    const post = await searchJob(postId)
    if(post == 'Verified') {
        const postData = await findJob(postId)
        const member = await interaction.guild?.members.fetch(interaction.user)
        if(interaction.user.id == postData.userId || member?.permissions.has([discord.PermissionFlagsBits.Administrator])) {
            let channel = channels.hireThumbnail
            switch (postData.skill) {
                case 'Writing':
                    if(postData.jobType == 'Paid') channel = channels.paidWriting
                    else channel = channels.hireWriting
                    break
                case 'Thumbnail':
                    if(postData.jobType == 'Paid') channel = channels.paidThumbnail
                    else channel = channels.hireThumbnail
                    break
                case 'Video':
                    if(postData.jobType == 'Paid') channel = channels.paidVideo
                    else channel = channels.hireVideo
                    break
                case 'VFX':
                    if(postData.jobType == 'Paid') channel = channels.paidVfx
                    else channel = channels.hireVfx
                    break
                case 'Voice':
                    if(postData.jobType == 'Paid') channel = channels.paidVoice
                    else channel = channels.hireVoice
                    break
            }
            try {
                (channel as ForumChannel).threads.fetch(postData.message.id).then((thread) => {
                    try {
                        thread?.delete()
                    } catch {

                    }
                })
                const jobEmbed = getJobEmbed(postData.title, postData.description, postData.budget, postData.reference, postData.deadline, postData.userTag, null, postData.id, true);
                (channels.logDeletion as TextChannel).send({embeds: [jobEmbed]})
            } catch (e) {
                console.log(e)
            }
            deleteJob(postId)
            return interaction.editReply({content: `Your post has been successfully deleted.`})
        } else {
            return interaction.editReply({content: `Only the owner of this post can edit this post.`})
        }
    } else {
        return interaction.editReply({content: `The post (${postId}) does not exist. Try re-entering ID with the right command.`})
    }
    return
}