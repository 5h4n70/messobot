const config = require("./config.json");
const Discord = require("discord.js");
const botMasters = config.botMasters;
const ServerManager = config.serverManager;
const HeadAdmin = config.HeadAdmin;
const Admin = config.Admin;
const HeadModerator =config.HeadModerator;
const Moderator = config.Moderator;
// const Moderator = "752478986122035200"; //test
const TrialModerator = config.TrailModerator;

module.exports = {

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
    dm_received: function (client,msg) {
        const mailbox = config.mailboxChannel;
        const guildId = config.serverId;
        const server = client.guilds.cache.get(guildId);
        const boxChannel=server.channels.cache.get(mailbox);
        if(boxChannel){

            // boxChannel.send(msg.content);
            const embed = new Discord.MessageEmbed()
            .setTitle(`Message From:${msg.author.tag}`)
            .addField('Message',`${msg.content}`)
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
        }
        else{
            console.log("inbox channel not found");
        }
        // console.log(msg.content);
    },
    formatDate: function(date) {
        return new Intl.DateTimeFormat("en-us").format(date);
      },
      getServerMemberByID: function (client,serverID,memberID) {
          // const guildId = "750687770904887659";
          const server = client.guilds.cache.get(serverID);
          const serverMember = server.members.cache.get(memberID);
          return serverMember;
      },
       get_voter_id: function(DBL_message) {
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
      }

}