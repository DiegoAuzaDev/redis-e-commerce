import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    await client.hSet('item',{
        color: 'red',
        year: 1950
    })
    const item = await client.hGetAll('item');
    console.log(item)
};
run();
