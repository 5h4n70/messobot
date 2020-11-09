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
    name: "slowdown",
    category: "moderation",
    aliases: ["slow", "noslow"],
    description: "To slow a channel",
    usage: `${config.prefix}slowdown`,

    run: async function (client, message, args, cmd) {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: false,
            onlyHeadModerator: false,
            onlyModerator: true,
            onlyTrialModerator: false
        }
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            let k = Number(args[0]);
            if (k!=0 && ( k<0 || k>0))
                k = 0;
            if (cmd == 'noslow')
                k = 0;
            message.channel.setRateLimitPerUser(k).then(ke => {

                message.channel.send(`added ${k}s slowmode for this channel.`)
            }).catch(error => {
                console.error(error);
            });

        }
    }
}