const {
  MessageEmbed,
  Message
} = require("discord.js");
const config = require("../../config.json");
module.exports = {
  name: 'ss',
  category: 'info',
  aliases: ["server-status"],
  description: ' User this command to know server status',
  usage: '<cmd>',

  run: async (client, message) => {
    const real_data=client.guilds.cache.get(config.serverId);
    const bot_count = real_data.members.cache.filter(member => member.user.bot).size;
    const voiceChannel_count = real_data.channels.cache.filter(ch => ch.type == "voice").size;
    const categoryChannel_count = real_data.channels.cache.filter(ch => ch.type == "category").size;
    const total_text_channel = real_data.channels.cache.array().length - voiceChannel_count - categoryChannel_count;
    const human_count = real_data.memberCount - bot_count;
    var verificaion_status = "This server is not Verified yet!";
    if (message.guild.verified)
      verificaion_status = "this server is Verified";

    const embed = new MessageEmbed()
      .setTitle(`Server Info`) //Setting the title.

      .addField(
        "Server Name:",
        `${message.guild.name}`,
        true
      )
      .addField(
        "Server Owner:",
        `${message.guild.owner}`,
        true
      )
      .addField(
        "Server Created At:",
        `${message.guild.createdAt}`,
        true
      )

      .addField(
        "Total Channel:",
        `${message.guild.channels.cache.array().length}`,
        true
      )
      .addField(
        "Total Text Channels:",
        `${total_text_channel} `,
        true
      )
      .addField(
        "Total voice channels:",
        `${voiceChannel_count}`,
        true
      )
      .addField(
        "Total Member(Human):",
        `${human_count}`,
        true
      )
      .addField(
        "Total Bot Member:",
        `${bot_count}`,
        true
      )
      .addField(
        "Max Member this server can have:",
        `${message.guild.maximumMembers}`,
        true
      )
      .addField(
        "Server Verification Status:",
        `${verificaion_status}`,
        true
      )

      .setTimestamp()
      .setColor('bd1ada') //Setting the color.
      .setFooter(message.author.tag);
    //Setting the footer.

    message.channel.send(embed); //Sending the rich embed.
  }



}