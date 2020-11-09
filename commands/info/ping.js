const {MessageEmbed,Message} = require("discord.js");

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
    name:'ping',
    category:'info',
    aliases:["pong"],
    description:' Returns API Latency and API ping and bot uptime',
    usage:`${config.prefix}ping`,
    
    run: async(client,message,args) =>{
    let tu=get_uptime(client);
    const msg = await message.channel.send("Pinging.....");
    const embed = new MessageEmbed()
    .setTitle("Latency and Ping")
    .setColor('GOLD')
    .addField('Uptime',tu)
    .setDescription(`Pong!!\n Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms\nAPI Ping ${Math.round(client.ws.ping)}ms`)
   message.channel.send(embed)
    }
}