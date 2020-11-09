const config = require("./config.json");
const Discord = require("discord.js");
const botMasters = config.botMasters; //"600331085590691841";
const ServerManager = config.ServerManager; //"600331085590691841" //who am i
const HeadAdmin = config.HeadAdmin; //"535502391718576140"; ///admin
const Admin = config.Admin; // "535502391718576140"; ///admin
const HeadModerator = config.HeadModerator; //"654597283354116096"; //Headmod
const Moderator = config.Moderator; //"567039267939942420"; // mod
const TrialModerator = config.TrialModerator; //"600199530436362250"; //trainee mod
const Qdb = require('quick.db');


module.exports = {
    Dbget: function (key) {
        Qdb.get(key);
    },

    Dbremove: function (key) {
        Qdb.delete(key);
    },


    DbAdd: function (key, value) {
        Qdb.add(key, value);

    },

    is_botMaster: function (messageMember) {
        var temp = 0;
        messageMember.roles.cache.forEach(f => {
            if (f.id === botMasters) {
                // console.log("botmaster = "+botMasters + "  f.id = "+f.id)
                temp = 5;
            }
        });
        if (temp)
            return true;
        else
            return false;
    },

    check_permissions: function (messageMember) {
        var obj = {
            isServerManager: false,
            isHeadAdmin: false,
            isAdmin: false,
            isHeadModerator: false,
            isModerator: false,
            isTrialModerator: false
        };
        messageMember.roles.cache.forEach(f => {
            // console.log(Moderator + "=" + f.id)
            if (f.id === ServerManager)
                obj.isServerManager = true;
            else if (f.id === HeadAdmin)
                obj.isHeadAdmin = true;
            else if (f.id === Moderator)
                obj.isModerator = true;
            else if (f.id === Admin)
                obj.isAdmin = true;
            else if (f.id === TrialModerator)
                obj.isTrialModerator == true;
            else if (f.id === HeadModerator)
                obj.isHeadModerator = true;
        });

        return obj;
    },

    is_allowed: function (local_prms, member_prms) {
        if (local_prms.onlyServerManager && member_prms.isServerManager)
            return true;
        else if (local_prms.onlyHeadAdmin && member_prms.isHeadAdmin)
            return true;
        else if (local_prms.onlyAdmin && member_prms.isAdmin)
            return true;
        else if (local_prms.onlyHeadModerator && member_prms.isHeadModerator)
            return true;
        else if (local_prms.onlyModerator && member_prms.isModerator)
            return true;
        else if (local_prms.onlyTrialModerator && member_prms.isTrialModerator)
            return true;
        return false;
    },

    dm_received: function (client, msg) {
        const mailbox = config.mailboxChannel;
        const guildId = config.serverId;
        const server = client.guilds.cache.get(guildId);
        const boxChannel = server.channels.cache.get(mailbox);
        if (boxChannel) {
            if (!msg.content)
                msg.content = "[empty message]"

            // boxChannel.send(msg.content);
            var embed = new Discord.MessageEmbed()
                .setTitle(`Message From:${msg.author.tag}`)
                .addField('Message', `${msg.content}`)
                .setColor('dfee04')
                .setFooter(`Sender ID: ${msg.author.id}`)
                .setTimestamp();
            boxChannel.send(`Live mention: ${msg.author}`)
            boxChannel.send(embed);
            if (msg.attachments.size) {
                boxChannel.send("Attachments:")
                const d = msg.attachments;
                d.forEach(item => {
                    boxChannel.send(item.proxyURL);
                });
            }
            //    console.log(msg.attachments[0].proxyURL);

        } else {
            console.log("inbox channel not found");
        }
        // console.log(msg.content);
    },

    formatDate: function (date) {
        return new Intl.DateTimeFormat("en-us").format(date);
    },

    getServerMemberByID: function (client, serverID, memberID) {
        // const guildId = "750687770904887659";
        const server = client.guilds.cache.get(serverID);
        const serverMember = server.members.cache.get(memberID);
        return serverMember;
    },

    get_voter_id: function (DBL_message) {
        let voter_id = "";
        for (let i = 0; i < DBL_message.length; i++) {
            if (DBL_message[i] == 'i' && DBL_message[i + 1] == 'd') {

                for (let k = i + 1; k < DBL_message.length; k++) {
                    let temp = DBL_message[k];
                    if (temp >= '0' && temp <= '9')
                        voter_id += temp;
                    else {
                        if (voter_id.length)
                            break;
                    }

                }
            }
        }
        return voter_id;
    },

    myTable: function (tableTitle, columnTitle, rank, name, point) {
        // requirements 
        const {
            table
        } = require('table');
        let tableData = [];
        let tableConfig = {
            columns: {
                0: {
                    alignment: 'center'
                },
                1: {
                    alignment: 'center'
                },
                2: {
                    alignment: 'center'
                }
            }
        };

        //local variable diclaration

        let TABLE, temp_rank;

        //functionality 

        // title section of the table
        tableTitle += '\n';

        tableData.push(columnTitle);


        for (let i = 0; i < name.length; i++) {
            tableData.push([rank[i], name[i], point[i]]);
        }

        TABLE = table(tableData, tableConfig);
        TABLE = ` \`\`\`${tableTitle}${TABLE}\`\`\``;


        return TABLE;
    },
    muteMemeMentions:async function (client,message) {
        // console.log("delete " + ripk);
       
        message.reply("you are not allowed to ping urmemesupplier in chat. Continuing will result in a mute !!")
        let mention_table = new Qdb.table('mentionCount');
        mention_table.add(message.author.id, 1);
        let k = mention_table.get(message.author.id);
        if (k >= 3) {
            const server = client.guilds.cache.get(config.serverId);
            let  muteRole =server.roles.cache.find((role) => role.id == config.muteRole);
            /*
            server.roles.fetch(config.muteRole)
            .then(role => {
                muteRole=role
            })
            .catch(console.error);
            */
            
             if (muteRole) {
                message.member.roles.add(muteRole);
                let embed = new Discord.MessageEmbed()
                    .setTitle('Auto Mute log')
                    .setColor('RED')
                    .setDescription(`${message.author} has been muted for mentioning urmemesupplier !! `)
                    .setTimestamp()
                message.channel.send(embed);
            }
            else 
            console.log(`k = ${k} and muteRole not found ${muteRole}`);
        }

    }
}