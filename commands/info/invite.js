/// link: https://discord.com/oauth2/authorize?client_id=752454120643756173&scope=bot&permissions=8
const {
    MessageEmbed,
    Message
} = require("discord.js");
const lk="https://discord.com/oauth2/authorize?client_id=752454120643756173&scope=bot&permissions=8";
const config = require("../../config.json");
module.exports = {
    name: 'invite',
    category: 'info',
    aliases: ["inv"],
    description: ' Command List and Usages',
    usage: '<cmd>',

    run: async (client, message) => {

        message.author.send("here is the invitation link :"+ lk).then(message => console.log(`Sent message: ${message.content}`))
        .catch(message=> message.reply("Can't DM you :( !"));
    }
}