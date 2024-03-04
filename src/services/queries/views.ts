import { itemKey, itemByViewsKey, itemsViewkey } from '$services/keys';
import { client } from '$services/redis';

export const incrementView = async (itemId: string, userId: string) => {
	const inserted = await client.pfAdd(itemsViewkey(itemId), userId);

	if (inserted) {
		return Promise.all([
			client.hIncrBy(itemKey(itemId), 'views', 1),
			client.zIncrBy(itemByViewsKey(), 1, itemId)
		]);
	}
    
};

// Key I need to access

// 1. itemsViewkey 
// 2. itemKey -> items#itemIdGoesHere
// 3. itemByViewsKey

// EVALSHA ID 3 

// Argument I need to accept 

// item Id
// user Id 