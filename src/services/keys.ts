export const pageCacheKey = (id: string) =>  `pagecache#${id}`;
export const usersKey = (userId: string) => 'users#' + userId;
export const sessionsKey = (sessionId : string) => `sessions#${sessionId}`
export const itemKey = (itemId: string) => `items#${itemId}`;
export const usernamesUniqueKey = () => `usernames:unique`
