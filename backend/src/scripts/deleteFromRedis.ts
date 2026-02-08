import { redisClient } from "../config/redisConfiguration.js";

async function doDeletion(){
    const response = await redisClient.flushAll() 
    console.log(response)
}

await doDeletion()
