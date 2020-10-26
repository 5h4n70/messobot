const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send("Don\'t hack me pls"));

app.listen(port, () => console.log(`Bot listening at http://localhost:${port}`));

// ================= START BOT CODE ===================



var last_story_teller;

const {
  Client,
  Collection
} = require("discord.js")


const Qdb = require('quick.db')


const fs = require("fs")
const client = new Client({
  disableEveryone: "true" // This makes sure that the bot does not mention everyone
});
require('dotenv').config();
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/")
const config = require("./config.json"); // enter your bot prefix in the config.json file
const {
  settings
} = require("cluster");
const {
  eventNames
} = require("process");

var fromDBLbot = new Set();
var fromProofChannel = new Set();

const prefix = config.prefix;
const myFunctions = require('./functions.js');
const monitor_channel = [];

['command'].forEach(handler => {
  require(`./handler/${handler}`)(client);
})



client.on("ready", async () => {
  console.log(`${client.user.tag} is online`);
  client.user.setUsername("Supplier\'s Utilities");
  client.user.setActivity('🌺 Hello :) !', {
    type: 'WATCHING',
    url: "https://discord.gg/asdfa"
  }).catch(console.error);
});



client.on("message", async message => {

  // if ( message.channel.type == "dm" && message.mentions.members.has('557281845436481539')) {





  /*
    if (message.content.startsWith("test!") && message.author.id == "521330948382654487") {
      message.delete();
      if (message.content == "test!") {
        if (!fromDBLbot.size)
          message.author.send("fromDBLbot set is empty");
        else
          message.author.send("FromTheDBLbot array :=" + [...fromDBLbot]);
        if (!fromProofChannel.size)
          message.author.send("fromProofchannel set is empty");
        else
          message.author.send("fromProofChannel array:=" + [...fromProofChannel]);
      } else if (message.content == "test!clear") {
        fromDBLbot.clear();
        fromProofChannel.clear();
      }
    }
    */

  /*
    Server UpVotes thingy goes here  ####################################################################
  */
  /*
   if (message.channel.id == "756165504556859484" && message.author.bot) { //DBLbot channel=756165504556859484
     const vid = myFunctions.get_voter_id(message.embeds[0].description);
     const pd = myFunctions.getServerMemberByID(client, '750687770904887659', vid);
     if (pd) {
       fromDBLbot.add(pd.id);
       message.react('754325580995887146');
     }
   } else if (message.channel.id == "756198759855292576" && !message.author.bot) { //proof channel=756198759855292576
     if (message.attachments.size > 0) {
       message.react('754325580995887146');
       fromProofChannel.add(message.author.id);
     } else if (!message.member.hasPermission('ADMINISTRATOR')) {
       message.delete({
         timeout: 1000
       });
       message.reply("send a screenshot only !!").then(msg => {
         msg.delete({
           timeout: 3000
         })
       }).catch("can't delete nigga");
     }
   }

   check_Vote_IDs(message);
   */

  /* 
    Server UpVotes thingy ends here     #########################################################################
  */



  ///////////////////////////////// dm stufssssssssssssssssssssssssssssssssssssssssssssss

  if (message.channel.type == "dm" && !message.author.bot) {
    if (message.content.startsWith(config.prefix))
      return;
    /* if(message.content=='add'){
       Qdb.push('ke1','this is the value');
       message.react('😅')
     }
     else if(message.content=='get'){
       message.reply( Qdb.get('ke1'))
       message.react('🤦')
     }
     else if (message.author.id == "521330948382654487") {
       rikDM(message);

     } else*/
    {
      myFunctions.dm_received(client, message);
    }
  }

  ///////////////////////////////// dm stufssssssssssssssssssssssssssssssssssssssssssssss


  /*
    monitor_channel.forEach(item => {
      if (item == message.channel.id)
        channel_monitor(message);

    });
    */


  client.prefix = prefix;
  if (message.author.bot) return; // This line makes sure that the bot does not respond to other bots
  if (!message.guild) return;


  if (message.mentions.members.array().length && message.channel.type != "dm") {
    // let ripk = message.mentions.members.array().find(element => element.id == "557281845436481539");
    let ripk = message.mentions.members.has("733824069581013044");
    let local_prm = {
      onlyServerManager: true,
      onlyHeadAdmin: true,
      onlyAdmin: true,
      onlyHeadModerator: true,
      onlyModerator: true,
      onlyTrialModerator: false
    };
    var go = myFunctions.is_allowed(local_prm, myFunctions.check_permissions(message.member));
    if (!go && ripk) {
      // console.log("delete " + ripk);
      message.delete({
        timeout: 1000
      });
      message.reply("you are not allowed to ping Memesso in chat. Continuing will result in a mute !!")
    }
  }




  if (!message.content.startsWith(prefix)) return; // This line makes sure that the bot does not respond to other messages with the bots prefix
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command)
    command.run(client, message, args, cmd);
});

function channel_monitor(message) {

  if (message.channel.id == "750687772813033541") { /// one word story channel
    if (last_story_teller && (last_story_teller.id == message.author.id)) {
      message.delete();
    } else {
      last_story_teller = message.author;
      const args = message.content.split(/ +/g);
      var fl = [];
      args.forEach(function (item) {
        if (item.length)
          fl.push(item)
      });
      if (fl.length > 1) {
        var p = setInterval(function () {
          message.delete();
          clearInterval(p);
        }, 3000);

      }
    }
  }
}

function check_Vote_IDs(message) { //check fromdblbot data and fromprooofchannel data
  if ((fromDBLbot.size && fromProofChannel.size) || message.content == (prefix + "check")) {
    let Tem_set_value = 0;
    for (let i of fromDBLbot) {
      if (fromProofChannel.has(i)) {
        const server_here = client.guilds.cache.get('750687770904887659');
        const proofChannel = server_here.channels.cache.get('756198759855292576');
        proofChannel.send(`<@${i}>, Thanks for voting! Remember, the more you vote, the higher chance you win! You can vote every **12** hours! 😍`)
        fromDBLbot.delete(i);
        fromProofChannel.delete(i);
        Tem_set_value = 1;
        break;
      }
    }
    if (!Tem_set_value && (message.content == (prefix + "check")))
      message.reply("Failed to Verify your Vote 😕");
  }
}



function rikDM(message) {
  let temp_args = message.content.trim().split(/ +/g);
  let temp_cmd = temp_args.shift();
  if (temp_cmd == '+bl') {
    temp_args.forEach(im => {
      fromDBLbot.add(im);
    });
  } else if (temp_cmd == '-bl') {
    temp_args.forEach(im => {
      fromDBLbot.delete(im);
    });
  } else if (temp_cmd == '+pl') {
    temp_args.forEach(im => {
      fromProofChannel.add(im);
    });
  } else if (temp_cmd == '-pl') {
    temp_args.forEach(im => {
      fromProofChannel.delete(im);
    });
  }
}








/*
client.on('guildMemberAdd', member => {
  ///one year nitro channel id = 756194339201220721
  let chn = member.guild.channels.cache.get('756194339201220721');
  let chn2 = member.guild.channels.cache.get('757176233648848906');

  chn.send(`<@${member.id}>`).then(msg => {
    msg.delete({
      timeout: 1500
    })
  }).catch("can't delete nigga");
  chn2.send(`<@${member.id}>`).then(msg => {
    msg.delete({
      timeout: 1500
    })
  }).catch("can't delete nigga");

});

*/

client.login(process.env.token) //Enter your bot token here