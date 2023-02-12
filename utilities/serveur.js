const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const config = require("../config")
const fs = require('fs')
const moment = require('moment')
const footer = config.app.footer
const p = new db.table("prefix")

module.exports = {
    name: 'serveur',
    usage: 'serveur',
    description: `Permet d'afficher des informations relatives au serveur`,
    async execute(client, message, args) {

        let pf = p.fetch(`prefix_${message.guild.id}`)
        if (pf == null) pf = config.app.px

        if (args[0] == "info") {

            const premiumTier = {
                NONE: 0,
                TIER_1: 1,
                TIER_2: 2,
                TIER_3: 3,
            };

            const verifLevels = {
                NONE: "Aucune",
                LOW: "faible",
                MEDIUM: "Moyen",
                HIGH: "Élevé",
                VERY_HIGH: "Maximum",
            };

            const rolesGuild = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const membersGuild = message.guild.members.cache;
            const channelsGuild = message.guild.channels.cache;
            const emojisGuild = message.guild.emojis.cache;

            let desc = message.guild.description
            if (desc == null) desc = "Le serveur ne possède pas de déscription !"

            const embed = new Discord.MessageEmbed()
                .setColor(config.app.color)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setImage(message.guild.bannerURL({ dynamic: true, size: 512 }))
                .setTitle(`Informations \`${message.guild.name}\``)
                .setDescription(`**Description**\n ${desc}`)
                .addFields(
                    {
                        name: `ID du serveur`,
                        value: `${message.guild.id}`,
                        inline: true
                    },
                    {
                        name: `Propriétaire`,
                        value: `<@${message.guild.ownerId}>`,
                        inline: true
                    },
                    {
                        name: `ID Propriétaire`,
                        value: `${message.guild.ownerId}`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: `Nombre de Membres`,
                        value: `${message.guild.memberCount || '0'}`,
                        inline: true
                    },
                    {
                        name: "Nombre de Boosts",
                        value: `${message.guild.premiumSubscriptionCount || '0'}`,
                        inline: true
                    },
                    {
                        name: `Niveau de Boost`,
                        value: `${premiumTier[message.guild.premiumTier]}`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: `Nombre de Bots`,
                        value: `${membersGuild.filter(member => member.user.bot).size}`,
                        inline: true
                    },
                    {
                        name: `Nombre de Rôles`,
                        value: `${rolesGuild.length}`,
                        inline: true
                    },
                    {
                        name: `Nombres de Salons`,
                        value: `${channelsGuild.size}`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: `Nombre d'Emojis`,
                        value: `${emojisGuild.size}`,
                        inline: true
                    },
                    {
                        name: `Date de création`,
                        value: `${message.guild.createdAt.toLocaleDateString("fr-eu")}`,
                        inline: true
                    },
                    {
                        name: `URL Personnalisé`,
                        value: message.guild.vanityURLCode ? `discord.gg/${message.guild.vanityURLCode}` : `Le serveur ne possède pas d'url`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: `Vérification du serveur`,
                        value: `${verifLevels[message.guild.verificationLevel]}`,
                        inline: true
                    },

                )
                .setFooter({ text: `${footer}` })
            message.channel.send({ embeds: [embed] })

        }

    }
}