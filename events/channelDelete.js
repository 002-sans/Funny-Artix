const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const config = require('../config')
const cl = new db.table("Color")

module.exports = {
    name: 'channelDelete',
    once: false,

    async execute(client, channel) {
        let color = cl.fetch(`color_${channel.guild.id}`)
        if (color == null) color = config.app.color
        const audit = await channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then((audit) => audit.entries.first())
        if (!audit | !audit.executor | audit.executor.id === client.user.id) return

        if (db.fetch(`config.${channel.guild.id}.antichannel`) == true) {

            if (owner.get(`owners.${audit.executor.id}.${channel.guild.id}`) || client.user.id === audit.executor.id === true) return

            if ((audit.action == "CHANNEL_DELETE" || audit.action == "CHANNEL_OVERWRITE_DELETE")) {

                channel.clone({ position: channel.rawPosition })


                channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                    if (role.name !== '@everyone') {
                        channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                    }
                })

                const embed = new Discord.MessageEmbed()
                    .setDescription(`<@${audit.executor.id}> a tenté de \`supprimé\` un salon, il a été sanctionné`)
                    .setTimestamp()
                const channellog = client.channels.cache.get(db.fetch(`${channel.guild.id}.raidlog`))
                if (channellog) channellog.send({ embeds: [embed] }).catch(console.error)
            }
        }
    }
}