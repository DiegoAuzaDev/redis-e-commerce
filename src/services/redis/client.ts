import { createClient, defineScript } from 'redis';
import { itemKey, itemByViewsKey, itemsViewkey } from '$services/keys';


const client = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: parseInt(process.env.REDIS_PORT)
	},
	password: process.env.REDIS_PW,
	scripts: {
		addOneAndStore: defineScript({
			NUMBER_OF_KEYS: 1,
			SCRIPT: `
			return redis.call("SET", KEYS[1], 1 + tonumber(ARGV[1]))
			`,
			transformArguments(key: string, value: number) {
				return [key, value.toString()];
				// [''books:count, "5"]
				// EVALSHA <ID> 1 "books:count" "5"
			},
			transformReply(reply) {
				return reply;
			}
		}),

		// increment View Script

		incrementView: defineScript({
			NUMBER_OF_KEYS: 3,
			SCRIPT: `
			local itemsViewKey = KEYS[1]
			local itemsKey = KEYS[2]
			local itemsByViewsKey = KEYS[3]

			local itemId = ARGV[1]
			local userId = ARGV[2]

			local inserted = redis.call("PFADD", itemsViewKey, userId)

			if inserted == 1 then 
				redis.call("HINCRBY", itemsKey, "views", 1 )
				redis.call("ZINCREBY", itemsByViewsKey, 1, itemId)
			end

			`,
			transformArguments(itemId: string, userId: string) {
				return [itemsViewkey(itemId), itemKey(itemId), itemByViewsKey(), itemId, userId];
			},
			transformReply() {}
		})
	}
});

// client.on("connect", async ()=> {
// 	await client.addOneAndStore("books:count", 0)
// 	const result = await client.get('books:count');
// 	console.log(result)
// })

client.on('error', (err) => console.error(err));
client.connect();

export { client };
