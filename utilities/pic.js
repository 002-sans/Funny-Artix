const Discord = require("discord.js")
const db = require('quick.db')
const cl = new db.table("Color")
const fs = require('fs')
const config = require("../config")

module.exports = {
    name: 'pic',
    usage: 'avatar',
    description: `Afficher l'avatar de quelqu'un.`,
    async execute(client, message, args) {

        let member = message.mentions.users.first()
        if (!member){
            try{
                member = await client.users.fetch(args[0])
            }
            catch(e){
                member = message.author
            }
        }

        let avatar = member.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 })

        const embed = new Discord.MessageEmbed()
            .setTitle(`Avatar URL`)
            .setURL(avatar)
            .setImage(avatar)
            .setFooter({ text: `Avatar` })
            .setColor(config.app.color)

        message.channel.send({ embeds: [embed] });
    }
}