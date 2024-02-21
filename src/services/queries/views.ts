import { itemKey, itemByViewsKey } from "$services/keys";
import { client } from "$services/redis";

export const incrementView = async (itemId: string, userId: string) => {
return Promise.all([
    client.hIncrBy(itemKey(itemId), "views", 1),
    client.zIncrBy(itemByViewsKey(), 1, itemId)
])
};
