const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");

module.exports = {
    name: "say",
    category: "chat",
    aliases: ["csay"],
    description: "To send messages by the bot",
    usage: `${config.prefix}say hello \n ${config.prefix}csay #mention_aChannel Your_message`,


    run: async function (client, message, args, cmd) {
        
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: false,
            onlyModerator: false,
            onlyTrialModerator: false
        }
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            message.delete();
            if (cmd == "say") {
                message.channel.send(args.join(" "));
            } else if (cmd == "csay") {
                var tp = args[0].slice(2, -1);
                var tp1 = message.guild.channels.cache.find(ch => ch.id === tp);
                if (!tp1)
                    message.reply(`Where to send ? \n **usage:**${config.prefix}${cmd} #channel_name Your_message`);
                else
                    tp1.send(args.slice(1).join(" "));
            }
        } else
            message.reply("you are not allowed to use this command! 😐");

    }
}