const { MessageEmbed, Message, Client } = require("discord.js");
const config = require("../../config.json");

module.exports = {
    name: "avatar",
    category: "info",
    aliases: ["icon", "pfp"],
    description: ' View someone\'s avatar',
    usage: `${config.prefix}pfp @mention_user`,
    run: async (client, message, args) => {
        let user;

        if (message.mentions.users.first()) {
            user = message.mentions.users.first();
        } else if (args[0]) {
            user = message.guild.members.cache.get(args[0]).user;
        } else {
            user = message.author;
        }
        let avatar = user.displayAvatarURL({ size: 4096, dyamic: true });

        //4096 is the biggest size of the avatar
        // Dynamic is used so that it displays gif/animated avatars also

        const embed = new MessageEmbed()
            .setTitle(`${user.tag}'s avatar`)
            .setDescription(`[Avatar URL of **${user.tag}**](${avatar})`)
            .setColor("RANDOM")
            .setImage(avatar)
            .setFooter(`Requested by ${message.author.tag}`);
        return message.channel.send(embed)
    }
}