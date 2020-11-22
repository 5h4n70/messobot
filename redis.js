const  redis=require('redis')
const redisPath="//redis-16635.c241.us-east-1-4.ec2.cloud.redislabs.com:16635?password=6Fhvs87Exrdwddr4kRP0rC3qVaykMILe"

module.exports = async function(){
    return await new Promise((resolve,reject) =>{
        const client=redis.createClient({
            url:redisPath
        })
    client.on('error',(err)=>{
        console.error("redis error:",err);
        client.quit();
        reject(err);
    })
    client.on('ready',()=>{
        resolve(client);
    })

    });

};








//pass=6Fhvs87Exrdwddr4kRP0rC3qVaykMILe
//key=redis-16635.c241.us-east-1-4.ec2.cloud.redislabs.com:16635