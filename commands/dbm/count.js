const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const config = require("../../config.json");
const Qdb = require('quick.db');
const myFunctions = require('../../functions.js');



module.exports = {
    name: "count",
    category: "info",
    aliases: ["set-count", "top-counter"],
    description: ' see the next number to count ',
    usage: `${config.prefix}count`,

    run: async (client, message, args, cmd) => {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: true,
            onlyModerator: true,
            onlyTrialModerator: false
        }
        var go = myFunctions.is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            if (cmd == 'set-count') {
                let temp = Number(args[0]);
                if (temp) {
                    let d = Qdb.delete('last_count');
                    Qdb.push('last_count', temp)
                    message.reply("Done :) ");
                } else
                    message.reply("Enter a valid Number");
            } else if (cmd == 'top-counter') {



                let count_leaderBoard = new Qdb.table('count_board');
                let d = count_leaderBoard.all();
                d.sort((a, b) => a.data > b.data ? -1 : 1);
                // console.log(d);

                let loop_length = d.length;
                if (loop_length > 10)
                    loop_length = 10;


                let tt = `🎀🎀 Top ${loop_length} counters 🎀🎀`;

                let tcn = ['Rank', 'Name', 'Points'];
                let trank = [],
                    tname = [],
                    tpoint = [];

                for (let t = 0; t < loop_length; t++) {
                    let element = d[t];
                    const Guild56 = await message.guild.members.fetch(element.ID)
                        .then(gE => {
                            // console.log(gE.user.tag);
                            // table += `\n${em_top}${gE.user.tag} --------------- ${element.data}\n`;
                            trank.push(t + 1);
                            tname.push(gE.user.username);
                            tpoint.push(element.data);
                        })
                        .catch(console.error);
                }
                // embed.setDescription(table);
                const get_table = myFunctions.myTable(tt, tcn, trank, tname, tpoint);
                message.channel.send(get_table);



                // console.log(d);
            } else {
                let d = Qdb.get('last_count') + 1;
                message.reply("The number  to count Next is : " + d);
            }
        }
    }
}