const Discord = require('discord.js')
const config = require('../config')
const db = require("quick.db")
const cl = new db.table("Color")
const owner = new db.table("Owner")
const rlog = new db.table("raidlog")
const punish = new db.table("Punition")
const ab = new db.table("Antiban")

module.exports = {
    name: 'guildBanAdd',
    once: false,

    async execute(guild, user) {
        let color = cl.fetch(`color_${guild.id}`)
        if (color == null) color = config.app.color
        if (db.get(`config.${guild.id}.antiban`) === true) {

            const action = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" }).then(async (audit) => audit.entries.first());
            if (!action | !action.executor | action.executor.id === client.user.id) return

            let perm = config.app.funny == action.executor.id || owner.get(`owners.${action.executor.id}.${user.guild.id}`)
            if (!perm) {

                guild.members.kick(action.executor.id, { reason: `Antiban` })

            }
        }
    }
}