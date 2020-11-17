function isUserID(test) {
    let ret=true,tmp=0;
    test = Array.from(test);
    test.forEach(val=>{
        tmp = val.charCodeAt();
        if( tmp <= '0'.charCodeAt()  || tmp>='9'.charCodeAt() )
          ret = false;
    })
    return ret;
}

let d = '15464645664565d6464565456456664';
isUserID(d)








//pass=6Fhvs87Exrdwddr4kRP0rC3qVaykMILe
//key=redis-16635.c241.us-east-1-4.ec2.cloud.redislabs.com:16635