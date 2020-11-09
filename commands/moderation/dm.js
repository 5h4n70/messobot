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
    name: "dm",
    category: "moderation",
    aliases: ["private"],
    description: "Send Message to a Server Memeber ",
    usage: `${config.prefix}dm @user Hello`,

    run: async (client, message, args, cmd) => {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: true,
            onlyModerator: true,
            onlyTrialModerator: false
        }

        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            var mid = args.shift();
            var d = args.join(" ");
            var fm = message.mentions.members.first();
            if (!fm) {
                const targetMember = mid;
                const guildId = config.serverID;
                const server = client.guilds.cache.get(guildId);
                const serverMember = server.members.cache.get(targetMember);
                if (serverMember)
                    fm = serverMember;
                else
                    fm = message.author;
            }
            if (cmd == "dm" || cmd == "private") {
                if (d.length)
                    fm.send(d);
                //   console.log(fm);
                else
                    message.reply(`make sure your typed the command correctly: ${config.prefix}dm @user your_text`);
            }
            message.react('✅').catch(console.error);
        } else {
            message.react('❌').catch(console.error);
        }
    }
}