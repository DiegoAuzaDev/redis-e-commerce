import 'dotenv/config';
import { client } from '../src/services/redis';

const run = async () => {
    // await client.hSet('item', {
	// 		color: 'red',
	// 		year: 1950,
	// 		engines: { cylinders: 8 },
	// 		owner: 'null',
	// 		service: 'undefined'
	// 	});
    const item = await client.hGetAll('cars#553');
    console.log(item)
};
run();
