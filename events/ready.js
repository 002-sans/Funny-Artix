const config = require('../config')
module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        console.log(`${client.user.username} connécté`)

        var compteurStatus = 1
        setInterval(async () => {
            const status =  [`${config.app.playing}`]
            compteurStatus = (compteurStatus + 1) % (status.length);
            client.user.setPresence({
                activities: [{
                    name: `${status[compteurStatus]}`,
                    type: "STREAMING",
                    url: "https://www.twitch.tv/002_karma"
                  }],
                  status: "online"})
        }, 5000);
    }
}