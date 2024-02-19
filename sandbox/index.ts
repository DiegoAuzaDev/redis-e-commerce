import 'dotenv/config';
import { client } from '../src/services/redis';
import { Result } from 'postcss';

const run = async () => {
	await client.hSet('car#1', {
		color: 'red',
		year: 1950
	});
	await client.hSet('car#2', {
		color: 'blue',
		year: 2001
	});
	await client.hSet('car#3', {
		color: 'yellow',
		year: 2004
	});
	const commands = [
		1,2,3,4,5
	].map((id)=> {
		return client.hGetAll("car#" + id)
	})
	const result = await Promise.all(commands)
	console.log(result);
};
run();
