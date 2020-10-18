const { MessageEmbed, Client } = require("discord.js");
const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const { is_allowed } = require("../../functions.js");

module.exports = {
    name: "slowdown",
    category: "moderation",
    aliases: ["slow"],
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

        }
    }
}