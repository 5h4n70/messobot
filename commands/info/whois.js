const {
  MessageEmbed,
  Message,
  Client
} = require("discord.js");
const {
  formatDate
} = require("../../functions.js");

const config = require("../../config.json");

const ms = require("pretty-ms");
// const {
//   config
// } = require("dotenv/types");

module.exports = {
  name: "whois",
  category: "info",
  aliases: ["info"],
  description: "get info about a user",
  usage: `${config.prefix}whois @user`,

  run: async (client, message, args) => {
    let user, member;

    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
      member = message.mentions.members.first();
    } else if (args[0]) {



      const targetMember = args[0];

      let  serverMember ;
      const pda =  await message.guild.members.fetch(targetMember)
      .then(gE => {
           console.log(gE.user.tag);
          serverMember=gE;
      })
      .catch(console.error);

      if (serverMember)
        member = serverMember;
      user = serverMember.user;



    } else {
      user = message.author;
      member = message.member;
    }

    //server related id
    const joined_At_Server = formatDate(member.joinedAt);
    const roles_have =
      member.roles.cache
      .filter(r => r.id !== message.guild.id)
      .map(r => r)
      .join(",") || "none";
    //user rleated id 
    const account_created = formatDate(user.createdAt);
    const userid = user.id;
    let pp = Math.abs(member.joinedTimestamp - message.createdTimestamp);
    let pp1 = Math.abs(member.user.createdTimestamp - message.createdTimestamp);

    const embed = new MessageEmbed()
      .setTitle(` Informations I  Know about ${member.user.username} 😏`) //Setting the title.

      .addField(
        "Server Sideinfo:",
        `> ***User Name : ${member.displayName}*** \n > ***Joined at : ${joined_At_Server} *** \n > ***${ms(pp)} *** \n  > ***Roles:${roles_have}***`,
        true
      )
      //.addField('Server Sideinfo',`> ***Joined at : ${joined_At_Server} *** `,true)
      .addField(
        "Global Info:",
        `> ***Account Created at:${account_created} *** \n > ***UserID: ${userid} *** \n > ***${ms(
            pp1
          )} *** `,
        true
      )

      //Making a field with the respond ping.
      .setTimestamp()
      .setColor(0xffffff) //Setting the color.
      .setFooter(user.username, user.displayAvatarURL)
      .setThumbnail(user.displayAvatarURL); //Setting the footer.

    message.channel.send(embed); //Sending the rich embed.
  }



}