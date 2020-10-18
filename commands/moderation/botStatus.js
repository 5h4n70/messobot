const { MessageEmbed, Client } = require("discord.js");
const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const { is_allowed } = require("../../functions.js");

module.exports = {
    name: "play",
    category: "moderation",
    aliases: ["watch"],
    description: "set bot status",
    usage: `${config.prefix}play with me \n ${config.prefix}watch pumba's Video`,

    run: async (client, message, args, cmd) => {
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
            var d= args.join(" ");
            if(cmd=="play"){
                client.user.setActivity(`${d}`,{ type:'PLAYING' }).catch(console.error);
            }
            else if(cmd=="watch"){
                client.user.setActivity(`${d}`,{type:'WATCHING' ,url:"https://discord.gg/asdfa" }).catch(console.error);
            }
            message.react('✅').catch(console.error);
        }
        else{
            message.react('❌').catch(console.error);
        }
    }
}