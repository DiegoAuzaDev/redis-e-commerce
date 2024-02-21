import type { CreateUserAttrs } from '$services/types';
import { genId } from '$services/utils';
import { client } from '$services/redis';
import { usersKey, usernamesUniqueKey, usernamekey } from '$services/keys';

export const getUserByUsername = async (username: string) => {
// Use the username argument to look uo the person user Id
const decimalId = await client.zScore(usernamekey(), username);
// with the usernmaes sorted set 

// make sure we actually got an ID from the lookup

if(!decimalId){
	throw new Error("User does not exist");
	
}

// take the id and convert it back to hex 

const id = decimalId.toString(16)

// Use the id to look up the user's hash

const user = await client.hGetAll(usersKey(id))

return deserialize(id, user);
};

export const getUserById = async (id: string) => {
	const user = await client.hGetAll(usersKey(id));

	return deserialize(id, user);
};

export const createUser = async (attrs: CreateUserAttrs) => {
	const id = genId();

	// see if the username is already in the set of usernames
	const exist = await client.sIsMember(usernamesUniqueKey(), attrs.username);
	if (exist) {
		throw new Error('Username is taken');
	}
	await client.hSet(usersKey(id), serialize(attrs));
	await client.sAdd(usernamesUniqueKey(), attrs.username);
	await client.zAdd(usernamekey(),{
		value: attrs.username,
		score : parseInt(id, 16)
	})

	return id;
};

const serialize = (user: CreateUserAttrs) => {
	return {
		username: user.username,
		password: user.password
	};
};

const deserialize = (id: string, user: { [key: string]: string }) => {
	return {
		id: id,
		username: user.username,
		password: user.password
	};
};
