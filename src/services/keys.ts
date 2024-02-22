export const pageCacheKey = (id: string) =>  `pagecache#${id}`;
export const usersKey = (userId: string) => 'users#' + userId;
export const sessionsKey = (sessionId : string) => `sessions#${sessionId}`

export const usernamesUniqueKey = () => `usernames:unique`
export const userLikesKey = (userId: string) => `users:likes#${userId}`;
export const usernamekey = ()=> 'usernames';

// Item 
export const itemKey = (itemId: string) => `items#${itemId}`;
export const itemByViewsKey = ()=> `items:views`
export const itemsByEndingAtKey = ()=> 'items:endingAt';
export const itemsViewkey = (itemId: string)=> `items:views#${itemId}` 

