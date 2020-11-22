const Qdb = require('quick.db');
const dbTableName = 'recruitment'; //mainDB
const dbPersonalStatTable = 'recruitmentLog'; //statDB
const {
    MessageEmbed,
    Client
} = require("discord.js");



const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");



const mainDB = new Qdb.table(dbTableName);
const statDB = new Qdb.table(dbPersonalStatTable);



function data_delete(db, id, log) {
    if (db.delete(id)) {
        if (log)
            console.log('Data has been deleted with ID = ' + id);
        return true;
    }
    if (log)
        console.log('No data found with ID=' + id);
    return false;
}

async function view_db(db, log) {
    const ret = await db.all();
    if (log)
        console.log(db.all());
    return ret;
}

async function delete_allData(tableName) {
    //  console.log(tableName);
    const fDB = new Qdb.table(tableName);
    const allData = await fDB.all();
    if (allData.length) {
        allData.forEach(element => {
            fDB.delete(element.ID);
            // console.log(element);
        });
    }

    return;
}


async function clear_applicant_issues(positionID, val1, val2) {

}

async function setPositionStatus(positionID, statusCode) {
    const allRecruitmentData = await mainDB.all();
    let current;
    for (let k = 0; k < allRecruitmentData.length; k++) {
        current = allRecruitmentData[k];
        if (current.ID == positionID) {
            const tempQuery = `${current.ID}.status`;

            if (statusCode == 1)
                mainDB.set(tempQuery, 1)
            else
                mainDB.delete(tempQuery)
            return mainDB.get(`${current.ID}.name`);
        }
    }
    return false;
}

async function banApplicant(userID, positionID) {
    const allRecruitmentData = await mainDB.all();
    let current;
    for (let k = 0; k < allRecruitmentData.length; k++) {
        current = allRecruitmentData[k];
        if (current.ID == positionID) {
            const tempQuery = `${userID}.${current.ID}.isBanned`;
            // console.log(`banned id = ${userID} positionID = ${positionID}`);
            statDB.set(tempQuery, 1);
            return;
        }
    }
}

async function UnbanApplicant(userID, positionID) {
    const allRecruitmentData = await mainDB.all();
    let current;
    for (let k = 0; k < allRecruitmentData.length; k++) {
        current = allRecruitmentData[k];
        if (current.ID == positionID) {
            const tempQuery = `${userID}.${current.ID}.isBanned`;
            return statDB.delete(tempQuery);
        }
    }
}

async function banApplicantALL(userID) {
    const query = `${userID}.isBannedAll`;
    statDB.set(query, 1);
    /*
    const allRecruitmentData = await mainDB.all();

    allRecruitmentData.forEach(element => {
        if (element.ID.startsWith('_')) {
            const tempQuery = `${userID}.${element.ID}.isBanned`;
            statDB.set(tempQuery, 1);

        }
    });
    */
}

async function UnbanApplicantALL(userID) {
    const queryBannelAll = `${userID}.isBannedAll`;
    statDB.delete(queryBannelAll);
    const allData = await statDB.all();
    allData.forEach(element => {
        Object.keys(element.data).forEach(name => {
            if (name.startsWith('_')) {
                const tempQuery = `${userID}.${name}.isBanned`
                statDB.delete(tempQuery);
            }
        });
    });
}

async function userBanInfo(userID) {
    const allStatData = await statDB.all();
    let isallban;
    if (statDB.get(`${userID}.isBannedAll`)) {
        isallban = 'Yes';
    } else {
        isallban = 'No'
    }
    let bannedPosition = [];

    allRecruitmentData.forEach(element => {
        if (element.ID.startsWith('_')) {
            const tempQuery = `${userID}.${element.ID}.isBanned`;
            if (statDB.get(tempQuery)) {
                const nameQuery = `${element.ID}.name`
                let p = mainDB.get(nameQuery);
                bannedPosition.push(p);
            }
        }
        if (bannedPosition.length) {
            const ret = {
                isBannedAll: isallban,
                bannedfrom: bannedPosition
            };
            return ret;
        } else {
            const ret = {
                isBannedAll: isallban,
                bannedfrom: 'Not Banned from any Specific position yet !'
            };
            return ret;
        }
    });
}
async function get_the_user(client, message, args) {
    let user;

    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        const targetMember = args[0];

        let serverMember;
        const pda = await message.guild.members.fetch(targetMember)
            .then(gE => {
                //    console.log(gE.user.tag);
                serverMember = gE;
            })
            .catch(console.error);

        if (serverMember)
            user = serverMember.user;
    } else {
        user = message.author;
    }
    return user;
}

function resetPosition(positionID) {
    const smallData = mainDB.get(positionID);
    if (smallData) {
        const emtpy_ar = new Array();
        mainDB.set(`${positionID}.totalAttempt`, 0);
        mainDB.set(`${positionID}.totalSuccessfulAttempt`, 0);
        mainDB.set(`${positionID}.status`, 0);
        mainDB.set(`${positionID}.applicants`, emtpy_ar);
        return true;
    }
    return false;
}

function resetApplicant(userID) {
    const p = statDB.delete(userID);
    return p;
}



module.exports = {
    name: "start-recruitment",
    category: "Moderation",
    aliases: ["ban-applicant", "unban-applicant", 'stop-recruitment','reset-recruitment','reset-applicant'],
    description: "manipulate recruitment process/data",
    usage: `${config.prefix}start-recruitment\n ${config.prefix}stop-recruitment`,

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

            if (cmd == 'start-recruitment') {
                const ret = await setPositionStatus(args[0], 1);
                if (args[0] && ret) {
                    message.channel.send(`${ret} recruitment process is active now !`)
                } else {
                    message.channel.send(new MessageEmbed().setDescription(`Please Mention Recruitment process ID .
                    \n use ${config.prefix}recruitment to see list of all recruitment process .`))
                }
            } else if (cmd == 'stop-recruitment') {
                const ret = await setPositionStatus(args[0], 0);
                if (args[0] && ret) {
                    message.channel.send(`${ret} recruitment process is stopped !`)
                } else {
                    message.channel.send(new MessageEmbed().setDescription(`Please Mention Recruitment process ID .
                    \n use ${config.prefix}recruitment to see list of all recruitment process .`))
                }
            } else if (cmd == 'ban-applicant') {

                const error_msg = new MessageEmbed()
                    .setTitle('Failed To Ban')
                    .setDescription(`To ban a particular user from a specific position  : ${config.prefix}ban-applicant @user position_ID\n
                    To ban a user from all position :  ${config.prefix}ban-applicant @user all
                    `)
                    .setTimestamp()
                    .setColor('RED');
                if (args.length == 2 && (args[1].toLowerCase() == 'all' || args[1].startsWith('_'))) {
                    const target_user = await get_the_user(client, message, args);
                    if (args[1] == 'all') {

                        await banApplicantALL(target_user.id);
                        message.channel.send(new MessageEmbed()
                            .setDescription(`<@${target_user.id}> has been Banned from all the Recruitment Process.`)
                        );
                    } else {
                        await banApplicant(target_user.id, args[1]);
                        message.channel.send(new MessageEmbed()
                            .setDescription(`<@${target_user.id}> has been Banned from the Recruitment Process with ID ${args[1]}.`)
                        );
                    }
                    message.react('👍🏿');
                } else {
                    // console.log(`${args.length}\n args[0] = ${args[0]} args[1]=${args[1]}=`);

                    message.channel.send(error_msg);
                }
            } else if (cmd == 'unban-applicant') {
                const error_msg = new MessageEmbed()
                    .setTitle('Failed To Unban')
                    .setDescription(`To Unban a particular user from a specific position  : ${config.prefix}unban-applicant @user position_ID\n
                    To unban a user from all position :  ${config.prefix}unban-applicant @user all
                    `)
                    .setTimestamp()
                    .setColor('RED');
                if (args.length == 2 && (args[1].toLowerCase() == 'all' || args[1].startsWith('_'))) {
                    const target_user = await get_the_user(client, message, args);
                    if (args[1] == 'all') {

                        await UnbanApplicantALL(target_user.id);
                        message.channel.send(new MessageEmbed()
                            .setDescription(`<@${target_user.id}> has been Unbanned from all the Recruitment Process.`)
                        );
                    } else {
                        await UnbanApplicant(target_user.id, args[1]);
                        message.channel.send(new MessageEmbed()
                            .setDescription(`<@${target_user.id}> has been Unbanned from the Recruitment Process with ID ${args[1]}.`)
                        );
                    }
                    message.react('👍🏿');
                } else {
                    // console.log(`${args.length}\n args[0] = ${args[0]} args[1]=${args[1]}=`);

                    message.channel.send(error_msg);
                }
            } else if (cmd == 'reset-recruitment') {
                if (args.length == 1) {
                    if (resetPosition(args[0])) {

                        message.channel.send(new MessageEmbed()
                            .setDescription(`Successfully reseted the data for ${mainDB.get(`${args[0]}.name`)}`)
                        );

                    } else {
                        message.channel.send(new MessageEmbed()
                            .setDescription('Failed to Reset!!\nThe recruitment Process isn\'t in my database.')
                        );
                        return;
                    }
                } else {
                    message.channel.send(new MessageEmbed()
                        .setDescription(`Failed to Reset!! \nTo reset an Recruitment Process data ${config.prefix}${cmd} process_ID `)
                    );
                    return;
                }

            } else if (cmd == 'reset-applicant') {
                const target_user = await get_the_user(client, message, args);
                // console.log(target_user);
               
                if (resetApplicant(target_user.id)) {

                    message.channel.send(new MessageEmbed()
                        .setDescription(`Successfully reseted the Applicant data for <@${target_user.id}>`)

                    );

                } else {
                    message.channel.send(new MessageEmbed()
                        .setDescription(`Failed to Reset!! \nTo reset an applicant data ${config.prefix}${cmd} user_ID/mention_a_user `)
                    );
                    return;
                }
            }

        } else {
            message.reply(new MessageEmbed().setDescription('You are not allowed to use this command !!'))
        }

    }
}