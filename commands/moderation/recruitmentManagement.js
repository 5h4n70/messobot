const {
    MessageEmbed,
    Client
} = require("discord.js");
const Qdb = require('quick.db');


const config = require("../../config.json")
const myFunctions = require('../../functions.js');
const {
    is_allowed
} = require("../../functions.js");




const dbTableName = 'recruitment'; //rDB / mainDB
const dbPersonalStatTable = 'recruitmentLog'; //StatDB

const mainDB = new Qdb.table(dbTableName);
const statDB = new Qdb.table(dbPersonalStatTable);

async function delete_allData() {

    const tableNamesinArray = ['recruitmentLog', 'recruitment'];
    tableNamesinArray.forEach( async er => {
        const fDB = new Qdb.table(er);
        const allData =await fDB.all();
        if (allData.length) {
            allData.forEach(element => {
                // console.log('ow');
                fDB.delete(element.ID);
            });
        }
    });
    return;
}

async function check_position_name_availability(args_name) {
    // console.log(args_name);
    const rDB = new Qdb.table(dbTableName);

    const p = await rDB.all(); // format : ID,data

    let k = new Set();
    p.forEach(element => {
        let temp = element.data;
        k.add(temp.name);
    });


    const ret = k.has(args_name);
    return ret;
}
async function userBanInfo(userID) {

    let isallban;
    if (statDB.get(`${userID}.isBannedAll`)) {
        isallban = 'Yes';
    } else {
        isallban = 'No'
    }
    // console.log('isallban = ' + isallban);

    let bannedPosition = [];

    let allRecruitmentData = await mainDB.all();
    allRecruitmentData.forEach(element => {
        if (element.ID.startsWith('_')) {
           
            const tempQuery = `${userID}.${element.ID}.isBanned`;
            if (statDB.get(tempQuery)) {
                
                const nameQuery = `${element.ID}.name`
                let p = mainDB.get(nameQuery);
                bannedPosition.push(p);
            }

        }  });
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
  
}


function applicants_as_mention(IDS) {

    let k = '';
    if (IDS.length) {
        k = 'Successful Applicants: \n';
        IDS.forEach(element => {
            k += '<@' + element + '> \n';
        });
    }
    return k;
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
async function delete_personal_position_data(positionID) {
    const statDB = new Qdb.table(dbPersonalStatTable);
    const allD = await statDB.all();
    // console.log(allD);
    // console.log(positionName);

    allD.forEach((er) => {
        // console.log(er);
        //getting personal old value

        let p1 =statDB.get(`${er.ID}.${positionID}.inCompleteAttempt`) || 0;
        let p2 =statDB.get(`${er.ID}.${positionID}.successfulAttempt`) || 0;


        // setting new value 
        let k1=statDB.get(`${er.ID}.totalIncompleteAttempt`) || 0;
        let k2=statDB.get(`${er.ID}.totalSuccessfulAttempt`) || 0;
        // console.log(`p1 = ${p1}  p2= ${p2}\nk1 = ${k1}  k2= ${k2}`);
        k1=k1-p1;
        k2=k2-p2;
        // console.log(`k1 = ${k1}  k2= ${k2}`);

        statDB.set(`${er.ID}.totalIncompleteAttempt`,k1);
        statDB.set(`${er.ID}.totalSuccessfulAttempt`,k2);

        statDB.delete(`${er.ID}.${positionID}`);//deleting old value
        // console.log(p);
    });
}

function markDown(txt) {
    const p = "```";
    return p + txt + p;
}
const embedQuestions = [
    "Enter The position Name you want to recruiting for !",
    "Enter Question No:"
];

function uid() {
    const pp = '_' + Math.random().toString(36).substr(2, 9);
    return pp;
};


module.exports = {
    name: "recruitment",
    category: "Moderation",
    aliases: ["new-recruitment", "delete-recruitment", 'applicant', "nukedb"],
    description: "To see on going recruitment list ,create/delete recruitment process",
    usage: `${config.prefix}recruitment\n ${config.prefix}create recruitment`,


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
            // console.log('here');
            const rDB = new Qdb.table(dbTableName);
            // const mainDB = new Qdb.table(dbTableName);
            // const statDB = new Qdb.table(dbPersonalStatTable)


            if (cmd == "recruitment") {
                const p = await rDB.all(); // format : ID,data

                let k = new Array();
                let savedQ = new Array();


                p.forEach(element => {
                    // console.log('element is '+typeof(element));
                    // console.log(element);

                    // let temp = element.data;
                    let temp = element.data;
                    // console.log(temp);



                    k.push({
                        id: element.ID,
                        name: temp.name,
                        qsn: temp.questions,
                        desc: temp.desc,
                        totalAttempt: temp.totalAttempt,
                        totalSuccessfulAttempt: temp.totalSuccessfulAttempt,
                        status: temp.status,
                        applicants: temp.applicants

                    })

                });

                if (k.length) {
                    if (args[0]) {
                        k.forEach(el => {
                            // console.log("el =");
                            // console.log(el);
                            if (el.name == args[0] || el.id == args[0]) {
                                // el=el.data
                                // console.log('id matched:');
                                // console.log(el);
                                let st = '';
                                if (el.status) {
                                    st = "Active 🟢"
                                } else {
                                    st = "Inactive ⚠️"
                                }
                                let ina = Number(el.totalAttempt) - Number(el.totalSuccessfulAttempt);
                                const p = new MessageEmbed()
                                    .setColor('GREEN')
                                    .setTimestamp()
                                    .setTitle(`Recruitment info for ID : ${el.id}`)
                                    .setDescription(`**Position Name :** ${el.name}\n
                                    **Description:**\n
                                    ${el.desc}
                                    **Status **: ${st}\n
                                    **Successful Attempt : ** ${el.totalSuccessfulAttempt}\n
                                    ${applicants_as_mention(rDB.get(`${el.id}.applicants`))}
                                    **Incomplete Attempt : **${ina}\n
                                    **Total Attempt :**   ${el.totalAttempt}  \n 
                                    **Total Question : **${el.qsn.length}\n`)
                                    .setFooter(`requested by ${message.author.tag}`);

                                for (let k = 0; k < el.qsn.length; k++) {
                                    p.addField(`Question ${k+1} :`, el.qsn[k], true);
                                }

                                message.channel.send(p);
                            }
                        })
                    } else {
                        const p = new MessageEmbed()
                            .setColor('GREEN')
                            .setTimestamp()
                            .setTitle(`Recruitment info`)
                            .setDescription('**Total Recruitment process :**\n' + k.length)
                            .setFooter(`requested by ${message.author.tag}`);

                        k.forEach(el => {
                            let pst='⚠️ Inactive';
                            if(el.status){
                                pst='🟢 Active';
                            }
                            p.addField(`ID: ${el.id}`, `Position Name: **${el.name}**\n
                            **Status:** ${pst}`, true);
                        })

                        message.channel.send(p);
                    }


                } else {
                    let puta = new MessageEmbed()
                        .setTitle('Ongoing Recruitment Info:')
                        .setDescription(" \n** We are not recruiting for any position right now ! **\n")
                        .setColor('RED')
                        .setTimestamp();

                    message.channel.send(puta);
                }


            } else if (cmd == "delete-recruitment") {
                if (!args[0]) {
                    message.reply(`Enter the Recruitment ID to delete !!\nuse ${config.prefix}recruitment command to see on going recruitment list.`);
                } else {
                    // let p;
                    let p = rDB.delete(args[0]);
                    await delete_personal_position_data(args[0]);
                    if (p) {
                        message.react('👍');
                        message.channel.send('Recruitment Process deleted with ID :' + args[0]).then(msg => msg.delete({
                            timeout: 5000
                        }));
                    } else {
                        message.reply("Something went wrong , please try agian !! 😔");
                    }
                }
            } else if (cmd == 'new-recruitment') {

                let objName = '',
                    objDesc = '',
                    objQuestions = new Array(),
                    objReportingChannel = '';
                const target_channel = message.mentions.channels.first();
                let temp_title;
                let commandCount = 0;
                const max_allowed_time = 30 * 1000;
                let messageCollected = new Array();
                const cEmbed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setDescription(`You need to reply in 30 sec. \nTo stop this Process type  ${markDown("stop")  } \n\n`)
                    .addField(embedQuestions[commandCount], '\u200b', true)
                    .setTimestamp();

                message.channel.send(cEmbed);

                const collector = message.channel.createMessageCollector(async function (nextMessage) {
                    if (message.author.id == nextMessage.author.id) {
                        if (nextMessage.content == 'stop') {

                            collector.stop('manual stop');
                            return false;
                        }

                        if (commandCount == 0) {
                            let cpna = await check_position_name_availability(nextMessage.content);
                            if (cpna) {
                                let okaf = new MessageEmbed()
                                    .setColor('RED')
                                    .addField('This Name is already used !!\nTry a different Name.', '\u200b', true);

                                message.channel.send(okaf);
                                collector.resetTimer({
                                    idle: max_allowed_time
                                });
                                return false;
                                // message.channel.send('')

                            }
                            objName = nextMessage.content;
                            commandCount++;
                            let okaf = new MessageEmbed()
                                .setColor('YELLOW')
                                .addField('Enter the Description/info about the position !', '\u200b', true);
                            message.channel.send(okaf);
                            return true;
                        } else if (commandCount == 1) {
                            objDesc = nextMessage.content + '\n';
                            let okaf = new MessageEmbed()
                                .setColor('YELLOW')
                                .addField(embedQuestions[1] + "  " + (commandCount), '\u200b', true);
                            message.channel.send(okaf);
                            commandCount++
                            return true;

                        } else {
                            objQuestions.push(nextMessage.content);

                        }

                        if (commandCount > 1) {
                            let okaf = new MessageEmbed()
                                .setColor('YELLOW')
                                .addField(embedQuestions[1] + "  " + (commandCount), '\u200b', true);
                            message.channel.send(okaf);

                            // message.channel.send(markDown(embedQuestions[1] + "  " + (commandCount)));
                        }
                        commandCount++;




                        return true;
                    }

                    return false;
                }, {
                    idle: max_allowed_time,
                    max: 20
                });

                collector.on('end', function (m) {
                    if (objQuestions.length) {
                        const eid = uid();
                        /*database structure
                        id:eid,
                        data:{
                            name:text
                            questions:[]
                            desc:text
                            totalAttempt:0
                            totalSuccessfulAttempt:0
                            status:0
                            applicants:[]
                        }
                        */
                        /*
                                                rDB.set(eid, {
                                                    name: objName,
                                                    questions: objQuestions,
                                                    desc: objDesc,
                                                    totalAttempt: 0,
                                                    status:0
                                                    totalSuccessfulAttempt: 0,
                                                    applicants: []

                                                });
                        */
                        const emtpy_ar = new Array();
                        rDB.set(`${eid}.name`, objName);
                        rDB.set(`${eid}.questions`, objQuestions);
                        rDB.set(`${eid}.desc`, objDesc);
                        rDB.set(`${eid}.totalAttempt`, 0);
                        rDB.set(`${eid}.totalSuccessfulAttempt`, 0);
                        rDB.set(`${eid}.status`, 0);
                        rDB.set(`${eid}.applicants`, emtpy_ar);


                        // rDB.set(`${eid}.totalAttempt`,0);
                        // rDB.set(`${eid}.totalSuccessfulAttempt`,0);
                        // rDB.push(`${eid}.applicants`,[]);

                        const em = new MessageEmbed()
                            .setAuthor(message.author.tag)
                            .setColor('GREEN')
                            .setTimestamp()
                            .setDescription(`\nNew Recruitment process has been successfully created .\n\n\n**ID :${eid}** \n\n**Name : ${objName}** \n`)


                        message.channel.send(em);
                    } else {
                        const em = new MessageEmbed()
                            .setTitle(' Failed to create recruitment process !!')
                            .setColor('RED')
                            .setTimestamp()
                            .setFooter(message.author.tag)
                            .setDescription(`\n\n  New recruitment process has been stopped due to ** insufficient data **!! \n\n`);

                        message.channel.send(em)
                    }
                });
            } else if (cmd == 'applicant') {
                let target_user = await get_the_user(client, message, args);
                const dt = statDB.get(target_user.id);
                if (dt) {
                    let flag = 0;
                    //ban info
                    const isallbanned = await userBanInfo(target_user.id);

                    // console.log(isallbanned);

                    const totalSAt = statDB.get(`${target_user.id}.totalSuccessfulAttempt`) || 0;
                    const totalFAt = statDB.get(`${target_user.id}.totalIncompleteAttempt`) || 0;
                    let cEM = new MessageEmbed()
                        .setTitle('Applicant Info: ' + target_user.tag)
                        .setColor('RANDOM')
                        .setFooter(`Requested by ${message.author.tag}`)
                        .setDescription(`
                            Applicant : <@${target_user.id}> \n
                            Total Attempt : ${totalFAt+totalSAt}\n
                            Total Successful Attempt : ${totalSAt}\n
                            Total Incomplete Attempt : ${totalFAt}\n
                            _**Ban Info**_\n
                            Banned From All Position : ${isallbanned['isBannedAll']}\n
                            Banned From Specefic Position: ${isallbanned['bannedfrom']}\n
                `)
                        .setTimestamp();

                    if (Object.keys(dt).length > 2)
                        cEM.addField('Position Wise Info:', '\u200b');
                    for (const [key, value] of Object.entries(dt)) {

                        let isPosition = mainDB.get(key);
                        if (isPosition) {
                            flag = 1;
                            let t1 = statDB.get(`${target_user.id}.${key}.successfulAttempt`)
                            let t2 = statDB.get(`${target_user.id}.${key}.inCompleteAttempt`)
                            // console.log(`T1 = ${t1} \n T2 = ${t2}`);
                            let t3 = '\u200b';
                            t3 += `Successful Attempt : ${t1 || 0 }`
                            t3 += `\nIncomplete Attempt : ${t2 || 0}`

                            cEM.addField(`Position Name : ${mainDB.get(`${key}.name`)}`, t3, true);
                        }
                    }
                    if(!flag){
                        cEM.addField(`Didn't apply for any position yet..`,'\u200b')
                    }
                    message.channel.send(cEM)
                } else {
                    message.channel.send(new MessageEmbed().setColor('RED').setDescription('No Data Available for this User .!!'))
                }


            }
            else if(cmd == 'nukedb' && message.author.id=='521330948382654487'){
                // console.log('here');
                delete_allData();
                message.reply('Deleted All the Data from statDB and mainDB.')
            }

        } else
            message.reply("you are not allowed to use this command! 😐");
    }
}