const {
    MessageEmbed,
    Message
} = require("discord.js");

const config = require("../../config.json");

function get_uptime(client) {
    let totalSeconds = (client.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    return ` ${days} days   ${hours} hours   ${minutes} minutes . `
}

module.exports = {
    name: 'test',
    category: 'info',
    aliases: ["t"],
    description: ' Returns API Latency and API ping and bot uptime',
    usage: `${config.prefix}t`,

    run: async (client, message, args) => {
       let d=0;
        const Guild56 = message.guild.members.fetch('620081277244276757')
        .then(gE=>{
                 console.log(gE.user.tag);
        })
        .catch(console.error);
}
}