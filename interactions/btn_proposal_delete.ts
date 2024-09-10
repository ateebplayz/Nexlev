import { ButtonInteraction, GuildMember } from "discord.js"
import { client } from ".."
import { guildId } from "../modules/data"

export const data = {
    customId: 'btn_proposal_delete',
    type: 'component'
}
export async function execute(interaction: ButtonInteraction) {
    if(interaction.channel?.isDMBased) {
        interaction.channel
        interaction.guild?.members.fetch(interaction.user)
    }
    try {
        (await client.guilds.fetch(guildId)).members.fetch(interaction.message.embeds[0].footer?.text || '').then((user: GuildMember)=>{
            user.send({embeds: [
                {
                    "description": `**Job Title** : ${interaction.message.embeds[0].title}`,
                    "color": 0xff0000,
                    "title": `Proposal Rejected`
                }
              ],}
            ).then(()=>{
                console.log('Proposal Rejection sent to ' + user.id)
            }).catch(e => {
                console.log(e)
            })
        })
    } catch (e) {
        console.log(e)
    }
    if(interaction.message.deletable) interaction.message.delete()
    return
}