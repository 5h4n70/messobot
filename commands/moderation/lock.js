const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");
const lock_role = ["761855894258057224"];
//member = 751521037572636681;
module.exports = {
    name: "lock",
    category: "moderation",
    aliases: ["unlock", "lockdown", "lock-server", "unlock-server"],
    description: "Lock channels or Server",
    usage: `${config.prefix}lock #channel_name reason \n ${config.prefix}lock server`,

    run: async (client, message, args, cmd) => {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: false,
            onlyHeadModerator: false,
            onlyModerator: false,
            onlyTrialModerator: false
        };
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            var mentionedChannel = message.mentions.channels;
            // console.log(mentionedChannel);
            if (!mentionedChannel.array().length && (cmd != "lock-server" && cmd != "unlock-server")) {
                channel = message.guild.channels.cache.get(message.channel.id);
                lock_role.forEach(item => {
                    if (cmd == "lock" || cmd == "lockdown") {
                        channel.updateOverwrite(item, {
                            SEND_MESSAGES: false
                        });
                        channel.updateOverwrite(message.guild.roles.everyone, {
                            SEND_MESSAGES: false
                        });
                        if (!args.length)
                            args = ["No Reason Provided!"];


                        const embed = new MessageEmbed()
                            .setFooter(`Locked by: ${message.author.tag}`)
                            .setTitle(`🚫 ${channel.name} is now Locked❗  🚫\n\n You are Not Muted❗`)
                            .addField("Reason:", `${args.join(" ")}`)
                            .setColor('f72626')
                            .setTimestamp();
                        channel.send(embed);

                    } else if (cmd == "unlock") {
                        channel.updateOverwrite(item, {
                            SEND_MESSAGES: null
                        });
                        channel.updateOverwrite(message.guild.roles.everyone, {
                            SEND_MESSAGES: null
                        });
                        const embed = new MessageEmbed()
                            .setFooter(`channel Unlocked by ${message.author.tag}`)
                            .setTitle(`${channel.name} is now Unlocked ! \n\nEnjoy 😉😉 `)
                            .setColor('17f833')
                            .setTimestamp();
                        channel.send(embed);
                    }
                });


            } else if (cmd == "lock-server" || cmd == "unlock-server") {
                // console.log("i am here");
                var allChannel = message.guild.channels.cache.filter(ch => ((ch.type !== 'category') && (ch.type != "voice")));
                var rsn = args.slice(mentionedChannel.array().length).join(" ");
                if (!rsn)
                    rsn = "No Reason Provided!";
                await allChannel.forEach(async channel => {
                    //if
                    lock_role.forEach(item => {
                        if (cmd == "lock-server") {

                            channel.updateOverwrite(message.guild.roles.everyone, {
                                SEND_MESSAGES: false
                            });
                            channel.updateOverwrite(item, {
                                SEND_MESSAGES: false
                            });
                            // channel.send(embed_lock);
                        } else if (cmd == "unlock-server") {
                            channel.updateOverwrite(message.guild.roles.everyone, {
                                SEND_MESSAGES: null
                            });
                            channel.updateOverwrite(item, {
                                SEND_MESSAGES: null
                            });
                            // channel.send(embed_unlock);
                        }

                    }); //end of if
                });
                message.reply(`Done !!`)
                // message.channel.send(embed_lock);


            } else {
                var rsn = args.slice(mentionedChannel.array().length).join(" ");
                if (!rsn)
                    rsn = "No Reason Provided!";
                const embed_unlock = new MessageEmbed()
                    .setFooter(`Unlocked by ${message.author.tag}`)
                    .setTitle(`This channel is now Unlocked❗ \n\nEnjoy 😉😉 `)
                    .setColor('17f833')
                    .setTimestamp();
                const embed_lock = new MessageEmbed()
                    .setFooter(`Locked by: ${message.author.tag}`)
                    .setTitle(`🚫 This Channel is Locked  now❗ 🚫\n\n You are Not Muted ❗`)
                    .addField("Reason:", `${rsn}`)
                    .setColor('f72626')
                    .setTimestamp();

                mentionedChannel.forEach(channel => {
                    lock_role.forEach(item => {

                        if (cmd == "unlock") {
                            channel.updateOverwrite(message.guild.roles.everyone, {
                                SEND_MESSAGES: null
                            });

                            channel.updateOverwrite(item, {
                                SEND_MESSAGES: null
                            });
                            channel.send(embed_unlock);

                        } else if (cmd == "lock" || cmd == "lockdown") {
                            channel.updateOverwrite(message.guild.roles.everyone, {
                                SEND_MESSAGES: false
                            });

                            channel.updateOverwrite(item, {
                                SEND_MESSAGES: false
                            });
                            channel.send(embed_lock)
                        }
                    });
                    // channel.send(`<#${channel.id}> has been locked`)
                });
            }



        } else {
            console.log(cmd);
            message.react('❌').catch(console.error);
        }
    }
}