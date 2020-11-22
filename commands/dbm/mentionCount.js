const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const config = require("../../config.json");
const Qdb = require('quick.db');
const myFunctions = require('../../functions.js');
const TABLE_NAME = 'mentionCount';


module.exports = {
    name: "mentions",
    category: "info",
    aliases: ["delete-mentions", "set-mentions"],
    description: ' manipulate Mentions Data ',
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
            let dbinfo = new Qdb.table(TABLE_NAME);
            if (cmd == 'set-mentions') {
                let temp = args[0];
                let temp2 = args[1]
                if (temp2) {
                    let d = dbinfo.delete(temp);
                    dbinfo.set(temp, temp2);
                    message.reply("Done :) ");
                } else
                    message.reply("Enter a valid User ID");
            } else if (cmd == 'delete-mentions') {
                if (args[0]) {
                    // let dbinfo = new Qdb.table(TABLE_NAME);
                    dbinfo.delete(args[0]);

                    message.reply("Deleted :) !");
                } else {
                    message.reply("Enter a valid User ID");
                }
            } else {


                if (args[0]) {
                    let k = dbinfo.get(args[0]);
                    if (k) {

                        message.channel.send(`Mention  Count for ${args[0]} is : ` + k);
                        return;
                    }
                    else
                     message.channel.send('No mentions Data available regarding ID !!');
                } else {
                    // let mention_leaderBoard = dbinfo;
                    // let mention_leaderBoard = new Qdb.table(TABLE_NAME);
                    let d = dbinfo.all();
                    d.sort((a, b) => a.data > b.data ? -1 : 1);
                    // console.log(d);

                    let loop_length = d.length;
                    if (loop_length > 10)
                        loop_length = 10;
                    let tt = `Mentions Data`;

                    let tcn = ['Rank', 'Name', 'Mentions'];
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
                                tname.push(gE.user.username + `(${element.ID})`);
                                tpoint.push(element.data);
                            })
                            .catch(console.error);
                    }
                    // embed.setDescription(table);
                    const get_table = myFunctions.myTable(tt, tcn, trank, tname, tpoint);
                    message.channel.send(get_table);
                    // console.log(d);
                }
            }
        }
    }
}