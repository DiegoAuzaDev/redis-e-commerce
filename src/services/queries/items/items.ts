import type { CreateItemAttrs } from '$services/types';
import { client } from '$services/redis';
import { serialize } from './serialize';
import { genId } from '$services/utils';
import { itemKey, itemByViewsKey, itemsByEndingAtKey } from '$services/keys';
import { deserialize } from './deserialize';


export const getItem = async (id: string) => {
    const item = await client.hGetAll(itemKey(id));
    if(Object.keys(item).length === 0){
        return null ;
    }
    return deserialize(id, item);
};

export const getItems = async (ids: string[]) => {
const commands = ids.map((id)=> {
    return client.hGetAll(itemKey(id))
})
const result = await Promise.all(commands);

return result.map((result, index) => {
    if(Object.keys(result).length === 0 ){
        return null ;
    }
    return deserialize(ids[index], result)
})
};

export const createItem = async (attrs: CreateItemAttrs) => {
    const id = genId();
    const serialized = serialize(attrs)

    await Promise.all([
        client.hSet(itemKey(id) ,serialized),
        client.zAdd(itemByViewsKey(), {
        value : id,
        score: 0
    }), 
    client.zAdd(itemsByEndingAtKey(), {
        value : id, 
        score : attrs.endingAt.toMillis()
    })
    ])

    return id;
};


