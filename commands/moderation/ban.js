/*
const{MessageEmbed,Message} = require("discord.js")
const config = require("../../config.json");

module.exports ={
    name:"ban",
    category:"moderation",
    aliases:"hammer",
    description:" Ban a user",
    usage:` ${config.prefix}ban`,

    run:async(client,msg,args) =>{
        if(!msg.member.hasPermission('BAN_MEMBERS')) return msg.reply({embed:{color:"RED",description:'You dont have permission to use this command'}}); // this line is used so that people without ban members perms cannot use this command

        var user = msg.mentions.users.first();
        if(!user) return msg.reply({embed:{color:"RED",description:"Mention a user to ban"}}); // if user is not mentioned then this message will pop
        
        var member;
        try {
            member = await msg.guild.members.fetch(user);
        } catch(err) {
            member = null;
        }
        if(!member) return msg.reply({embed:{color:"RED",description:"The specified user is not in the server"}}) // if the user is not in server this message will appear
        if(member){
            if(member.hasPermission('BAN_MEMBERS')) return msg.reply({embed:{color:"RED",description:" Cannot kick this user , has ban members permission"}}); // if the specified user has ban members perms then the bot cannot kick

            var reason = args.slice(1).join(' ');
            if(!reason) return msg.reply({embed:{color:"RED",description:"Mention a reason to ban the user"}}) // if reason is not specified this will pop up

            var channel = msg.guild.channels.cache.find(c => c.name === 'potato');

            var embed = new MessageEmbed()
            .setTitle('User Banned')
            .addField('User:',user, true)
            .addField('By:',msg.author,true)
            .addField('Reason:', reason)
            msg.channel.send(embed)

            var embed = new MessageEmbed()
            .setTitle("You were banned!")
            .setDescription(reason);

            try{
                await user.send(embed)
            }catch(err) {
                console.warn(err)
            }
                msg.guild.members.ban(user);
                msg.channel.send({embed:{color:"GREEN",description:`${user} has been banned by ${msg.author}`}});
            
        }
    }
}



*/

const {
    MessageEmbed,
    Client
} = require("discord.js");
const config = require("../../config.json");

const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");

function isUserID(test) {
    let ret = true,
        tmp = 0;
    test = Array.from(test);
    test.forEach(val => {
        tmp = val.charCodeAt();
        if (tmp <= '0'.charCodeAt() || tmp >= '9'.charCodeAt())
            ret = false;
    })
    return ret;
}



module.exports = {
    name: "ban",
    category: "moderation",
    aliases: ["unban"],
    description: " Ban a user",
    usage: ` ${config.prefix}ban`,

    run: async function (client, message, args, cmd) {
        var local_prm = {
            onlyServerManager: true,
            onlyHeadAdmin: true,
            onlyAdmin: true,
            onlyHeadModerator: false,
            onlyModerator: false,
            onlyTrialModerator: false
        };
        var go = is_allowed(local_prm, myFunctions.check_permissions(message.member));
        if (go) {
            let mentiond_user = message.mentions.users.first();
            let finalData = null;


            if (!mentiond_user) {
                if (args[0])
                    finalData = args[0];
                else {
                    message.reply('Mention a user or ID !!');
                    return;
                }
            } else
                finalData = mentiond_user.id;

            if (finalData) {
                const embed = new MessageEmbed()
                    .setTitle(`${cmd} log : command used by ${message.author.tag}`)
                    .setTimestamp();

                if (cmd == 'ban') {
                    message.guild.members.ban(finalData)
                        .then(user => {
                            let p = `Banned ${user.username || user.id } `;
                            embed.setDescription(p);
                            embed.setColor('RED');
                            message.channel.send(embed)
                        })
                        .catch(er => {
                            message.reply('Unknown Member !!')
                        });
                } else if (cmd == 'unban') {
                    message.guild.members.unban(finalData)
                        .then(user => {
                            let p = `Unbanned ${user.username || user.id } !`;
                            embed.setDescription(p);
                            embed.setColor('GREEN');
                            message.channel.send(embed)
                        })
                        .catch(er => message.reply('Failed to unban ! :('));
                }
            }

        } else
            message.reply(`You don't have enough permission :( .`)


    }
}