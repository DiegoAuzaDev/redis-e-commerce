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
