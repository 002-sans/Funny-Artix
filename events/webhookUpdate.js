const Discord = require('discord.js')
const db = require("quick.db")
const owner = new db.table("Owner")
const config = require('../config')

module.exports = {
    name: 'webhookUpdate',
    once: false,

    async execute(client, channel) {

        const audit = await channel.guild.fetchAuditLogs({type: "WEBHOOK_CREATE"}).then((audit) => audit.entries.first())
        if (!audit | !audit.executor | audit.executor.id === client.user.id) return

        if (db.fetch(`config.${channel.guild.id}.antiwebhook`) == true) {

            if (owner.get(`owners.${audit.executor.id}.${channel.guild.id}`) || client.user.id === audit.executor.id === true) return

            if ((audit.action == "WEBHOOK_CREATE")) {

                channel.clone({ position: channel.rawPosition })
                channel.delete()

                channel.guild.fetchWebhooks().then(webhooks => {
                    webhooks.forEach(wh =>
                        wh.delete({ reason: 'Anti-Webhook' })
                    )
                })

                channel.guild.members.resolve(audit.executor).roles.cache.forEach(role => {
                    if (role.name !== '@everyone') {
                        channel.guild.members.resolve(audit.executor).roles.remove(role).catch(err => { throw err })
                    }
                })

            }
            const embed = new Discord.MessageEmbed()
                .setDescription(`<@${audit.executor.id}> a tenté de créer un \`webhook\`, il a été sanctionné`)
                .setTimestamp()
            const channellog = client.channels.cache.get(db.fetch(`${channel.guild.id}.raidlog`))
            if (channellog) channellog.send({ embeds: [embed] }).catch(console.error)
        }
    }
}
