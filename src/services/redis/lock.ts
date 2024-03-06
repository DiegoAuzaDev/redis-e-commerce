export const withLock = async (key: string, cb  : ()=> any) => {
	const retryDelaysMs = 100;
	let retries = 20;

	// Generate a random value to store at the look key
};


const buildClientProxy = () => {};

const pause = (duration: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, duration);
	});
};
