const redis = require("../../redis.js")
const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json");

const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");
const guildId = config.serverID;
const muteRoleId = config.muteRole;

module.exports = {
    name: "mute",
    category: "moderation",
    aliases: [ "unmute"],
    description:" mute an user",
    usage:`${config.prefix}mute @user`,
    run: async function (client, message, args, cmd) {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: true,
            onlyModerator: true,
            onlyTrialModerator: true
        };
        const redisKeyPrefix = 'muted-';

        message.delete();
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            var muteValue, mutyType = "",
                totalMuteTime = -1;
            var txt = "";
            muteValue = Number(args[args.length - 1]);

            if (muteValue > 0.0) {
                totalMuteTime = muteValue * 3600;
            }
            //
            // console.log(args.length)

            var targeted_users = message.mentions.members;
            const server = client.guilds.cache.get(config.serverId);
            let  muteRole =server.roles.cache.find((role) => role.id == config.muteRole);
            // server.roles.cache.find((role) => role.name.toLowerCase() === "muted");

            if (!targeted_users)
                message.reply("Mention atleast One member!");
            else if (!muteRole){
                // var a =[],k="";
                // server.roles.cache.find((role) => {
                //     k=role.id+"="+role.name;
                //     a.push(k);
                //     });
                // message.author.send(a);
                message.reply("Mute Role not found!");
            }
            else if (targeted_users && muteRole) {
                var ml = [];
                targeted_users.forEach(element => {
                    if (cmd == "mute" ) {
                        element.roles.add(muteRole)
                    } else if (cmd == "unmute") {

                        element.roles.remove(muteRole);
                    }
                    ml.push(element.user.tag);
                });

                if (ml.length == 1)
                    txt = "was";
                // message.channel.send(ml[0] + "  " + cmd + "d!");
                else
                    txt = "were";
                // message.channel.send( + "  " + cmd + "d!");
                const embed = new MessageEmbed()
                    .setTitle(`Mute log : command used by ${message.author.tag}`)
                    .setDescription(`${ml.join(" , ")} ${txt} ${cmd}ed!`)
                    .setColor('f30e0e')
                    .setTimestamp();

                message.channel.send(embed);
                if (totalMuteTime>0) {
                    var p = setInterval(function () {
                        targeted_users.forEach(element => {
                            element.roles.remove(muteRole);
                        });
                        message.channel.send(`> ${ml.join(" , ")} ${txt} unmuted !`);
                        clearInterval(p);
                    }, totalMuteTime * 1000);
                }
            }

        } else {
            message.react("❌");
        }

        // const embed = new MessageEmbed()
        //     .setTitle(`From /r/${random}`)
        //     .setDescription()


        // message.channel.send("user has been muted")
    }
}