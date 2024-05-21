import discord from 'discord.js'
import { Command } from './types'
import { botColor } from './data'

export class ErrorEmbed extends discord.EmbedBuilder {
    constructor(title: string, error: string) {
        super()
        this.setColor(0xff0000)
        this.setTitle(title || "<:warn:1132713539790962828> Error")
        this.setDescription(error || "An error occured!")
    }
}

export class SuccessEmbed extends discord.EmbedBuilder {
    constructor(title: string, message: string) {
        super()
        this.setColor(0x00d900)
        this.setTitle("<:done:1132644555834011748> " + title || "<:done:1132644555834011748> Success")
        this.setDescription(message || "Action was successful!")
    }
}

export class RunTimeErrorEmbed extends ErrorEmbed {
    constructor(code: string) {
        super('An unexpected error occured. Further details for this run may have been logged.', 'Unexpected Error')
        this.setFooter({text: `Code: ${code}`})
    }
}

export class InfoEmbed extends discord.EmbedBuilder {
    constructor(title: string, information: string) {
        super()
        this.setColor(botColor) // FFDE59 0599fc
        this.setTitle(title)
        this.setDescription(information || "An Error Occured!")
    }
}

export class CooldownErrorEmbed extends ErrorEmbed {
    constructor(command: Command, timeleft: number) {
        super(`Please wait ${(timeleft/1000).toFixed(2)} seconds before using ${command.data.name}`, 'Cooling down!')

    }
}