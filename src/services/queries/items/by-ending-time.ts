import { client } from "$services/redis";
import {itemKey ,itemsByEndingAtKey } from "$services/keys";
import { deserialize } from "./deserialize";


export const itemsByEndingTime = async (
	order: 'DESC' | 'ASC' = 'DESC',
	offset = 0,
	count = 10
) => {
	const ids = await client.zRange(
		itemsByEndingAtKey(), 
		Date.now(),
		"+inf", {
			BY : "SCORE",
			LIMIT : { 
				offset,
				count
			}
		}
	)
	const result = await Promise.all(ids.map((id)=> {
		return client.hGetAll(itemKey(id))
	}))
	return result.map((item, index) => deserialize(ids[index], item));
};
