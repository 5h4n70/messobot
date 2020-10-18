const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: 'help',
    category: 'info',
    aliases: ["h"],
    description: ' Command List and Usages',
    usage: '<cmd>',

    run: async (client, message) => {

        const embed = new MessageEmbed()
            .setTitle("** List of Commands:**")
            .setColor('d413ee')
            .setDescription(` ${config.prefix}say your_messsage\n${config.prefix}csay #target_channel your_message
            ${config.prefix}ban @user reason\n${config.prefix}kick @user reason\n${config.prefix}play what_to_play\n${config.prefix}mute @user time_in_hour
            ${config.prefix}watch what_to_watch\n${config.prefix}ping \n ${config.prefix}avatar \n ${config.prefix}meme \n${config.prefix}whois
            ${config.prefix}lock #channel_name Reason_for_Locking\n${config.prefix}unlock #channel_name\n${config.prefix}lock-server
            ${config.prefix}unlock-server\n${config.prefix}ss`)
            .setFooter(`requested by ${message.author.tag}`)
        message.channel.send(embed)
    }
}