import discord from 'discord.js'

export interface CommandOptions {
    /**
     * All users/
     * existing members(players)/
     * develoeprs are allowed to run
     */
    permissionLevel?: 'all' | 'member' | 'dev' | 'admin' | 'mod'
    cooldown?: number
    aliases?: Array<string>
}

export interface Command {
    data: discord.RESTPostAPIApplicationCommandsJSONBody
    options?: CommandOptions
    execute: (interaction: discord.Interaction) => Promise<void>
}

export interface CommandCooldown {
    user: discord.User,
    endsAt: Date
}

export interface InteractionHandler {
    data: InteractionHandlerData
    execute: (interaction: discord.Interaction) => Promise<void>
}

interface InteractionHandlerData {
    customId: string,
    type: "autocomplete" | "component"
}
export interface VerifyClient extends discord.Client  {
    commands: discord.Collection<string, Command>,
    interactions: discord.Collection<string, InteractionHandler>,
}

export interface Job { 
    id: string,
    userId: string,
    jobType: 'Paid' | 'Hire',
    userTag: string,
    title: string,
    description: string,
    budget: string,
    deadline: string,
    reference: string,
    skill: 'Writing' | 'Voice' | 'VFX' | 'Thumbnail' | 'Video',
    message: {
        id: string,
        url: string
    },
    proposals: Array<string>,
    creationDate: number,
    bumpDate: number
}

export interface Review {
    userId: string,
    userTag: string,
    review: string,
    stars: number
}

export interface User {
    userId: string,
    userTag: string,
    skills: string[]
    reviews: Review[]
}