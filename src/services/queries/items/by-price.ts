import { client } from '$services/redis';
import { itemKey, itemsByPriceKey } from '$services/keys';
import { deserialize } from './deserialize';

export const itemsByPrice = async (order: 'DESC' | 'ASC' = 'DESC', offset = 0, count = 10) => {
    let result: any = await client.sort(itemsByPriceKey(), {
			GET: [
				'#',
				`${itemKey('*')}->name`,
				`${itemKey('*')}->views`,
				`${itemKey('*')}->endingAt`,
				`${itemKey('*')}->imageUrl`,
				`${itemKey('*')}->price`
			],
			BY: 'nosort',
			DIRECTION: order,
			LIMIT: {
				offset,
				count
			}
		});
		const items = [];
		while (result.length) {
			const [id, name, views, endingAt, imageUrl, price, ...rest] = result;
			const item = deserialize(id, { name, views, endingAt, imageUrl, price });
			items.push(item);
			result = rest;
		}
		return items;
};
