const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json");

const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");

function isUserID(test) {
    let ret = true,
        tmp = 0;
    test = Array.from(test);
    test.forEach(val => {
        tmp = val.charCodeAt();
        if (tmp <= '0'.charCodeAt() || tmp >= '9'.charCodeAt())
            ret = false;
    })
    return ret;
}



module.exports = {
    name: "ban",
    category: "moderation",
    aliases: ["unban"],
    description: " Ban a user",
    usage: ` ${config.prefix}ban`,

    run: async function (client, message, args, cmd) {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: false,
            onlyModerator: false,
            onlyTrialModerator: false
        };
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            let mentiond_user = message.mentions.users.first();
            let finalData = null;


            if (!mentiond_user) {
                if (args[0])
                    finalData = args[0];
                else {
                    message.reply('Mention a user or ID !!');
                    return;
                }
            } else
                finalData = mentiond_user.id;

            if (finalData) {
                const embed = new MessageEmbed()
                    .setTitle(`${cmd} log : command used by ${message.author.tag}`)
                    .setTimestamp();

                if (cmd == 'ban') {
                    message.guild.members.ban(finalData)
                        .then(user => {
                            let p = `Banned ${user.username || user.id } `;
                            embed.setDescription(p);
                            embed.setColor('RED');
                            message.channel.send(embed)
                        })
                        .catch(er => {
                            message.reply('Unknown Member !!')
                        });
                } else if (cmd == 'unban') {
                    message.guild.members.unban(finalData)
                        .then(user => {
                            let p = `Unbanned ${user.username || user.id } !`;
                            embed.setDescription(p);
                            embed.setColor('GREEN');
                            message.channel.send(embed)
                        })
                        .catch(er => message.reply('Failed to unban ! :('));
                }
            }

        } else
            message.reply(`You don't have enough permission :( .`)


    }
}