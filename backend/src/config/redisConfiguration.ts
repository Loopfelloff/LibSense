import { createClient } from 'redis';
import * as dotenv from 'dotenv'
dotenv.config()
const client = createClient({
    username: 'default',
    password:process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-15956.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 15956
    }
});

client.on('error', err => console.log('Redis Client Error', err));
export {client}





