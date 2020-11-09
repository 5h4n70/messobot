const config = require("./config.json");
const Discord = require("discord.js");
const myFunctions = require('./functions.js');
const Qdb = require('quick.db');


module.exports = {

    count_channel_monitor: function (message) {

        const db_variable = "last_count";

        let t = Number(message.content);

        let number_in_db = Number(Qdb.get(db_variable));
        if (number_in_db + 1 === t) {
            let count_leaderBoard = new Qdb.table('count_board');
            Qdb.add(db_variable, 1);
            count_leaderBoard.add(message.author.id, 1);
            if(t%100==0){
                let ng= ((t/100)+1)*100;
                message.channel.setTopic(` next count goal: ${ng}`)
            }
        } else {
            message.delete({
                timeout: 1500
            });
        }
    }
}