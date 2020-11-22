    /*database structure for -> mainDB table
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

    /*database structure for -> statDB  -> personal stat 
                        id:userID,
                        data:{
                            posID:{    
                                    inCompleteAttempt:0
                                    isBanned:0
                                    successfulAttempt:0

                                 },
                            totalIncompleteAttempt:0
                            totalAttempt:0
                            totalSuccessfulAttempt:0
                            isBannedAll:0
                        }
    */


    const {
        MessageEmbed,
        MessageCollector,
        Client
    } = require("discord.js");
    const Qdb = require('quick.db');
    const config = require("../../config.json")
    const myFunctions = require('../../functions.js');
    const {
        is_allowed
    } = require("../../functions.js");

    /* collector reason documentation
    success= a successful operation
    reason1=Reached Max incomplete Attempt
    reason2=Already applied
    reason3=idle =inactivity
    reason4=user denied to start QnA session 
    reason5=user used 'stop' command
    reason6=





    */

    let DoIhaveData = {
        data: 0,
        cnt: 1
    };

    const die = require('util').promisify(setTimeout);
    let conVal = 0;

    const MaxCollectorTime = 30 * 1000;
    const MAX_IncompleteAttempt = 3;
    const MAX_IncompleteAttemptPersonal = 10;
    const dbTableName = 'recruitment'; // mainDB
    const dbStatTableName = 'recruitmentStat';
    const dbPersonalStatTable = 'recruitmentLog'; //StatDB



    function get_custom_reason(rsn) {
        const Original_reasons = {
            success: 'Successfully Completed the QnA session.',
            reason1: 'User Reached Max incomplete Attempts.',
            reason2: 'User Already applied for this position.',
            reason3: `User didn't reply within ${MaxCollectorTime/1000} seconds.`,
            reason4: 'user denied to start QnA session.',
            reason5: 'user used \'stop\' command.',
            reason6: 'user banned from this Position / all Positions.',
            idle: `User didn't reply within ${MaxCollectorTime/1000} seconds.`
        };
        return Original_reasons[rsn];
    }

    async function get_recruitment_channel(client) {
        let srver;
        let p = await client.guilds.fetch(config.serverId).then(er => {
            srver = er;
        }).catch(console.error);
        const chne = srver.channels.cache.get(config.recruitmentChannel);
        return chne;
    }


    async function getting_positiondata() {
        const mainDB = new Qdb.table(dbTableName);
        const p = await mainDB.all();
        await die(1000);
        let k = new Array();
        let savedQ = new Array();
        p.forEach(element => {

            let temp = JSON.parse(JSON.stringify(element.data));

            if (temp.status) {
                k.push({
                    id: element.ID,
                    name: temp.name,
                    desc: temp.desc,
                    qsn: temp.questions
                })
            }

        });

        return (k);
    }

    let skeleton_em;


    function markDown(txt) {
        const p = "```";
        return p + txt + p;
    }
    const embedQuestions = [
        "Enter The position Name you want Apply for !",
        "Enter Question No:"
    ];

    function uid() {
        const pp = '_' + Math.random().toString(36).substr(2, 9);
        return pp;
    };

    let currentPositionData;
    module.exports = {
        name: "apply",
        category: "Moderation",
        aliases: ["delete-responses"],
        description: "To apply for a position ,create/delete responses (only available in Bot's DM)",
        usage: `${config.prefix}apply\n `,

        run: async function (client, message, args, cmd) {
            if (message.channel.type != 'dm') {
                let temp = "\n This command available only in DM !\n\n";
                temp += "If You can't DM me  ,Make sure you have turned On \"Allow direct messages from server members\" option from Privacy Settings.";
                message.channel.send(new MessageEmbed().setColor('RED').addField(temp, '\u200b').setImage('https://media0.giphy.com/media/ZyatgFIIYsciaf5aZz/giphy.gif'));
                return;
            }

            const mainDB = new Qdb.table(dbTableName);
            const statDB = new Qdb.table(dbPersonalStatTable);

            if (cmd == 'apply') {
                ///////// get opening position data from recruitment table
                const openingPositionData = await getting_positiondata();
                // await die(1000);
                currentPositionData = openingPositionData;
                if (!openingPositionData.length) {
                    message.channel.send(new MessageEmbed().setColor('RED').setDescription(`We are not recruiting for any position  now !! \n`));

                    return;
                }
                // console.log(currentPositionData);
                let maxCount = 10;
                let QSNcount = 0;


                let count = 1;

                try {
                    const temp_em = new MessageEmbed()
                        .setColor('RED')
                        .setTimestamp()
                        .setDescription(`Hi ${message.author},\nWe Have Opening Following Positions !\nFor Which Position you want to apply ? (type the name)`)
                        .setTitle("Opening Positions");
                    openingPositionData.forEach((rt, i) => {
                        temp_em.addField(i + 1, rt.name);
                    })
                    message.author.send(temp_em);
                } catch (error) {
                    console.log('can\'t dm user.');

                    return;
                }


                const p = await message.author.createDM();
                // await die(1000);




                const collector = new MessageCollector(p, async function (msg) {
                    DoIhaveData.cnt = count;

                    if (msg.author.bot) {
                        return false;
                    }

                    if (msg.content.toLowerCase() == 'stop') {
                        // DoIhaveData.cnt=count;
                        collector.stop('reason5');
                        return false;
                    }

                    // console.log('log3 '+ message.author.id);
                    // console.log(`Response No: ${count}  ${msg.content}`);

                    if (count == 1) {
                        let found_nam = 0;
                        openingPositionData.forEach(async el => {

                            if (el.name == msg.content) {
                                found_nam = 1;
                                currentPositionData = el;
                                DoIhaveData.data = 1;


                                // check personal stat before starting the session
                                let chkm = await statDB.get(`${message.author.id}.${currentPositionData.id}.inCompleteAttempt`);
                                let isBannd = await statDB.get(`${message.author.id}.${currentPositionData.id}.isBanned`);
                                let isBanndAll = await statDB.get(`${message.author.id}.isBannedAll`);
                                if (isBannd || isBanndAll) {
                                    collector.stop('reason6');
                                    return false;
                                }
                                if (chkm > MAX_IncompleteAttempt) {
                                    collector.stop('reason1')
                                    return false;
                                }
                                let check_if_already_applied = statDB.get(`${message.author.id}.${currentPositionData.id}.successfulAttempt`);
                                check_if_already_applied = Number(check_if_already_applied);
                                if (check_if_already_applied >= 1) {
                                    // message.author.send(new MessageEmbed()
                                    //     .setDescription('You already applied for this Position !!')
                                    //     .setColor('YELLOW')
                                    // );

                                    collector.stop('reason2');
                                    return false;
                                }





                                // DoIhaveData.cnt=count;
                                count++;
                                maxCount = currentPositionData.qsn.length;
                                //Position Details : 
                                message.author.send(new MessageEmbed()
                                    .setTitle(`Read the description carefully !!`)
                                    .setDescription(`
                                ** Position Name ** : ${currentPositionData.name}\n
                                ** Description ** : ${currentPositionData.desc}\n
                                `)
                                );


                                message.author.send(new MessageEmbed().setDescription(`
                            **For this Position ,you have to answer ${currentPositionData.qsn.length} Questions** !!\n\n
                            **Are Ready For a short QnA session ?**\n ( type yes/no)\n\n
                            Type ${markDown('stop')} to end this process .
                            `));
                                collector.resetTimer({
                                    idle: MaxCollectorTime
                                });
                                return false;
                            }
                        })
                        if (!found_nam) {

                            // console.log(msg.content);

                            message.author.send('Type the position name exactly !!').then(m => m.delete({
                                timeout: 3000
                            }));
                            collector.resetTimer({
                                idle: MaxCollectorTime
                            });
                            return false;
                        }
                    } else if (count == 2) {
                        if (msg.content.toLowerCase() == 'yes' || message.content.toLowerCase() == 'no') {
                            if (msg.content.toLowerCase() == 'yes') {

                                count++;

                                ///creating the 1st question
                                const tmem = new MessageEmbed()
                                    .setTitle(`QnA session with ${message.author.tag} for ${currentPositionData.name} Position !`)
                                    .setDescription('Enter your answer !!')
                                    .setTimestamp()
                                    .setColor('GREEN');
                                skeleton_em = tmem;
                                let tempem = skeleton_em;
                                if (QSNcount < maxCount)
                                    tempem.addField(`Question No: ${QSNcount+1}`, `${currentPositionData.qsn[QSNcount++]}`);

                                message.author.send(tempem);
                                collector.resetTimer({
                                    idle: MaxCollectorTime
                                });

                                //add the stat for user first time
                                // let tespd = await dbPersonalStatTable.get(message.author.id);
                                // if (tespd) {


                                // }



                                return false;
                            } else {

                                collector.stop('reason4')
                                return false;
                            }

                        } else {
                            message.author.send("Type yes/no !!")
                            collector.resetTimer({
                                idle: MaxCollectorTime
                            });
                            return false;
                        }


                    } else if (count >= 3) {
                        if (QSNcount >= maxCount) {
                            // console.log('stop log69');
                            collector.stop('success');
                            return true;
                        }
                        let tempem = new MessageEmbed()
                            .setTitle(`QnA session with ${message.author.tag} for ${currentPositionData.name} Position !`)
                            .setDescription('Enter you answer !!')
                            .setTimestamp()
                            .setColor('GREEN');
                        if (QSNcount < maxCount)
                            tempem.addField(`Question No: ${QSNcount+1}`, `${currentPositionData.qsn[QSNcount++]}`);
                        message.author.send(tempem);
                        count++;
                        return true;
                    }


                    return false;

                }, {
                    idle: MaxCollectorTime
                });


                // collector.on('collect', m => {
                //     console.log("collected : " + m.content);
                // })


                collector.on('end', async (collected, rsn) => {

                    /// calling essentials
                    let final_reason = get_custom_reason(rsn);
                    // console.log("ending reason:"+ rsn);
                    const ongoing = new Qdb.table('epicT');
                    let didit = ongoing.delete(`${message.author.id}`);
                    if (!QSNcount) {
                        let error_em = new MessageEmbed()
                            .setTitle("The process has been stopped !!")
                            .setDescription(`Your ID has been logged  in as 'Incomplete Attempt' .it might cause some trouble if we feels someone trying to abuse the Bot !! `)
                            .addField(`Position Name :`, currentPositionData.name, true)
                            .addField('Applicant : ', `<@${message.author.id}>`, true)
                            .addField('Question Asked : ', QSNcount, true)
                            .addField('Received Responses :', collected.size, true)
                            .addField('Reason : ', final_reason)
                            .setColor('RED')
                            .setTimestamp();
                        message.channel.send(error_em)
                        return;
                    }
                    /// wait 1 sec
                    await die(1000);
                    const log_channel = await get_recruitment_channel(client);

                    // console.log(rsn);


                    if (rsn == 'success') {


                        let positionID = currentPositionData.id;
                        // const dbPersonalStatTable = 'recruitmentLog';
                        // dbPersonalStatTable.set(`${message.author.id}`)
                        //updating Recruitment table -> total attempt ,total successful attempt ,add user id if its not available in applicant array

                        mainDB.add(`${positionID}.totalAttempt`, 1);
                        mainDB.add(`${positionID}.totalSuccessfulAttempt`, 1);

                        let cants = await mainDB.get(`${positionID}.applicants`)
                        cants = new Set(cants);
                        if (!cants.has(message.author.id))
                            mainDB.push(`${positionID}.applicants`, message.author.id);


                        //updating Personal apps table -> personal successful attempt for a position , personal successful attempt for all the time 

                        statDB.add(`${message.author.id}.${currentPositionData.id}.successfulAttempt`, 1);
                        statDB.add(`${message.author.id}.totalSuccessfulAttempt`, 1);


                        /// sending the logs to the Recruitment channel

                        const flog = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle('Received a response from ' + message.author.tag)
                            .setDescription(`**Position Name** : ${currentPositionData.name}\n
                    ID :${currentPositionData.id}\n
                    Total Successful Attempt for this position : ${mainDB.get(`${currentPositionData.id}.totalSuccessfulAttempt`)}\n
                    **Applicant** : <@${message.author.id}>\n\n
                    **__responses__** :

                    `)
                            .setTimestamp();


                        collected = collected.array();
                        collected.forEach((mess, itx) => {
                            flog.addField(`**Question ${itx+1} **: ${currentPositionData.qsn[itx]}`, `**User Response **: ${mess.content}`, true);
                        });

                        try {
                            log_channel.send(flog);

                        } catch (error) {
                            console.log('Faild to send message to Flog channel.');
                        }


                        message.channel.send(new MessageEmbed()
                            .setTitle("Successfully submitted you Responses !!")
                            .setDescription(`Thanks For applying.Please do not message/ping any staff to ask about your application .
                        If you get selected ,you will hear from us very soon .
                        If you are denied ,don't be upset . you may re-apply when applications are open again.`)
                            .addField(`Position Name :`, currentPositionData.name, true)
                            .addField('Applicant : ', `<@${message.author.id}>`, true)
                            .addField('Question Asked : ', currentPositionData.qsn.length, true)
                            .addField('Received Responses :', collected.length, true)
                            .setColor('GREEN')
                            .setTimestamp())



                    } else {
                        // in this block every thing is cz of wrong attempt.
                        // logging all attempt and incomplete attempt 
                        let elseTemp = await statDB.get(`${message.author.id}.totalIncompleteAttempt`);

                        if (Number(elseTemp) + 1 > MAX_IncompleteAttemptPersonal) { /// check user reached the max limit
                            statDB.add(`${message.author.id}.isBannedAll`, 1);
                        }
                        statDB.add(`${message.author.id}.totalIncompleteAttempt`, 1);



                        // logging datas which needs currentPositionData  
                        if (DoIhaveData.data) {
                            //changes in mainDB when currentPositionData is available

                            mainDB.add(`${currentPositionData.id}.totalAttempt`, 1);
                            statDB.add(`${message.author.id}.${currentPositionData.id}.inCompleteAttempt`, 1);

                        }
                        if (rsn == 'idle')
                            final_reason = `Applicant didn't response within ${MaxCollectorTime/1000}seconds !`;

                        let error_em = new MessageEmbed()
                            .setTitle("The process has been stopped !!")
                            .setDescription(`Your ID has been logged  in as 'Incomplete Attempt' .it might cause some trouble if we feels someone trying to abuse the Bot !! `)
                            .addField(`Position Name :`, currentPositionData.name, true)
                            .addField('Applicant : ', `<@${message.author.id}>`, true)
                            .addField('Question Asked : ', QSNcount, true)
                            .addField('Received Responses :', collected.size, true)
                            .addField('Reason : ', final_reason)
                            .setColor('RED')
                            .setTimestamp();
                        //sending message to user 
                        message.channel.send(error_em);
                        //sending message to admins by editing title 
                        error_em.setTitle('Received an Incomplete Attempt');
                        error_em.setDescription(`user ID has been logged  in as 'Incomplete Attempt' .it might cause some trouble if we feels someone trying to abuse the Bot !! `)
                        //adding if user response any question
                        collected = collected.array();
                        collected.forEach((mess, itx) => {
                            error_em.addField(`**Question ${itx+1} **: ${currentPositionData.qsn[itx]}`, `**User Response **: ${mess.content}`, true);
                        });

                        log_channel.send(error_em).catch(er => console.log('failed to send error log to admins '));
                    }




                    // console.log(`collocted : ${m.size}`);
                })
            }
        }
    }