const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");


function markDown(txt) {
    const p = "```";
    return p + txt + p;
}
const embedQuestions = [
    "Enter Embed Message Title(Max : 256 characters)",
    "Enter Message Description(Max : 2048 characters)",
    "Set Author Name ?(y/n)",
    "Enter Field Name(Max : 256 characters)",
    "Enter Field Value(Max : 1024 characters)"
];



module.exports = {
    name: "say",
    category: "chat",
    aliases: ["csay", "embed", 'embed+'],
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
            } else if (cmd == 'embed') {


                const p = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(args.join(" "));

                message.channel.send(p);
            } else if (cmd == 'embed+') {

                const target_channel = message.mentions.channels.first();
                let temp_title;
                let commandCount = 0;
                const max_allowed_time = 30 * 1000;
                let messageCollected = new Array();
                const cEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp();

                message.channel.send(`You need to reply in 30 sec. \nTo stop this Process type  ${markDown("stop")  } \n\n` + markDown(embedQuestions[commandCount]));

                const collector = message.channel.createMessageCollector(function (nextMessage) {
                    if (message.author.id == nextMessage.author.id) {
                        if (nextMessage.content == 'stop') {

                            collector.stop('manual stop');
                            return false;
                        }

                        if (commandCount == 0) {
                            cEmbed.setTitle(nextMessage.content);
                        } else if (commandCount == 1) {

                            cEmbed.setDescription(nextMessage.content);
                        } else if (commandCount == 2) {
                            if (nextMessage.content == 'y')
                                cEmbed.setAuthor(message.author.tag);
                        } else if (commandCount > 2 && (commandCount & 1)) {

                            temp_title = nextMessage.content;
                            commandCount++;
                            collector.resetTimer({
                                idle: max_allowed_time
                            });
                            message.channel.send(markDown('Enter Field Value'));
                            return false;
                        } else if (commandCount > 3 && !(commandCount & 1)) {

                            commandCount = 2;
                            if (temp_title)
                                cEmbed.addField(temp_title, nextMessage.content);
                            else
                                console.log("title not found");
                        }

                        // console.log("cc =" + commandCount);
                        commandCount++;
                        message.channel.send(markDown(embedQuestions[commandCount]));

                        return true;
                    }

                    return false;
                }, {
                    idle: max_allowed_time,
                    max: 9
                });

                // collector.on('collect', m => console.log(`count = ${commandCount} Collected ${m.content}`));
                collector.on('end', function (m) {

                    if (target_channel)
                        target_channel.send(cEmbed);
                    else
                        message.channel.send(cEmbed);
                });


            }

        } else
            message.reply("you are not allowed to use this command! 😐");

    }
}