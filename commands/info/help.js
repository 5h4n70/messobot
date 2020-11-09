const {
    MessageEmbed,
    Message
} = require("discord.js");
const config = require("../../config.json");
module.exports = {
    name: 'help',
    category: 'info',
    aliases: [""],
    description: ' Get the list of Commands',
    usage: `${config.prefix}help`,

    run: async (client, message, args, cmd) => {
        let k = 0;
        const embed = new MessageEmbed()
            .setTitle("Help !")
            .setColor('5A00FF')
            .setDescription(`List of Commands`)
            .setTimestamp()
            .setFooter(`requested by  ${message.author.tag}`);


        client.commands.forEach(element => {
            embed.addField(element.name, `**aliases:** ${element.aliases}\n**Description:** ${element.description}\n**Usages:** ${element.usage} `);

        });



        message.channel.send(embed)
    }
}
