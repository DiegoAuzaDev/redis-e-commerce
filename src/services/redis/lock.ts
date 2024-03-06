import { randomBytes } from 'crypto';
import { client } from './client';

export const withLock = async (key: string, cb: (redisClient: Client, signal: any) => any) => {
	const retryDelaysMs = 100;
	const timeoutMs = 2000;
	let retries = 20;

	// Generate a random value to store at the look key
	const token = randomBytes(6).toString('hex');
	// Create Look key
	const lockKey = `lock:${key}`;
	// Set up while loop to implement the retry behavaior
	while (retries >= 0) {
		retries--;
		// try to do SET NX operation
		const acquired = await client.set(lockKey, token, {
			NX: true,
			PX: 2000
		});
		if (!acquired) {
			// ELSE brief pause (retryDelayMs)
			await pause(retryDelaysMs);
			continue;
		}

		// IF the set is successful, the run the callback

		try {
			const signal = { expired: false };
			setTimeout(() => {}, timeoutMs);
			const proxiedClient = buildClientProxy(timeoutMs);
			const result = await cb(proxiedClient, signal);
			return result;
		} finally {
			await client.unLock(lockKey, token);
		}

		// unSet the lokeed set
	}
};

type Client = typeof client;
const buildClientProxy = (tineoutMs: number) => {
	const startTime = Date.now();

	const handler = {
		get(target: Client, prop: keyof Client) {
			if (Date.now() >= startTime + tineoutMs) {
				throw new Error('Lock has expired');
			} else {
				const value = target[prop];
				return typeof value === 'function' ? value.bind(target) : value;
			}
		}
	};
	return new Proxy(client, handler) as Client;
};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
