import chalk from 'chalk'
import discord, { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle, ForumChannel, TextChannel } from 'discord.js'
import dotenv from 'dotenv'
import fs from 'node:fs'
import { Command, InteractionHandler, VerifyClient } from './modules/types'
import { ErrorEmbed, InfoEmbed, RunTimeErrorEmbed } from './modules/embeds'
import { mongoClient } from './modules/mongo'
import { deleteJob, getJobs } from './modules/db'
import { guildId } from './modules/data'
import { getJobEmbed } from './modules/helpers'

dotenv.config()

interface Channels {
    dashboard: discord.Channel | undefined | null
    paidWriting: discord.Channel | undefined | null
    paidVoice: discord.Channel | undefined | null
    paidThumbnail: discord.Channel | undefined | null
    paidVideo: discord.Channel | undefined | null
    paidVfx: discord.Channel | undefined | null
    reportLog: discord.Channel | undefined | null
    reportCLog: discord.Channel | undefined | null
    hireWriting: discord.Channel | undefined | null
    hireVoice: discord.Channel | undefined | null
    hireThumbnail: discord.Channel | undefined | null
    hireVideo: discord.Channel | undefined | null
    hireVfx: discord.Channel | undefined | null

    logApproval: discord.Channel | undefined | null
    logWarn: discord.Channel | undefined | null
    logMessage: discord.Channel | undefined | null
    logBump: discord.Channel | undefined | null
    logDeletion: discord.Channel | undefined | null
    logReview: discord.Channel | undefined | null

    reviewVerif: discord.Channel | undefined | null
}
export let channels: Channels = {
    dashboard: null,
    hireWriting: null,
    hireVoice: null,
    hireThumbnail: null,
    hireVideo: null,
    hireVfx: null,
    paidWriting: null,
    paidVoice: null,
    paidThumbnail: null,
    paidVideo: null,
    paidVfx: null,
    reportLog: null,
    reportCLog: null,
    logApproval: null,
    logWarn: null,
    logMessage: null,
    logBump: null,
    logDeletion: null,
    logReview: null,
    reviewVerif: null
}

export const client = new discord.Client({intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.MessageContent, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.DirectMessages, discord.GatewayIntentBits.GuildMembers]}) as VerifyClient
client.commands = new discord.Collection<string, Command>()
client.interactions = new discord.Collection<string, InteractionHandler>()

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const timer = Date.now()
        const command = client.commands.get(interaction.commandName)
            || client.commands.find(cmd => cmd.options?.aliases && cmd.options.aliases.includes(interaction.commandName))

        if (!command) return console.log(`${chalk.red('NOT FOUND >> ')}Command ${interaction.commandName}`)

        try {
            if (command.options?.permissionLevel) {
                const member = await interaction.guild?.members.fetch(interaction.user)
                switch (command.options.permissionLevel) {
                    case 'member':
                        break
                    case 'all':
                        break
                    case 'admin':
                        if(member) {
                            if(!(member.permissions.has([discord.PermissionsBitField.Flags.Administrator]))) {
                                const permError = new ErrorEmbed('You do not have permission to do this command!', 'You need to have the `Administrator` permission to execute this command.')
                                interaction.reply({embeds: [permError], ephemeral: true})
                                return
                            }
                        }
                        break
                }
            }
            await command.execute(interaction)
            console.log(`${chalk.green('EXECUTE >>')} Command ${command.data.name} ${Date.now() - timer}ms | ${interaction.user.id}`)
        } catch (e) {
            const errorId = '210ie90132ir9e032ur9032u9tru98ur9328ur8932ure9328ur932ur8932ur923ur8932u8x'
            console.log(`${chalk.red('EXECUTE ERROR >>')} Command ${command.data.name} ${Date.now() - timer}ms ${errorId}`)
            console.error(e)

            await interaction.reply({ ephemeral: true, embeds: [new RunTimeErrorEmbed(errorId)] }).catch(console.log)
        }
    } else if(interaction.isRepliable()) {
        const timer = Date.now()
        // if(interaction.customId.startsWith('btn_confirm_job_hire')) return
        let localInteraction = client.interactions.get(interaction.customId)
        if(interaction.customId.startsWith('btn_job_paid')) {
            if(interaction.customId.endsWith(interaction.id)) {
                
            } else {
                localInteraction = client.interactions.get('btn_job_paid')
            }
        } else if(interaction.customId.startsWith('btn_job_hire')) {
            localInteraction = client.interactions.get('btn_job_hire')
        }
        console.log(interaction.customId)
        if (!localInteraction) {
            //if() {
            //    return console.log(`${chalk.green('EXECUTE >>')} Interaction ${interaction.customId} ${Date.now()-timer}ms | ${interaction./user.id}`)
            //} else {
                return console.log(`${chalk.red('NOT FOUND >> ')}Interaction ${interaction.customId}`)
            //}
        }
        try {
            await localInteraction.execute(interaction)
            console.log(`${chalk.green('EXECUTE >>')} Interaction ${localInteraction.data.customId} ${Date.now() - timer}ms | ${interaction.user.id}`)
        } catch (e) {
            /*const errorId = '210ie90132ir9e032ur9032u9tru98ur9328ur8932ure9328ur932ur8932ur923ur8932u8x'
            console.log(`${chalk.red('EXECUTE ERROR >>')} Interaction ${localInteraction.data.customId} ${Date.now() - timer}ms ${errorId}`)
            console.error(e)

            await interaction.channel?.send({embeds: [new RunTimeErrorEmbed(errorId)] }).catch(console.log)*/
        }
    }
})

client.on('messageCreate', async (message) => {
    if(message.author.bot) return
    if(message.author.tag !== 'ateebsohail') return
    if(message.content.startsWith('!embed')) {
        const paidJobs = {
            writing: new ButtonBuilder().setCustomId('btn_job_paid_wr').setLabel('Post a Writing Job').setStyle(ButtonStyle.Success).setEmoji('✍️'),
            voice: new ButtonBuilder().setCustomId('btn_job_paid_vo').setLabel('Post a Voice Job').setStyle(ButtonStyle.Success).setEmoji('🎤'),
            video: new ButtonBuilder().setCustomId('btn_job_paid_vi').setLabel('Post a Editing Job').setStyle(ButtonStyle.Success).setEmoji('📷'),
            vfx: new ButtonBuilder().setCustomId('btn_job_paid_vf').setLabel('Post an Assistant Job').setStyle(ButtonStyle.Success).setEmoji('✨'),
            thumbnail: new ButtonBuilder().setCustomId('btn_job_paid_th').setLabel('Post a Thumbnail Job').setStyle(ButtonStyle.Success).setEmoji('🎨')
        }
        const forHireAds = {
            writing: new ButtonBuilder().setCustomId('btn_job_hire_wr').setLabel('Post a Writing Ad').setStyle(ButtonStyle.Success).setEmoji('✍️'),
            voice: new ButtonBuilder().setCustomId('btn_job_hire_vo').setLabel('Post a Voice Ad').setStyle(ButtonStyle.Success).setEmoji('🎤'),
            video: new ButtonBuilder().setCustomId('btn_job_hire_vi').setLabel('Post a Editing Ad').setStyle(ButtonStyle.Success).setEmoji('📷'),
            vfx: new ButtonBuilder().setCustomId('btn_job_hire_vf').setLabel('Post an Assistant Ad').setStyle(ButtonStyle.Success).setEmoji('✨'),
            thumbnail: new ButtonBuilder().setCustomId('btn_job_hire_th').setLabel('Post a Thumbnail Ad').setStyle(ButtonStyle.Success).setEmoji('🎨')
        }
        const actionRows = {
            paidJobs: new ActionRowBuilder<ButtonBuilder>().addComponents(paidJobs.writing, paidJobs.voice, paidJobs.video),
            paidJobs2: new ActionRowBuilder<ButtonBuilder>().addComponents(paidJobs.vfx, paidJobs.thumbnail),
            foreHire: new ActionRowBuilder<ButtonBuilder>().addComponents(forHireAds.writing, forHireAds.voice, forHireAds.video),
            foreHire2: new ActionRowBuilder<ButtonBuilder>().addComponents(forHireAds.vfx, forHireAds.thumbnail)
        }
        switch (message.content.endsWith('fha')) {
            case true: 
                message.channel.send({embeds: [{
                    "description": "# <:flecha113:1239895323594457149> Post Your For-Hire AD: # \n<:Gap:1239281994245083217>\n**For-Hire Section:** Freelancers and employees post their for-hire ads in those channels, and clients and recruiters hire those people from those channels.\n\n\n<:line_arrow_white1:1239912525143871518> To post a for-hire ad, click on the relevant button below to post your ad in the 'for hire' section.\n\n<:line_arrow_white1:1239912525143871518> For detailed information and a tutorial guide on how to use the marketplace, please visit: <#1237689319712493569>",
                    "color": 1617919,
                    "image": {
                        "url": "https://media.discordapp.net/attachments/1072534359376146522/1239894378043019305/nexlev_talent-01.jpg?ex=6644951f&is=6643439f&hm=d4bd7abb07849ef6f9a51b22e9b2af27e0bb52eefe98fb6bae6bc097dfefa848&=&format=webp&width=1200&height=675"
                    }
                }], components: [actionRows.foreHire, actionRows.foreHire2]})
                break
            case false: 
                message.channel.send({embeds: [{
                    "description": "# <:flecha113:1239895323594457149> Post Your Paid Job AD: # \n<:Gap:1239281994245083217>\n**Paid Job Section:** Clients and recruiters post paid jobs in those channels, while freelancers and employees apply for those jobs from those paid job channels.\n\n\n<:line_arrow_white1:1239912525143871518> For detailed information and a tutorial guide on how to use the marketplace, please visit: <#1237689319712493569>\n\n<:line_arrow_white1:1239912525143871518> To post a job, click on the relevant button to post your job.",
                    "color": 1617919,
                    "image": {
                        "url": "https://media.discordapp.net/attachments/1072534359376146522/1239894378043019305/nexlev_talent-01.jpg?ex=6644951f&is=6643439f&hm=d4bd7abb07849ef6f9a51b22e9b2af27e0bb52eefe98fb6bae6bc097dfefa848&=&format=webp&width=1200&height=675"
                    }
                }], components: [actionRows.paidJobs, actionRows.paidJobs2]})
                break
        }
    } else if(message.content == '!skills') {
        const buttons = {
            writing: new ButtonBuilder().setCustomId('btn_role_writing').setLabel('Writing').setEmoji('✍️').setStyle(ButtonStyle.Success),
            actor: new ButtonBuilder().setCustomId('btn_role_voice').setLabel('Voice Actor').setEmoji('🎤').setStyle(ButtonStyle.Success),
            thumbnail: new ButtonBuilder().setCustomId('btn_role_thumbnail').setLabel('Thumbnail Design').setEmoji('🎨').setStyle(ButtonStyle.Success),
            video: new ButtonBuilder().setCustomId('btn_role_video').setLabel('Video Editing').setEmoji('📷').setStyle(ButtonStyle.Success),
            vfx: new ButtonBuilder().setCustomId('btn_role_vfx').setLabel('Assistant').setEmoji('✨').setStyle(ButtonStyle.Success)
        }
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.writing,buttons.actor,buttons.thumbnail,buttons.video,buttons.vfx)
        return message.channel.send({
            embeds: [
              {
                "description": "<:flecha113:1239895323594457149> Please select your skills role. Only select those skills in which you are proficient. You can click the buttons below to make your selections.",
                "color": 1617663,
                image: {
                    url: 'https://cdn.discordapp.com/attachments/1100793453358616616/1242423394536919131/chrome_JJUPHRpESk.gif?ex=664dc874&is=664c76f4&hm=c663259b5812124ac1222f44bbe19dfcf7aae046fc7b842ea58bdd4bc938e761&'
                }
              }
            ],
            components: [actionRow]
          })
    } else if(message.content == '!gigs') {
        const buttons = {
            freelancer: new ButtonBuilder().setCustomId('btn_role_freelancer').setLabel('I am a Freelancer').setEmoji('👷').setStyle(ButtonStyle.Success),
            client: new ButtonBuilder().setCustomId('btn_role_client').setLabel('I am a Client').setEmoji('💼').setStyle(ButtonStyle.Success)
        }
        const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons.freelancer, buttons.client)
        return message.channel.send({
            embeds: [
                {
                  "title": "Before entering in the server, please select your main role:",
                  "description": "<:Gap:1239281994245083217>\n<:line_arrow_white1:1239912525143871518> Are you a client seeking talented freelancers for your youtube channel?\n\n**Or**\n\n<:line_arrow_white1:1239912525143871518> Are you a skilled freelancer looking for paid jobs?",
                  "color": 1617663
                }
              ],
            components: [actionRow]
          })
    }
    return
})
client.once('ready', async (readyClient) => {
    const interactionFiles = fs.readdirSync('dist/interactions').filter(file => file.endsWith('.js'))
    const commandFiles = fs.readdirSync('dist/commands').filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
        const command: Command = require(`./commands/${file}`);

        if(!command.data || !command.execute) {
            console.log(`${chalk.red('INVALID >>')} Command ${file}`)
            break
        }
        console.log(`${chalk.green('LOADED >>')} Command \t${command.data.name}`)
        client.commands.set(command.data.name, command);
    }
    for (const file of interactionFiles) {
        const localInteraction: InteractionHandler = require(`./interactions/${file}`);

        if(!localInteraction.data || !localInteraction.execute) {
            console.log(`${chalk.red('INVALID >>')} Interaction ${file}`)
            break
        }
        console.log(`${chalk.green('LOADED >>')} Interaction\t${localInteraction.data.customId}`)
        client.interactions.set(localInteraction.data.customId, localInteraction);
    }
    readyClient.user.setPresence({
        activities: [{
            name: 'Marketplace!',
            type: discord.ActivityType.Watching
        }],
        status: 'online',
    })
    channels.dashboard = readyClient.channels.cache.get('1279151232531042442')
    channels.paidWriting = readyClient.channels.cache.get('1281165118138224662')
    channels.paidVoice = readyClient.channels.cache.get('1281165132654972980')
    channels.paidThumbnail = readyClient.channels.cache.get('1281165151013306369')
    channels.paidVideo = readyClient.channels.cache.get('1281165165097652315')
    channels.paidVfx = readyClient.channels.cache.get('1237160166219059200')
    channels.reportLog = readyClient.channels.cache.get('1279151233017450597')
    channels.reportCLog = readyClient.channels.cache.get('1282329494375370797')

    channels.hireWriting = readyClient.channels.cache.get('1281165211897696317')
    channels.hireVoice = readyClient.channels.cache.get('1281165212119990315')
    channels.hireThumbnail = readyClient.channels.cache.get('1281165270345318400')
    channels.hireVideo = readyClient.channels.cache.get('1281165294278279261')
    channels.hireVfx = readyClient.channels.cache.get('1281165311898423306')
    
    channels.logApproval = readyClient.channels.cache.get('1279151233482887250')
    channels.logWarn = readyClient.channels.cache.get('1279151233482887251')
    channels.logMessage = readyClient.channels.cache.get('1279151233482887252')
    channels.logBump = readyClient.channels.cache.get('1279151233482887254')
    channels.logDeletion = readyClient.channels.cache.get('1279151233482887255')
    channels.logReview = readyClient.channels.cache.get('1279151234208763975')
    
    channels.reviewVerif = readyClient.channels.cache.get('1279151232531042443')
    console.log(chalk.bold(chalk.green('Bot is ready to go.\n\n')) + `${chalk.bold('Client ID')} : ${process.env.CLIENTID}\n${chalk.bold('Client Username')} : ${readyClient.user.username}`)
    
    setInterval(async () => {
        const jobs = await getJobs()
        jobs.forEach(async (job)=>{
            const time = Date.now() - job.creationDate
            const days = Math.round(((time/1000)/3600)/24)
            if(days >= 6) {
                let channel = channels.hireThumbnail
                const user = await (await client.guilds.fetch(guildId)).members.fetch(job.userId)
                try {
                    const reason = 'Each post can only be up for 6 days.'
                    /* user?.send({
                        embeds: [
                            new ErrorEmbed(`Post Deleted`, `Your post **${job.title}** has been deleted.\n${reason ? `**Reason** : ${reason}` : 'No reason provided'}`).setFooter({
                                text: `ID : ${job.id}`
                            })
                        ]
                    }) */
                } catch (e) {
                    console.log(e)
                }
                switch (job.skill) {
                    case 'Writing':
                        if(job.jobType == 'Paid') channel = channels.paidWriting
                        else channel = channels.hireWriting
                        break
                    case 'Thumbnail':
                        if(job.jobType == 'Paid') channel = channels.paidThumbnail
                        else channel = channels.hireThumbnail
                        break
                    case 'Video':
                        if(job.jobType == 'Paid') channel = channels.paidVideo
                        else channel = channels.hireVideo
                        break
                    case 'VFX':
                        if(job.jobType == 'Paid') channel = channels.paidVfx
                        else channel = channels.hireVfx
                        break
                    case 'Voice':
                        if(job.jobType == 'Paid') channel = channels.paidVoice
                        else channel = channels.hireVoice
                        break
                }
                try {
                    (channel as ForumChannel).threads.fetch(job.message.id).then((thread) => {
                        try {
                            thread?.delete()
                        } catch(e) {
                            console.log(e)
                        }
                    })
                    const jobEmbed = getJobEmbed(job.title, job.description, job.budget, job.reference, job.deadline, job.userTag, null, job.id, true, job.userId);
                    (channels.logDeletion as TextChannel).send({embeds: [jobEmbed]})
                } catch (e) {
                    console.log(e)
                }
                deleteJob(job.id)
                console.log(`Deleted ${job.id}`)
            }
            console.log(`${job.id} ${days}`)
        })
    }, 3600000);
})
const run = () => {
    mongoClient.connect().then(()=>{console.log(chalk.cyan(chalk.bold('Connected To MongoDB Database')))})
    client.login(process.env.BOTTOKEN)
}

run()